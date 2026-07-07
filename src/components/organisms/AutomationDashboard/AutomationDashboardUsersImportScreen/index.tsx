'use client'

import Buttons from '@/components/atoms/Buttons'
import AutomationDashboardShell from '@/components/organisms/AutomationDashboard/AutomationDashboardShell'
import useCookie from '@/hooks/useCookie'
import { ChangeEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { FiArrowLeft, FiDownload, FiUpload } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { isValid, parse } from 'date-fns'
import { useAdminDashboardBulkRegisterUsers } from '@/services/admin-dashboard-auth'
import { ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE, parseAdminDashboardSelectedUniversity } from '@/utils/adminDashboard'
import { downloadUserImportTemplate } from '@/utils/adminDashboardUsersImportExport'

type SheetSummary = {
  sheetName: string
  rowCount: number
}

type ParsedRow = Record<string, string>
type UserType = 'student' | 'faculty'
type BulkRegisterUsersFailedItem = {
  index?: number
  email?: string
  uniqueId?: string
  err?: string
  reason?: string
}
type BulkRegisterUsersSuccessItem = {
  index?: number
  email?: string
  uniqueId?: string
}
type BulkRegisterUsersResponse = {
  data?: {
    results?: BulkRegisterUsersSuccessItem[]
    failed?: BulkRegisterUsersFailedItem[]
  }
}
type FailedUploadedRow = {
  row: ParsedRow
  errorsByField: Partial<Record<keyof UserImportPayload, string>>
}

const getErrorFieldFromMessage = (message: string): keyof UserImportPayload | null => {
  const normalized = message.toLowerCase()
  if (normalized.includes('birthday') || normalized.includes('birthdate') || normalized.includes('dob') || normalized.includes('date of birth')) {
    return 'birthday'
  }
  if (normalized.includes('email')) return 'email'
  if (normalized.includes('uniqueid') || normalized.includes('unique id') || normalized.includes('roll') || normalized.includes('faculty id')) {
    return 'uniqueId'
  }
  if (normalized.includes('university email')) return 'universityEmail'
  if (normalized.includes('university name')) return 'universityName'
  if (normalized.includes('university id')) return 'universityId'
  if (normalized.includes('password') || normalized.includes('passcode')) return 'password'
  return null
}
type UserImportPayload = {
  userType: UserType
  uniqueId: string
  email: string
  universityEmail: string
  universityName: string
  universityId: string
  firstName: string
  lastName: string
  birthday: string
  major: string
  year: string
  occupation: string
  affiliation: string
  password: string
}

const TARGET_SHEETS: Record<string, UserType> = {
  students: 'student',
  faculty: 'faculty',
}

const PREVIEW_COLUMNS: (keyof UserImportPayload)[] = [
  'userType',
  'uniqueId',
  'email',
  'password',
  'firstName',
  'lastName',
  'birthday',
  'major',
  'year',
  'occupation',
  'affiliation',
]

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const toStringValue = (value: unknown): string => {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'object') return JSON.stringify(value)
  return ''
}

const isEmptyRow = (row: ParsedRow, columns: string[]) => columns.every((column) => !row[column]?.trim())

const isHeaderLikeRow = (row: ParsedRow, columns: string[]) => {
  if (!columns.length) return false
  return columns.every((column) => normalizeHeader(row[column] || '') === normalizeHeader(column))
}

const getValueByAliases = (row: Record<string, unknown>, aliases: string[]) => {
  const rowEntries = Object.entries(row).map(([key, value]) => [normalizeHeader(key), toStringValue(value)] as const)
  const aliasSet = new Set(aliases.map((alias) => normalizeHeader(alias)))
  const match = rowEntries.find(([key]) => aliasSet.has(key))
  return match?.[1] || ''
}

const parseBirthday = (value: string): { normalized: string; error?: string } => {
  const trimmed = value.trim()
  if (!trimmed) return { normalized: '' }

  let normalized = ''

  if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
    normalized = trimmed.replace(/-/g, '/')
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    normalized = trimmed
  } else {
    return { normalized: trimmed, error: 'Birthday must be in DD/MM/YYYY or DD-MM-YYYY format' }
  }

  const parsed = parse(normalized, 'dd/MM/yyyy', new Date())
  if (!isValid(parsed)) {
    return { normalized, error: 'Birthday is not a valid date' }
  }

  return { normalized }
}

