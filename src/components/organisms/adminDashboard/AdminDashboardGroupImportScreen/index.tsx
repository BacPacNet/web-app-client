'use client'

import Buttons from '@/components/atoms/Buttons'
import AdminDashboardShell from '@/components/organisms/adminDashboard/AdminDashboardShell'
import useCookie from '@/hooks/useCookie'
import { subCategories } from '@/types/CommuityGroup'
import { ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE, parseAdminDashboardSelectedUniversity } from '@/utils/adminDashboard'
import { ChangeEvent, useMemo, useRef, useState } from 'react'
import { FiArrowLeft, FiUpload } from 'react-icons/fi'
import { useRouter, useSearchParams } from 'next/navigation'
import * as XLSX from 'xlsx'
import { useAdminDashboardCreateGroups, useAdminDashboardValidateUniqueIds } from '@/services/admin-dashboard-auth'

type GroupImportRow = {
  title: string
  adminId: string
  memberList: string
  description: string
  communityGroupAccess: string
  communityGroupType: string
  communityGroupLabel: string
  communityGroupCategory: string
}

type GroupImportField = keyof GroupImportRow

type RowValidation = Partial<Record<GroupImportField, string>>

type EditableColumn = {
  key: GroupImportField
  label: string
  required?: boolean
}

type SheetSummary = {
  sheetName: string
  rowCount: number
}

type GroupBulkFailedItem = {
  index?: number
  reason?: string
  title?: string
  unresolvedUniqueIds?: {
    adminId?: string[]
    memberList?: string[]
  }
  nonCommunityMemberUniqueIds?: {
    adminId?: string[]
    memberList?: string[]
  }
  nonVerifiedUniqueIds?: {
    adminId?: string[]
    memberList?: string[]
  }
  isValid?: boolean
}

type GroupBulkResponse = {
  success?: boolean
  partialSuccess?: boolean
  message?: string
  summary?: {
    total?: number
    passed?: number
    failed?: number
  }
  data?: {
    failed?: GroupBulkFailedItem[]
    results?: GroupBulkFailedItem[]
  }
}

type ValidationIdSets = {
  unresolved: string[]
  nonCommunity: string[]
  nonVerified: string[]
  any: string[]
}

type ServerErrorIdsByRow = Record<number, Partial<Record<GroupImportField, ValidationIdSets>>>
type UploadRetrySummary = {
  passedCount: number
  failedCount: number
}

const COLUMNS: EditableColumn[] = [
  { key: 'title', label: 'Title', required: true },
  { key: 'adminId', label: 'Admin ID' },
  { key: 'memberList', label: 'Member List' },
  { key: 'description', label: 'Description' },
  { key: 'communityGroupAccess', label: 'Access', required: true },
  { key: 'communityGroupType', label: 'Type', required: true },
  { key: 'communityGroupLabel', label: 'Label', required: true },
  { key: 'communityGroupCategory', label: 'Category JSON' },
]

const ACCESS_VALUES = ['Private', 'Public']
const TYPE_VALUES = ['casual', 'official']
const LABEL_VALUES = ['Course', 'Club', 'Circle', 'Other']
const USER_ID_NOT_FOUND_MESSAGE = 'No user with this id exist'
const USER_ID_NOT_IN_COMMUNITY_MESSAGE = 'User is not part of this community'
const USER_ID_NOT_VERIFIED_MESSAGE = 'User is not verified'

const getErrorPriority = (id: string, idSets: ValidationIdSets) => {
  if (idSets.unresolved.includes(id)) return 0
  if (idSets.nonCommunity.includes(id)) return 1
  if (idSets.nonVerified.includes(id)) return 2
  return 3
}

const getErrorBadgeClass = (id: string, idSets: ValidationIdSets) => {
  if (idSets.unresolved.includes(id)) return 'rounded bg-red-100 px-1.5 py-0.5 text-red-700'
  if (idSets.nonCommunity.includes(id)) return 'rounded bg-amber-100 px-1.5 py-0.5 text-amber-800'
  if (idSets.nonVerified.includes(id)) return 'rounded bg-neutral-700 px-1.5 py-0.5 text-white'
  return 'text-neutral-800'
}

