'use client'

import { FACULTY_AFFILIATION_FILTER_OPTIONS, FACULTY_OCCUPATION_FILTER_OPTIONS } from '@/components/molecules/AdminDashboard/FacultyFilterRow'
import AdminPageHeader from '@/components/molecules/AdminDashboard/AdminPageHeader'
import FacultyFilterToolbar from '@/components/molecules/AdminDashboard/FacultyFilterToolbar'
import FacultyTable from '@/components/molecules/AdminDashboard/FacultyTable'
import { useAdminUsersForConnections } from '@/services/user'
import { useBulkUpdateFacultyProfileByCommunityAdmin } from '@/services/userProfile'
import { useUniStore } from '@/store/store'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { userTypeEnum } from '@/types/RegisterForm'
import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'

type AdminFacultyFilterForm = {
  searchTerm: string
  selectedOccupations: string[]
  selectedAffiliations: string[]
  selectedFacultyIds: string[]
  actionOccupation: string
  actionAffiliation: string
}

const defaultValues: AdminFacultyFilterForm = {
  searchTerm: '',
  selectedOccupations: [],
  selectedAffiliations: [],
  selectedFacultyIds: [],
  actionOccupation: '',
  actionAffiliation: '',
}

export default function AdminFacultyPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { userProfileData } = useUniStore()
  const { watch, setValue } = useForm<AdminFacultyFilterForm>({ defaultValues })

  const searchTerm = watch('searchTerm')
  const selectedOccupations = watch('selectedOccupations')
  const selectedAffiliations = watch('selectedAffiliations')
  const selectedFacultyIds = watch('selectedFacultyIds')
  const actionOccupation = watch('actionOccupation')
  const actionAffiliation = watch('actionAffiliation')

  const universityName = userProfileData?.university_name || ''
  const { mutate: bulkUpdateFacultyProfiles, isPending: isApplyingBulkUpdate } = useBulkUpdateFacultyProfileByCommunityAdmin()

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading, isError } = useAdminUsersForConnections(
    searchTerm,
    20,
    Boolean(universityName),
    universityName,
    [],
    [],
    selectedOccupations,
    selectedAffiliations,
    userTypeEnum.Faculty
  )

  const faculty = useMemo(() => data?.pages.flatMap((page) => page.users) || [], [data])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 16

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }

    container.addEventListener('scroll', onScroll)
    return () => {
      container.removeEventListener('scroll', onScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, universityName])

  const clearSelection = () => {
    setValue('selectedFacultyIds', [])
    setValue('actionOccupation', '')
    setValue('actionAffiliation', '')
  }

  const handleApply = () => {
    if (!selectedFacultyIds.length) return

    if (!actionOccupation && !actionAffiliation) {
      showCustomDangerToast('Select an occupation or affiliation to update')
      return
    }

    bulkUpdateFacultyProfiles(
      {
        userIds: selectedFacultyIds,
        ...(actionOccupation ? { occupation: actionOccupation } : {}),
        ...(actionAffiliation ? { affiliation: actionAffiliation } : {}),
      },
      {
        onSuccess: () => {
          clearSelection()
        },
      }
    )
  }

  const handleCancelSelection = () => {
    clearSelection()
  }

  return (
    <div className="p-8">
      <AdminPageHeader title="Faculty" />

      <div className="mt-6 flex flex-col gap-6">
        <FacultyFilterToolbar
          searchTerm={searchTerm}
          onSearchChange={(value) => setValue('searchTerm', value)}
          occupationOptions={FACULTY_OCCUPATION_FILTER_OPTIONS}
          affiliationOptions={FACULTY_AFFILIATION_FILTER_OPTIONS}
          selectedOccupations={selectedOccupations}
          selectedAffiliations={selectedAffiliations}
          onOccupationChange={(value) => setValue('selectedOccupations', value)}
          onAffiliationChange={(value) => setValue('selectedAffiliations', value)}
          selectedCount={selectedFacultyIds.length}
          actionOccupation={actionOccupation}
          actionAffiliation={actionAffiliation}
          onActionOccupationChange={(value) => setValue('actionOccupation', value)}
          onActionAffiliationChange={(value) => setValue('actionAffiliation', value)}
          onApply={handleApply}
          onCancelSelection={handleCancelSelection}
          isApplying={isApplyingBulkUpdate}
        />

        <div className="flex max-h-[calc(100vh-320px)] min-h-0 flex-col">
          {!universityName ? (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
              University information is required to view faculty.
            </div>
          ) : (
            <FacultyTable
              users={faculty}
              selectedFacultyIds={selectedFacultyIds}
              onSelectionChange={(ids) => setValue('selectedFacultyIds', ids)}
              totalCount={faculty.length}
              isLoading={isLoading}
              isError={isError}
              isFetchingNextPage={isFetchingNextPage}
              scrollContainerRef={scrollRef}
              onViewProfile={(userId) => window.open(`/profile/${userId}`, '_blank', 'noopener,noreferrer')}
              className="min-h-0 flex-1"
            />
          )}
        </div>
      </div>
    </div>
  )
}