const validatePayloadRow = (payload: UserImportPayload): Partial<Record<keyof UserImportPayload, string>> => {
  const errors: Partial<Record<keyof UserImportPayload, string>> = {}

  if (payload.birthday) {
    const birthdayResult = parseBirthday(payload.birthday)
    if (birthdayResult.error) {
      errors.birthday = birthdayResult.error
    }
  }

  return errors
}

type HorizontalScrollBarProps = {
  scrollTargetRef: React.RefObject<HTMLDivElement | null>
  className?: string
}

function HorizontalScrollBar({ scrollTargetRef, className = '' }: HorizontalScrollBarProps) {
  const barRef = useRef<HTMLDivElement | null>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const [showBar, setShowBar] = useState(false)
  const isSyncingScroll = useRef(false)

  useEffect(() => {
    const content = scrollTargetRef.current
    if (!content) return

    const updateMeasurements = () => {
      setContentWidth(content.scrollWidth)
      setShowBar(content.scrollWidth > content.clientWidth)
    }

    const syncFromContent = () => {
      if (!barRef.current || isSyncingScroll.current) return
      isSyncingScroll.current = true
      barRef.current.scrollLeft = content.scrollLeft
      isSyncingScroll.current = false
    }

    updateMeasurements()
    content.addEventListener('scroll', syncFromContent)
    const resizeObserver = new ResizeObserver(updateMeasurements)
    resizeObserver.observe(content)

    return () => {
      content.removeEventListener('scroll', syncFromContent)
      resizeObserver.disconnect()
    }
  }, [scrollTargetRef])

  const syncScrollLeft = (source: HTMLDivElement, target: HTMLDivElement) => {
    if (isSyncingScroll.current) return
    isSyncingScroll.current = true
    target.scrollLeft = source.scrollLeft
    isSyncingScroll.current = false
  }

  if (!showBar) {
    return null
  }

  return (
    <div
      ref={(node) => {
        barRef.current = node
      }}
      className={`shrink-0 overflow-x-auto overflow-y-hidden custom-scrollbar border-t bg-white ${className}`}
      onScroll={(event) => {
        if (scrollTargetRef.current) {
          syncScrollLeft(event.currentTarget, scrollTargetRef.current)
        }
      }}
    >
      <div aria-hidden="true" className="h-3" style={{ width: contentWidth }} />
    </div>
  )
}

type TableHorizontalScrollProps = {
  children: ReactNode
  scrollRef: React.Ref<HTMLDivElement>
  className?: string
}