const headerAliasMap: Record<GroupImportField, string[]> = {
  title: ['title', 'group title', 'group name'],
  adminId: ['adminid', 'admin id', 'admin'],
  memberList: ['memberlist', 'member list', 'members'],
  description: ['description', 'about', 'group description'],
  communityGroupAccess: ['communitygroupaccess', 'access', 'group access'],
  communityGroupType: ['communitygrouptype', 'type', 'label'],
  communityGroupLabel: ['communitygrouplabel', 'group type', 'group label'],
  communityGroupCategory: ['communitygroupcategory', 'category', 'categories'],
}

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const normalizeEnum = (value: string, allowedValues: string[]) => {
  const normalized = value.trim().toLowerCase()
  return allowedValues.find((item) => item.toLowerCase() === normalized) || value
}

const toStringValue = (value: unknown): string => {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'object') return JSON.stringify(value)
  return ''
}

const getRowValueByAliases = (row: Record<string, unknown>, aliases: string[]) => {
  const normalizedEntries = Object.entries(row).map(([key, value]) => [normalizeHeader(key), value] as const)
  const normalizedAliasSet = new Set(aliases.map((alias) => normalizeHeader(alias)))
  const match = normalizedEntries.find(([key]) => normalizedAliasSet.has(key))
  return toStringValue(match?.[1] ?? '')
}

const splitMemberIds = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const normalizeUniqueId = (id: string) => id.trim().toUpperCase()

const uniqueIds = (ids: string[]) => {
  const normalizedIds = ids.map((id) => normalizeUniqueId(id)).filter(Boolean)
  return Array.from(new Set(normalizedIds))
}

const getValidationIdsByField = (failedItem: GroupBulkFailedItem, fallbackReason: string) => {
  const extractedAdminIdFromReason = fallbackReason.match(/uniqueId\s+"([^"]+)"/i)?.[1]

  const unresolvedAdminIds = failedItem.unresolvedUniqueIds?.adminId || (extractedAdminIdFromReason ? [extractedAdminIdFromReason] : [])
  const unresolvedMemberIds = failedItem.unresolvedUniqueIds?.memberList || []

  const nonCommunityAdminIds = failedItem.nonCommunityMemberUniqueIds?.adminId || []
  const nonCommunityMemberIds = failedItem.nonCommunityMemberUniqueIds?.memberList || []

  const nonVerifiedAdminIds = failedItem.nonVerifiedUniqueIds?.adminId || []
  const nonVerifiedMemberIds = failedItem.nonVerifiedUniqueIds?.memberList || []

  return {
    adminId: {
      unresolved: uniqueIds(unresolvedAdminIds),
      nonCommunity: uniqueIds(nonCommunityAdminIds),
      nonVerified: uniqueIds(nonVerifiedAdminIds),
      any: uniqueIds([...unresolvedAdminIds, ...nonCommunityAdminIds, ...nonVerifiedAdminIds]),
    },
    memberList: {
      unresolved: uniqueIds(unresolvedMemberIds),
      nonCommunity: uniqueIds(nonCommunityMemberIds),
      nonVerified: uniqueIds(nonVerifiedMemberIds),
      any: uniqueIds([...unresolvedMemberIds, ...nonCommunityMemberIds, ...nonVerifiedMemberIds]),
    },
  }
}

const getFieldErrorMessage = (idSets: { unresolved: string[]; nonCommunity: string[]; nonVerified: string[] }) => {
  const messages: string[] = []
  if (idSets.unresolved.length > 0) messages.push(USER_ID_NOT_FOUND_MESSAGE)
  if (idSets.nonCommunity.length > 0) messages.push(USER_ID_NOT_IN_COMMUNITY_MESSAGE)
  if (idSets.nonVerified.length > 0) messages.push(USER_ID_NOT_VERIFIED_MESSAGE)
  return messages.join(' | ')
}

const parseCategoryValue = (rawValue: string): Record<string, string[]> | null => {
  const trimmed = rawValue.trim()
  if (!trimmed) return null

  try {
    const parsed = JSON.parse(trimmed) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return parsed as Record<string, string[]>
  } catch {
    return null
  }
}