function TableHorizontalScroll({ children, scrollRef, className = '' }: TableHorizontalScrollProps) {
  return (
    <div
      ref={scrollRef}
      className={`overflow-x-auto overflow-y-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  )
}

const mapSheetRowToPayload = (
  sheetType: UserType,
  row: Record<string, unknown>,
  selectedUniversityName: string,
  selectedUniversityId: string
): UserImportPayload => {
  const uniqueIdFromAliases =
    sheetType === 'student'
      ? getValueByAliases(row, ['roll no', 'rollno', 'roll number', 'student id', 'studentid', 'unique id', 'uniqueid'])
      : getValueByAliases(row, ['unique id', 'uniqueid', 'faculty id', 'facultyid', 'employee id', 'employeeid', 'staff id', 'staffid'])

  const uniqueIdFallback =
    getValueByAliases(row, ['column1', 'column2']) || getValueByAliases(row, ['id', 'identifier']) || getValueByAliases(row, ['roll no', 'rollno'])

  const birthdayResult = parseBirthday(getValueByAliases(row, ['birthday', 'birthdate', 'dob', 'date of birth', 'dateofbirth']))

  return {
    userType: sheetType,
    uniqueId: uniqueIdFromAliases || uniqueIdFallback,
    email: getValueByAliases(row, ['email', 'email address', 'emailaddress']),
    universityEmail: getValueByAliases(row, ['university email', 'universityemail', 'college email', 'collegeemail']),
    universityName: selectedUniversityName || getValueByAliases(row, ['university name', 'universityname', 'college name', 'collegename']),
    universityId: selectedUniversityId || getValueByAliases(row, ['university id', 'universityid', 'college id', 'collegeid']),
    firstName: getValueByAliases(row, ['first name', 'firstname', 'first']),
    lastName: getValueByAliases(row, ['last name', 'lastname', 'last']),
    birthday: birthdayResult.normalized,
    major: getValueByAliases(row, ['major']),
    year: getValueByAliases(row, ['year', 'study year', 'studyyear']),
    occupation: getValueByAliases(row, ['occupation']),
    affiliation: getValueByAliases(row, ['affiliation', 'department']),
    password: getValueByAliases(row, ['password', 'passcode', 'passwd']),
  }
}

export default function AutomationDashboardUsersImportScreen() {
  const router = useRouter()
  const [selectedUniversityCookie] = useCookie(ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE)
  const inputRef = useRef<HTMLInputElement>(null)
  const previewTableScrollRef = useRef<HTMLDivElement>(null)
  const uploadedTableScrollRef = useRef<HTMLDivElement>(null)
  const failedTableScrollRef = useRef<HTMLDivElement>(null)
  const [fileName, setFileName] = useState('')
  const [columns] = useState<string[]>(PREVIEW_COLUMNS as string[])
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [uploadedRows, setUploadedRows] = useState<ParsedRow[]>([])
  const [failedUploadedRows, setFailedUploadedRows] = useState<FailedUploadedRow[]>([])
  const [payloadRows, setPayloadRows] = useState<UserImportPayload[]>([])
  const [uploadedPayloadRows, setUploadedPayloadRows] = useState<UserImportPayload[]>([])
  const [sheetSummaries, setSheetSummaries] = useState<SheetSummary[]>([])
  const [skippedRows, setSkippedRows] = useState<string[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [hasParsedFile, setHasParsedFile] = useState(false)

  const { mutate: bulkRegisterUsers } = useAdminDashboardBulkRegisterUsers()
  const selectedUniversity = useMemo(() => {
    if (!selectedUniversityCookie) return null
    return parseAdminDashboardSelectedUniversity(selectedUniversityCookie)
  }, [selectedUniversityCookie])

  const validations = useMemo(() => payloadRows.map((payload) => validatePayloadRow(payload)), [payloadRows])
  const invalidRowCount = useMemo(() => validations.filter((item) => Object.keys(item).length > 0).length, [validations])
  const invalidRowNumbers = useMemo(
    () =>
      validations
        .map((validation, index) => (Object.keys(validation).length > 0 ? index + 1 : null))
        .filter((rowNumber): rowNumber is number => rowNumber !== null),
    [validations]
  )

  const activeHorizontalScrollRef =
    rows.length > 0 ? previewTableScrollRef : failedUploadedRows.length > 0 ? failedTableScrollRef : uploadedTableScrollRef

  const canUpload = useMemo(() => rows.length > 0 && !isParsing && invalidRowCount === 0, [rows.length, isParsing, invalidRowCount])

  const handleUploadClick = () => {
    inputRef.current?.click()
  }

  const handleExportTemplate = () => {
    downloadUserImportTemplate()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setHasParsedFile(true)
    setIsParsing(true)
    setRows([])
    setUploadedRows([])
    setFailedUploadedRows([])
    setPayloadRows([])
    setUploadedPayloadRows([])
    setSheetSummaries([])
    setSkippedRows([])

    // Yield one tick so loading state can render before heavy parsing starts.
    await new Promise((resolve) => setTimeout(resolve, 0))

    try {
      const fileBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(fileBuffer, { type: 'array' })

      const summaries: SheetSummary[] = []
      const skipped: string[] = []
      const parsedRows: ParsedRow[] = []
      const parsedPayloadRows: UserImportPayload[] = []

      workbook.SheetNames.forEach((sheetName) => {
        const normalizedSheetName = normalizeHeader(sheetName)
        const sheetType = TARGET_SHEETS[normalizedSheetName]
        if (!sheetType) return

        const worksheet = workbook.Sheets[sheetName]
        const sheetRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' })
        summaries.push({ sheetName, rowCount: sheetRows.length })

        const rawColumns =
          sheetRows.length > 0
            ? Object.keys(sheetRows[0])
                .map((key) => key.trim())
                .filter(Boolean)
            : []

        sheetRows.forEach((sheetRow, index) => {
          const excelRowNumber = index + 2
          const mappedRow: ParsedRow = {}
          rawColumns.forEach((column) => {
            mappedRow[column] = toStringValue(sheetRow[column])
          })

          if (isHeaderLikeRow(mappedRow, rawColumns) || isEmptyRow(mappedRow, rawColumns)) {
            skipped.push(`${sheetName}:${excelRowNumber}`)
            return
          }

          const mappedPayload = mapSheetRowToPayload(sheetType, sheetRow, selectedUniversity?.name || '', selectedUniversity?._id || '')
          if (!mappedPayload.email && !mappedPayload.firstName && !mappedPayload.lastName && !mappedPayload.uniqueId) {
            skipped.push(`${sheetName}:${excelRowNumber}`)
            return
          }

          parsedPayloadRows.push(mappedPayload)
          parsedRows.push({
            userType: mappedPayload.userType,
            uniqueId: mappedPayload.uniqueId,
            email: mappedPayload.email,
            universityEmail: mappedPayload.universityEmail,
            universityName: mappedPayload.universityName,
            universityId: mappedPayload.universityId,
            firstName: mappedPayload.firstName,
            lastName: mappedPayload.lastName,
            birthday: mappedPayload.birthday,
            major: mappedPayload.major,
            year: mappedPayload.year,
            occupation: mappedPayload.occupation,
            affiliation: mappedPayload.affiliation,
            password: mappedPayload.password,
          })
        })
      })

      setSheetSummaries(summaries)
      setSkippedRows(skipped)
      setPayloadRows(parsedPayloadRows)
      setRows(parsedRows)
      event.target.value = ''
    } finally {
      setIsParsing(false)
    }
  }

  const handleUploadRows = () => {
    if (!canUpload) return

    const normalizedPayloadRows = payloadRows.map((payload) => ({
      ...payload,
      birthday: payload.birthday ? parseBirthday(payload.birthday).normalized : '',
    }))

    bulkRegisterUsers(normalizedPayloadRows, {
      onSuccess: (response: BulkRegisterUsersResponse) => {
        const failedFromResponse = response?.data?.failed || []
        const failedRowsWithReason: FailedUploadedRow[] = failedFromResponse
          .map((failedItem) => {
            const failedIndex = typeof failedItem.index === 'number' ? failedItem.index : -1
            const matchedRow =
              failedIndex >= 0 && failedIndex < rows.length
                ? rows[failedIndex]
                : rows.find((item) => item.email === failedItem.email && item.uniqueId === failedItem.uniqueId)

            if (!matchedRow) return null

            const errorMessage = failedItem.err || failedItem.reason || 'Failed to upload this row.'
            const errorField = getErrorFieldFromMessage(errorMessage)

            return {
              row: matchedRow,
              errorsByField: errorField ? { [errorField]: errorMessage } : { email: errorMessage },
            }
          })
          .filter((item): item is FailedUploadedRow => Boolean(item))

        const failedIndexSet = new Set(failedFromResponse.map((item) => item.index).filter((index): index is number => typeof index === 'number'))
        const successfulRows = rows.filter((_, index) => !failedIndexSet.has(index))
        const successfulPayloadRows = payloadRows.filter((_, index) => !failedIndexSet.has(index))
        if (successfulRows.length > 0) {
          setUploadedRows((previousRows) => [...previousRows, ...successfulRows])
          setUploadedPayloadRows((previousRows) => [...previousRows, ...successfulPayloadRows])
        }
        setFailedUploadedRows(failedRowsWithReason)
        setPayloadRows([])
        setRows([])
      },
    })
  }

  return (
    <AutomationDashboardShell title="Import Users">
      <div className="flex h-[72vh] flex-col gap-4">
        <div className="flex items-center gap-3">
          <Buttons variant="border" size="small" leftIcon={<FiArrowLeft size={14} />} onClick={() => router.push('/automation/users')}>
            Back to Users
          </Buttons>
          <Buttons variant="primary" size="small" leftIcon={<FiUpload size={14} />} onClick={handleUploadClick}>
            Add Excel File
          </Buttons>
          <Buttons variant="border" size="small" leftIcon={<FiDownload size={14} />} onClick={handleExportTemplate}>
            Export Template
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
          <p className="mt-1 text-xs text-neutral-500">Only `Students` and `Faculty` sheets are loaded. `Summary` and other sheets are ignored.</p>
          <p className="mt-1 text-xs text-neutral-500">Payload `uniqueId` uses student roll number for students and faculty ID for faculty rows.</p>
          {skippedRows.length > 0 ? (
            <p className="mt-1 text-xs text-amber-600">
              Skipped rows (empty/header): {skippedRows.length} ({skippedRows.slice(0, 8).join(', ')}
              {skippedRows.length > 8 ? ', ...' : ''})
            </p>
          ) : null}
        </div>

        {rows.length > 0 && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm">
            <div>
              <span className="font-medium text-neutral-900">Rows: {rows.length}</span>
              {invalidRowCount > 0 ? (
                <span className="ml-4 text-rose-600">
                  Invalid: {invalidRowCount}
                  {invalidRowNumbers.length > 0 ? ` (rows ${invalidRowNumbers.join(', ')})` : null}
                </span>
              ) : null}
              {uploadedRows.length > 0 ? <span className="ml-4 text-emerald-600">Uploaded: {uploadedRows.length}</span> : null}
              {failedUploadedRows.length > 0 ? <span className="ml-4 text-rose-600">Failed: {failedUploadedRows.length}</span> : null}
              {payloadRows.length > 0 ? <span className="ml-4 text-blue-600">Payload Ready: {payloadRows.length}</span> : null}
              {uploadedPayloadRows.length > 0 ? <span className="ml-4 text-emerald-600">Payload Uploaded: {uploadedPayloadRows.length}</span> : null}
            </div>
            <Buttons variant="primary" size="small" disabled={!canUpload} onClick={handleUploadRows}>
              Upload
            </Buttons>
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200">
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            {isParsing ? (
              <div className="flex items-center gap-3 px-4 py-6 text-sm text-neutral-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-primary-500"></span>
                <p>Loading preview rows from Excel...</p>
              </div>
            ) : rows.length === 0 && uploadedRows.length === 0 && failedUploadedRows.length === 0 ? (
              <p className="px-4 py-6 text-sm text-neutral-500">
                {hasParsedFile
                  ? 'No valid preview rows were found in this file. Please review column names/data or upload another file.'
                  : 'Upload an Excel file to preview rows.'}
              </p>
            ) : (
              <div className="space-y-3 p-3">
                {rows.length > 0 ? (
                  <details open className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50/40">
                    <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-neutral-700">
                      Preview Rows ({rows.length})
                    </summary>
                    <TableHorizontalScroll scrollRef={previewTableScrollRef} className="border-t border-neutral-200 bg-white">
                      <table className="min-w-[1200px] table-fixed border-collapse">
                        <thead className="sticky top-0 bg-neutral-50">
                          <tr className="border-b border-neutral-200 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            <th className="px-3 py-3">Row</th>
                            {columns.map((column) => (
                              <th key={column} className="px-3 py-3">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row, rowIndex) => {
                            const rowErrors = validations[rowIndex] || {}

                            return (
                              <tr
                                key={`${rowIndex}-${row.email || row.userName || row.firstName || 'user'}`}
                                className={`border-b border-neutral-100 align-top ${
                                  Object.keys(rowErrors).length > 0 ? 'bg-rose-50/30' : 'bg-white'
                                }`}
                              >
                                <td className="px-3 py-3 text-xs text-neutral-500">{rowIndex + 1}</td>
                                {columns.map((column) => {
                                  const fieldError = rowErrors[column as keyof UserImportPayload]

                                  return (
                                    <td key={column} className="px-3 py-3">
                                      <div
                                        className={`min-h-[32px] w-full rounded-md border px-2 py-1.5 text-xs break-words ${
                                          fieldError
                                            ? 'border-rose-400 bg-rose-50 text-rose-700'
                                            : 'border-neutral-200 bg-neutral-50 text-neutral-800'
                                        }`}
                                      >
                                        {row[column] || '-'}
                                      </div>
                                      {fieldError ? <p className="mt-1 text-[11px] text-rose-600">{fieldError}</p> : null}
                                    </td>
                                  )
                                })}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </TableHorizontalScroll>
                  </details>
                ) : null}

                {uploadedRows.length > 0 ? (
                  <details open className="overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50/40">
                    <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-emerald-700">
                      Successful Rows ({uploadedRows.length})
                    </summary>
                    <TableHorizontalScroll scrollRef={uploadedTableScrollRef} className="border-t border-emerald-200 bg-white">
                      <table className="min-w-[1200px] table-fixed border-collapse">
                        <thead className="sticky top-0 bg-neutral-50">
                          <tr className="border-b border-neutral-200 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            <th className="px-3 py-3">Row</th>
                            {columns.map((column) => (
                              <th key={column} className="px-3 py-3">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {uploadedRows.map((row, rowIndex) => (
                            <tr
                              key={`${rowIndex}-${row.email || row.userName || row.firstName || 'uploaded-user'}`}
                              className="border-b border-neutral-100 align-top bg-emerald-50/20"
                            >
                              <td className="px-3 py-3 text-xs text-neutral-500">{rowIndex + 1}</td>
                              {columns.map((column) => (
                                <td key={column} className="px-3 py-3">
                                  <div className="min-h-[32px] w-full rounded-md border border-emerald-200 bg-emerald-50/30 px-2 py-1.5 text-xs text-neutral-800 break-words">
                                    {row[column] || '-'}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TableHorizontalScroll>
                  </details>
                ) : null}

                {failedUploadedRows.length > 0 ? (
                  <details open className="overflow-hidden rounded-lg border border-rose-200 bg-rose-50/40">
                    <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-rose-700">
                      Failed Rows ({failedUploadedRows.length})
                    </summary>
                    <TableHorizontalScroll scrollRef={failedTableScrollRef} className="border-t border-rose-200 bg-white">
                      <table className="min-w-[1300px] table-fixed border-collapse">
                        <thead className="sticky top-0 bg-neutral-50">
                          <tr className="border-b border-neutral-200 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            <th className="px-3 py-3">Row</th>
                            {columns.map((column) => (
                              <th key={column} className="px-3 py-3">
                                {column}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {failedUploadedRows.map((failedItem, rowIndex) => (
                            <tr
                              key={`${rowIndex}-${failedItem.row.email || failedItem.row.uniqueId || 'failed-user'}`}
                              className="border-b border-neutral-100 align-top bg-rose-50/20"
                            >
                              <td className="px-3 py-3 text-xs text-neutral-500">{rowIndex + 1}</td>
                              {columns.map((column) => (
                                <td key={column} className="px-3 py-3">
                                  <div className="min-h-[32px] w-full rounded-md border border-rose-200 bg-rose-50/30 px-2 py-1.5 text-xs text-neutral-800 break-words">
                                    {failedItem.row[column] || '-'}
                                  </div>
                                  {failedItem.errorsByField[column as keyof UserImportPayload] ? (
                                    <p className="mt-1 text-[11px] text-rose-600">{failedItem.errorsByField[column as keyof UserImportPayload]}</p>
                                  ) : null}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TableHorizontalScroll>
                  </details>
                ) : null}
              </div>
            )}
          </div>
          {(rows.length > 0 || uploadedRows.length > 0 || failedUploadedRows.length > 0) && (
            <HorizontalScrollBar scrollTargetRef={activeHorizontalScrollRef} className="border-neutral-200" />
          )}
        </div>
      </div>
    </AutomationDashboardShell>
  )
}