const mapRawRowToGroupRow = (row: Record<string, unknown>): GroupImportRow => {
  const communityGroupCategoryRaw = getRowValueByAliases(row, headerAliasMap.communityGroupCategory)
  const parsedCategory = parseCategoryValue(communityGroupCategoryRaw)

  return {
    title: getRowValueByAliases(row, headerAliasMap.title),
    adminId: getRowValueByAliases(row, headerAliasMap.adminId),
    memberList: getRowValueByAliases(row, headerAliasMap.memberList),
    description: getRowValueByAliases(row, headerAliasMap.description),
    communityGroupAccess: normalizeEnum(getRowValueByAliases(row, headerAliasMap.communityGroupAccess), ACCESS_VALUES),
    communityGroupType: normalizeEnum(getRowValueByAliases(row, headerAliasMap.communityGroupType), TYPE_VALUES),
    communityGroupLabel: normalizeEnum(getRowValueByAliases(row, headerAliasMap.communityGroupLabel), LABEL_VALUES),
    communityGroupCategory: parsedCategory ? JSON.stringify(parsedCategory) : communityGroupCategoryRaw,
  }
}

const isEmptyMappedRow = (row: GroupImportRow) => {
  return COLUMNS.every((column) => !row[column.key]?.trim())
}

const isHeaderLikeMappedRow = (row: GroupImportRow) => {
  const normalizedTitle = normalizeHeader(row.title)
  const normalizedAccess = normalizeHeader(row.communityGroupAccess)
  const normalizedType = normalizeHeader(row.communityGroupType)
  const normalizedLabel = normalizeHeader(row.communityGroupLabel)

  return (
    normalizedTitle === normalizeHeader('title') ||
    normalizedAccess === normalizeHeader('access') ||
    normalizedType === normalizeHeader('type') ||
    normalizedLabel === normalizeHeader('label')
  )
}

const validateRow = (row: GroupImportRow): RowValidation => {
  const errors: RowValidation = {}

  if (!row.title.trim()) {
    errors.title = 'Title is required'
  }

  if (!ACCESS_VALUES.includes(row.communityGroupAccess)) {
    errors.communityGroupAccess = 'Access must be Private or Public'
  }

  if (!TYPE_VALUES.includes(row.communityGroupType)) {
    errors.communityGroupType = 'Type must be casual or official'
  }

  if (!LABEL_VALUES.includes(row.communityGroupLabel)) {
    errors.communityGroupLabel = 'Label must be Course, Club, Circle, or Other'
  }

  if (row.communityGroupCategory.trim()) {
    const parsedCategory = parseCategoryValue(row.communityGroupCategory)
    if (!parsedCategory) {
      errors.communityGroupCategory = 'Category must be valid JSON object'
    } else {
      const allowedCategorySet = new Set(Object.keys(subCategories))
      const invalidCategoryKeys = Object.keys(parsedCategory).filter((key) => !allowedCategorySet.has(key))
      if (invalidCategoryKeys.length > 0) {
        errors.communityGroupCategory = `Invalid categories: ${invalidCategoryKeys.join(', ')}`
      } else {
        const hasInvalidSubcategory = Object.entries(parsedCategory).some(([category, selectedSubcategories]) => {
          if (!Array.isArray(selectedSubcategories)) return true
          const allowedSubcategorySet = new Set(subCategories[category as keyof typeof subCategories] || [])
          return selectedSubcategories.some((item) => !allowedSubcategorySet.has(item))
        })
        if (hasInvalidSubcategory) {
          errors.communityGroupCategory = 'One or more subcategories are invalid'
        }
      }
    }
  }

  return errors
}

export default function AdminDashboardGroupImportScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const communityId = searchParams.get('communityId')
  const [selectedUniversityCookie] = useCookie(ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE)
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState<GroupImportRow[]>([])
  const [passedRows, setPassedRows] = useState<GroupImportRow[]>([])
  const [sheetSummaries, setSheetSummaries] = useState<SheetSummary[]>([])
  const [skippedRows, setSkippedRows] = useState<string[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [hasParsedFile, setHasParsedFile] = useState(false)
  const [serverErrorsByRow, setServerErrorsByRow] = useState<Record<number, Partial<Record<GroupImportField, string>>>>({})
  const [serverErrorIdsByRow, setServerErrorIdsByRow] = useState<ServerErrorIdsByRow>({})
  const [isValidatedWithoutErrors, setIsValidatedWithoutErrors] = useState(false)
  const [uploadRetrySummary, setUploadRetrySummary] = useState<UploadRetrySummary | null>(null)
  const [hasUploadAttempted, setHasUploadAttempted] = useState(false)

  const { mutate: createGroups, isPending: isUploadingGroups } = useAdminDashboardCreateGroups(communityId || '')
  const { mutate: validateUniqueIds, isPending: isValidatingUniqueIds } = useAdminDashboardValidateUniqueIds(communityId || '')

  const selectedUniversity = useMemo(() => {
    if (!selectedUniversityCookie) return null
    return parseAdminDashboardSelectedUniversity(selectedUniversityCookie)
  }, [selectedUniversityCookie])

  const validations = useMemo(() => rows.map((row) => validateRow(row)), [rows])
  const validRowCount = useMemo(() => validations.filter((item) => Object.keys(item).length === 0).length, [validations])
  const invalidRowCount = rows.length - validRowCount

  const handleUploadClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setHasParsedFile(true)
    setIsParsing(true)
    setRows([])
    setPassedRows([])
    setSheetSummaries([])
    setSkippedRows([])
    setServerErrorsByRow({})
    setServerErrorIdsByRow({})
    setIsValidatedWithoutErrors(false)
    setUploadRetrySummary(null)
    setHasUploadAttempted(false)

    // Yield one tick so loading state can render before heavy parsing starts.
    await new Promise((resolve) => setTimeout(resolve, 0))

    try {
      const fileBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(fileBuffer, { type: 'array' })

      const summaries: SheetSummary[] = []
      const skipped: string[] = []
      const parsedRows: GroupImportRow[] = []

      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        const sheetRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' })
        summaries.push({ sheetName, rowCount: sheetRows.length })

        sheetRows.forEach((sheetRow, index) => {
          const mappedRow = mapRawRowToGroupRow(sheetRow)
          const excelRowNumber = index + 2

          if (isHeaderLikeMappedRow(mappedRow) || isEmptyMappedRow(mappedRow)) {
            skipped.push(`${sheetName}:${excelRowNumber}`)
            return
          }

          parsedRows.push(mappedRow)
        })
      })

      setSheetSummaries(summaries)
      setSkippedRows(skipped)
      setRows(parsedRows)
      event.target.value = ''
    } finally {
      setIsParsing(false)
    }
  }

  const handleUploadRows = () => {
    if (!rows.length || invalidRowCount > 0 || !isValidatedWithoutErrors) return

    setHasUploadAttempted(true)
    setServerErrorsByRow({})
    setServerErrorIdsByRow({})

    const payload = rows.map((row) => ({
      ...row,
      memberList: row.memberList
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      communityGroupCategory: row.communityGroupCategory.trim() ? parseCategoryValue(row.communityGroupCategory) : null,
    }))

    const mapFailedRowsToErrors = (response?: GroupBulkResponse, rowIndexMap?: Map<number, number>) => {
      const failedRows = response?.data?.failed
      if (!failedRows?.length) return

      const nextServerErrors: Record<number, Partial<Record<GroupImportField, string>>> = {}
      const nextServerErrorIds: ServerErrorIdsByRow = {}
      failedRows.forEach((failedItem) => {
        if (typeof failedItem.index !== 'number') return
        const mappedIndex = rowIndexMap?.get(failedItem.index) ?? failedItem.index
        const fallbackMessage = failedItem.title ? `Failed to create "${failedItem.title}"` : 'Failed to create this group'
        const reason = failedItem.reason || fallbackMessage
        const idsByField = getValidationIdsByField(failedItem, reason)
        const adminFieldErrorMessage = getFieldErrorMessage(idsByField.adminId)
        const memberFieldErrorMessage = getFieldErrorMessage(idsByField.memberList)

        if (idsByField.adminId.any.length > 0) {
          nextServerErrors[mappedIndex] = {
            ...(nextServerErrors[mappedIndex] || {}),
            adminId: adminFieldErrorMessage,
          }
          nextServerErrorIds[mappedIndex] = {
            ...(nextServerErrorIds[mappedIndex] || {}),
            adminId: idsByField.adminId,
          }
        }

        if (idsByField.memberList.any.length > 0) {
          nextServerErrors[mappedIndex] = {
            ...(nextServerErrors[mappedIndex] || {}),
            memberList: memberFieldErrorMessage,
          }
          nextServerErrorIds[mappedIndex] = {
            ...(nextServerErrorIds[mappedIndex] || {}),
            memberList: idsByField.memberList,
          }
        }

        if (!idsByField.adminId.any.length && !idsByField.memberList.any.length) {
          nextServerErrors[mappedIndex] = {
            ...(nextServerErrors[mappedIndex] || {}),
            title: reason,
          }
        }
      })

      setServerErrorsByRow(nextServerErrors)
      setServerErrorIdsByRow(nextServerErrorIds)
    }

    const handleRequestResult = (response?: GroupBulkResponse) => {
      const failedRows = response?.data?.failed || []
      if (!failedRows.length) {
        if (rows.length > 0) {
          setPassedRows((previousRows) => [...previousRows, ...rows])
          setRows([])
        }
        setUploadRetrySummary(null)
        return
      }

      const failedIndexEntries = failedRows.map((item) => item.index).filter((index): index is number => typeof index === 'number')
      const uniqueFailedIndexes = Array.from(new Set(failedIndexEntries))
      const failedIndexSet = new Set(uniqueFailedIndexes)
      const newlyPassedRows = rows.filter((_, index) => !failedIndexSet.has(index))
      const failedRowsForRetry = uniqueFailedIndexes.map((index) => rows[index]).filter((row): row is GroupImportRow => Boolean(row))
      const passedCountFromSummary = response?.summary?.passed
      const passedCount = typeof passedCountFromSummary === 'number' ? passedCountFromSummary : Math.max(rows.length - failedRowsForRetry.length, 0)

      if (passedCount > 0 && failedRowsForRetry.length > 0 && failedRowsForRetry.length < rows.length) {
        const rowIndexMap = new Map<number, number>()
        uniqueFailedIndexes.forEach((originalIndex, retryIndex) => {
          rowIndexMap.set(originalIndex, retryIndex)
        })
        if (newlyPassedRows.length > 0) {
          setPassedRows((previousRows) => [...previousRows, ...newlyPassedRows])
        }
        setRows(failedRowsForRetry)
        setUploadRetrySummary({
          passedCount,
          failedCount: failedRowsForRetry.length,
        })
        mapFailedRowsToErrors(response, rowIndexMap)
        return
      }

      setUploadRetrySummary(null)
      mapFailedRowsToErrors(response)
    }

    createGroups(payload, {
      onSuccess: (response) => {
        handleRequestResult(response as GroupBulkResponse)
      },
      onError: (error: any) => {
        handleRequestResult(error?.response?.data as GroupBulkResponse)
      },
    })
  }

  const handleValidateUniqueIds = () => {
    if (!rows.length || invalidRowCount > 0) return

    setServerErrorsByRow({})
    setServerErrorIdsByRow({})
    setIsValidatedWithoutErrors(false)

    const payload = rows.map((row) => ({
      ...row,
      memberList: row.memberList
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      communityGroupCategory: row.communityGroupCategory.trim() ? parseCategoryValue(row.communityGroupCategory) : null,
    }))

    const mapFailedRowsToErrors = (response?: GroupBulkResponse) => {
      const failedRows = response?.data?.failed || response?.data?.results?.filter((result) => result.isValid === false)
      if (!failedRows?.length) {
        setIsValidatedWithoutErrors(true)
        return
      }

      const nextServerErrors: Record<number, Partial<Record<GroupImportField, string>>> = {}
      const nextServerErrorIds: ServerErrorIdsByRow = {}
      failedRows.forEach((failedItem) => {
        if (typeof failedItem.index !== 'number') return
        const fallbackMessage = failedItem.title ? `Failed to validate "${failedItem.title}"` : 'Failed to validate this group'
        const reason = failedItem.reason || fallbackMessage
        const idsByField = getValidationIdsByField(failedItem, reason)
        const adminFieldErrorMessage = getFieldErrorMessage(idsByField.adminId)
        const memberFieldErrorMessage = getFieldErrorMessage(idsByField.memberList)

        if (idsByField.adminId.any.length > 0) {
          nextServerErrors[failedItem.index] = {
            ...(nextServerErrors[failedItem.index] || {}),
            adminId: adminFieldErrorMessage,
          }
          nextServerErrorIds[failedItem.index] = {
            ...(nextServerErrorIds[failedItem.index] || {}),
            adminId: idsByField.adminId,
          }
        }

        if (idsByField.memberList.any.length > 0) {
          nextServerErrors[failedItem.index] = {
            ...(nextServerErrors[failedItem.index] || {}),
            memberList: memberFieldErrorMessage,
          }
          nextServerErrorIds[failedItem.index] = {
            ...(nextServerErrorIds[failedItem.index] || {}),
            memberList: idsByField.memberList,
          }
        }

        if (!idsByField.adminId.any.length && !idsByField.memberList.any.length) {
          nextServerErrors[failedItem.index] = {
            ...(nextServerErrors[failedItem.index] || {}),
            title: reason,
          }
        }
      })

      setServerErrorsByRow(nextServerErrors)
      setServerErrorIdsByRow(nextServerErrorIds)
      setIsValidatedWithoutErrors(false)
    }

    validateUniqueIds(payload, {
      onSuccess: (response) => {
        mapFailedRowsToErrors(response as GroupBulkResponse)
      },
      onError: (error: any) => {
        mapFailedRowsToErrors(error?.response?.data as GroupBulkResponse)
        setIsValidatedWithoutErrors(false)
      },
    })
  }

  return (
    <AdminDashboardShell title="Import Groups">
      <div className="flex h-[72vh] flex-col gap-4">
        <div className="flex items-center gap-3">
          <Buttons variant="border" size="small" leftIcon={<FiArrowLeft size={14} />} onClick={() => router.push('/admin-dashboard/groups')}>
            Back to Groups
          </Buttons>
          <Buttons variant="primary" size="small" leftIcon={<FiUpload size={14} />} onClick={handleUploadClick}>
            Add Excel File
          </Buttons>
          <input ref={inputRef} type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
        </div>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
          <p className="font-medium text-neutral-900">{fileName ? `File: ${fileName}` : 'No file selected'}</p>
          {sheetSummaries.length > 0 ? (
            <p className="mt-1 text-xs text-neutral-500">
              Loaded sheets: {sheetSummaries.map((item) => `${item.sheetName} (${item.rowCount})`).join(', ')}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-neutral-500">
            Required fields: `title`, `communityGroupAccess`, `communityGroupType`, `communityGroupLabel`.
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            `communityGroupCategory` is optional. If provided, it must be JSON, for example: {`{"Academic":["Science"]}`}
          </p>
          {skippedRows.length > 0 ? (
            <p className="mt-1 text-xs text-amber-600">
              Skipped rows (empty/header): {skippedRows.length} ({skippedRows.slice(0, 8).join(', ')}
              {skippedRows.length > 8 ? ', ...' : ''})
            </p>
          ) : null}
        </div>

        {uploadRetrySummary ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Uploaded {uploadRetrySummary.passedCount} rows successfully. Keeping only {uploadRetrySummary.failedCount} failed rows for retry.
          </div>
        ) : null}

        {rows.length > 0 && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm">
            <div>
              <span className="font-medium text-neutral-900">
                {hasUploadAttempted ? 'Failed' : 'Rows'}: {rows.length}
              </span>
              {passedRows.length > 0 ? <span className="ml-4 text-emerald-600">Passed: {passedRows.length}</span> : null}
              <span className="ml-4 text-green-600">Valid: {validRowCount}</span>
              <span className="ml-4 text-red-600">Invalid: {invalidRowCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Buttons
                variant="border"
                size="small"
                disabled={invalidRowCount > 0 || rows.length === 0 || isUploadingGroups || isValidatingUniqueIds}
                onClick={handleValidateUniqueIds}
              >
                {isValidatingUniqueIds ? 'Validating...' : 'Validate IDs'}
              </Buttons>
              <Buttons
                variant="primary"
                size="small"
                disabled={invalidRowCount > 0 || rows.length === 0 || isUploadingGroups || isValidatingUniqueIds || !isValidatedWithoutErrors}
                onClick={handleUploadRows}
              >
                {isUploadingGroups ? 'Uploading...' : 'Upload'}
              </Buttons>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto rounded-xl border border-neutral-200">
          {isParsing ? (
            <div className="flex items-center gap-3 px-4 py-6 text-sm text-neutral-600">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-500"></span>
              <p>Loading preview rows from Excel...</p>
            </div>
          ) : rows.length === 0 && passedRows.length === 0 ? (
            <p className="px-4 py-6 text-sm text-neutral-500">
              {hasParsedFile
                ? 'No valid preview rows were found in this file. Please review column names/data or upload another file.'
                : 'Upload an Excel file to preview rows.'}
            </p>
          ) : (
            <div className="space-y-3 p-3">
              <details
                open
                className={`overflow-hidden rounded-lg border ${
                  hasUploadAttempted ? 'border-red-200 bg-red-50/40' : 'border-neutral-200 bg-neutral-50/40'
                }`}
              >
                <summary
                  className={`cursor-pointer select-none px-3 py-2 text-sm font-medium ${hasUploadAttempted ? 'text-red-700' : 'text-neutral-700'}`}
                >
                  {hasUploadAttempted ? 'Failed Rows' : 'Preview Rows'} ({rows.length})
                </summary>
                <div className={`overflow-auto border-t bg-white ${hasUploadAttempted ? 'border-red-200' : 'border-neutral-200'}`}>
                  {rows.length === 0 ? (
                    <p className="px-4 py-4 text-sm text-neutral-500">
                      {hasUploadAttempted ? 'No failed rows to retry.' : 'No preview rows available.'}
                    </p>
                  ) : (
                    <table className="min-w-[1400px] table-fixed border-collapse">
                      <thead className="sticky top-0 bg-neutral-50">
                        <tr className="border-b border-neutral-200 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                          <th className="px-3 py-3">Row</th>
                          {COLUMNS.map((column) => (
                            <th key={column.key} className="px-3 py-3">
                              {column.label} {column.required ? '*' : ''}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, rowIndex) => {
                          const rowErrors = validations[rowIndex]
                          const serverRowErrors = serverErrorsByRow[rowIndex] || {}
                          const serverRowErrorIds = serverErrorIdsByRow[rowIndex] || {}
                          const rowHasErrors = Object.keys(rowErrors).length > 0 || Object.keys(serverRowErrors).length > 0

                          return (
                            <tr
                              key={`${rowIndex}-${row.title}`}
                              className={`border-b border-neutral-100 align-top ${rowHasErrors ? 'bg-red-50/30' : 'bg-white'}`}
                            >
                              <td className="px-3 py-3 text-xs text-neutral-500">{rowIndex + 1}</td>
                              {COLUMNS.map((column) => {
                                const fieldError = rowErrors[column.key]
                                const serverFieldError = serverRowErrors[column.key]
                                const serverFieldErrorIds = serverRowErrorIds[column.key] || {
                                  unresolved: [],
                                  nonCommunity: [],
                                  nonVerified: [],
                                  any: [],
                                }
                                const hasCellError = Boolean(fieldError || (serverFieldError && column.key !== 'memberList'))
                                return (
                                  <td key={column.key} className="px-3 py-3">
                                    <div
                                      className={`min-h-[32px] w-full rounded-md border px-2 py-1.5 text-xs ${
                                        hasCellError ? 'border-red-400 bg-red-50 text-red-700' : 'border-neutral-200 bg-neutral-50 text-neutral-800'
                                      } ${
                                        column.key === 'memberList' || column.key === 'communityGroupCategory'
                                          ? 'min-h-[90px] whitespace-pre-wrap break-words'
                                          : 'break-words'
                                      }`}
                                    >
                                      {column.key === 'memberList' && serverFieldErrorIds.any.length > 0 ? (
                                        <div className="flex flex-wrap gap-1.5">
                                          {Array.from(
                                            new Map(
                                              splitMemberIds(row.memberList).map((memberId, originalIndex) => [
                                                normalizeUniqueId(memberId),
                                                { memberId: normalizeUniqueId(memberId), originalIndex },
                                              ])
                                            ).values()
                                          )
                                            .sort((a, b) => {
                                              const priorityDiff =
                                                getErrorPriority(a.memberId, serverFieldErrorIds) - getErrorPriority(b.memberId, serverFieldErrorIds)
                                              if (priorityDiff !== 0) return priorityDiff
                                              return a.originalIndex - b.originalIndex
                                            })
                                            .map(({ memberId }, memberIndex, sortedIds) => {
                                              const highlightClass = getErrorBadgeClass(memberId, serverFieldErrorIds)
                                              return (
                                                <span key={`${memberId}-${memberIndex}`} className={highlightClass}>
                                                  {memberId}
                                                  {memberIndex < sortedIds.length - 1 ? ',' : ''}
                                                </span>
                                              )
                                            })}
                                        </div>
                                      ) : (
                                        row[column.key] || '-'
                                      )}
                                    </div>
                                    {fieldError ? <p className="mt-1 text-[11px] text-red-600">{fieldError}</p> : null}
                                    {serverFieldErrorIds.unresolved.length > 0 ? (
                                      <p className="mt-1 text-[11px] text-red-600">{USER_ID_NOT_FOUND_MESSAGE}</p>
                                    ) : null}
                                    {serverFieldErrorIds.nonCommunity.length > 0 ? (
                                      <p className="mt-1 text-[11px] text-amber-700">{USER_ID_NOT_IN_COMMUNITY_MESSAGE}</p>
                                    ) : null}
                                    {serverFieldErrorIds.nonVerified.length > 0 ? (
                                      <p className="mt-1 text-[11px] text-neutral-700">{USER_ID_NOT_VERIFIED_MESSAGE}</p>
                                    ) : null}
                                    {serverFieldError && serverFieldErrorIds.any.length === 0 ? (
                                      <p className="mt-1 text-[11px] text-red-600">{serverFieldError}</p>
                                    ) : null}
                                    {serverFieldErrorIds.any.length > 0 && column.key !== 'memberList' ? (
                                      <div className="mt-1 flex flex-wrap gap-1">
                                        {serverFieldErrorIds.any
                                          .map((id, originalIndex) => ({ id, originalIndex }))
                                          .sort((a, b) => {
                                            const priorityDiff =
                                              getErrorPriority(a.id, serverFieldErrorIds) - getErrorPriority(b.id, serverFieldErrorIds)
                                            if (priorityDiff !== 0) return priorityDiff
                                            return a.originalIndex - b.originalIndex
                                          })
                                          .map(({ id }) => (
                                            <span key={id} className={getErrorBadgeClass(id, serverFieldErrorIds)}>
                                              {id}
                                            </span>
                                          ))}
                                      </div>
                                    ) : null}
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </details>

              {passedRows.length > 0 ? (
                <details open className="overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50/40">
                  <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-emerald-700">
                    Passed Rows ({passedRows.length})
                  </summary>
                  <div className="overflow-auto border-t border-emerald-200 bg-white">
                    <table className="min-w-[1400px] table-fixed border-collapse">
                      <thead className="sticky top-0 bg-neutral-50">
                        <tr className="border-b border-neutral-200 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                          <th className="px-3 py-3">Row</th>
                          {COLUMNS.map((column) => (
                            <th key={column.key} className="px-3 py-3">
                              {column.label} {column.required ? '*' : ''}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {passedRows.map((row, rowIndex) => (
                          <tr key={`${rowIndex}-${row.title}`} className="border-b border-neutral-100 align-top bg-emerald-50/20">
                            <td className="px-3 py-3 text-xs text-neutral-500">{rowIndex + 1}</td>
                            {COLUMNS.map((column) => (
                              <td key={column.key} className="px-3 py-3">
                                <div
                                  className={`min-h-[32px] w-full rounded-md border border-emerald-200 bg-emerald-50/30 px-2 py-1.5 text-xs text-neutral-800 ${
                                    column.key === 'memberList' || column.key === 'communityGroupCategory'
                                      ? 'min-h-[90px] whitespace-pre-wrap break-words'
                                      : 'break-words'
                                  }`}
                                >
                                  {row[column.key] || '-'}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </AdminDashboardShell>
  )
}
