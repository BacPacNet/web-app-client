'use client'

import { STUDENT_MAJOR_FILTER_OPTIONS, STUDENT_YEAR_FILTER_OPTIONS } from '@/components/molecules/AdminDashboard/StudentFilterRow'
import AdminPageHeader from '@/components/molecules/AdminDashboard/AdminPageHeader'
import StudentFilterToolbar from '@/components/molecules/AdminDashboard/StudentFilterToolbar'
import StudentTable from '@/components/molecules/AdminDashboard/StudentTable'
import { useAdminUsersForConnections } from '@/services/user'
import { useBulkUpdateStudentProfileByCommunityAdmin } from '@/services/userProfile'
import { useUniStore } from '@/store/store'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { userTypeEnum } from '@/types/RegisterForm'
import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'

type AdminStudentsFilterForm = {
  searchTerm: string
  selectedYears: string[]
  selectedMajors: string[]
  selectedStudentIds: string[]
  actionYear: string
  actionMajor: string
}

const defaultValues: AdminStudentsFilterForm = {
  searchTerm: '',
  selectedYears: [],
  selectedMajors: [],
  selectedStudentIds: [],
  actionYear: '',
  actionMajor: '',
}

export default function AdminStudentsPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { userProfileData } = useUniStore()
  const { watch, setValue } = useForm<AdminStudentsFilterForm>({ defaultValues })

  const searchTerm = watch('searchTerm')
  const selectedYears = watch('selectedYears')
  const selectedMajors = watch('selectedMajors')
  const selectedStudentIds = watch('selectedStudentIds')
  const actionYear = watch('actionYear')
  const actionMajor = watch('actionMajor')

  const universityName = userProfileData?.university_name || ''
  const { mutate: bulkUpdateStudentProfiles, isPending: isApplyingBulkUpdate } = useBulkUpdateStudentProfileByCommunityAdmin()

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading, isError } = useAdminUsersForConnections(
    searchTerm,
    20,
    Boolean(universityName),
    universityName,
    selectedYears,
    selectedMajors,
    [],
    [],
    userTypeEnum.Student
  )

  const students = useMemo(() => data?.pages.flatMap((page) => page.users) || [], [data])

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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const clearSelection = () => {
    setValue('selectedStudentIds', [])
    setValue('actionYear', '')
    setValue('actionMajor', '')
  }

  const handleApply = () => {
    if (!selectedStudentIds.length) return

    if (!actionYear && !actionMajor) {
      showCustomDangerToast('Select a year or major to update')
      return
    }

    bulkUpdateStudentProfiles(
      {
        userIds: selectedStudentIds,
        ...(actionYear ? { study_year: actionYear } : {}),
        ...(actionMajor ? { major: actionMajor } : {}),
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
      <AdminPageHeader title="Students" />

      <div className="mt-6 flex flex-col gap-6">
        <StudentFilterToolbar
          searchTerm={searchTerm}
          onSearchChange={(value) => setValue('searchTerm', value)}
          yearOptions={STUDENT_YEAR_FILTER_OPTIONS}
          majorOptions={STUDENT_MAJOR_FILTER_OPTIONS}
          selectedYears={selectedYears}
          selectedMajors={selectedMajors}
          onYearChange={(value) => setValue('selectedYears', value)}
          onMajorChange={(value) => setValue('selectedMajors', value)}
          selectedCount={selectedStudentIds.length}
          actionYear={actionYear}
          actionMajor={actionMajor}
          onActionYearChange={(value) => setValue('actionYear', value)}
          onActionMajorChange={(value) => setValue('actionMajor', value)}
          onApply={handleApply}
          onCancelSelection={handleCancelSelection}
          isApplying={isApplyingBulkUpdate}
        />

        <div ref={scrollRef} className="max-h-[calc(100vh-320px)] overflow-y-auto">
          {!universityName ? (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
              University information is required to view students.
            </div>
          ) : (
            <StudentTable
              users={students}
              selectedStudentIds={selectedStudentIds}
              onSelectionChange={(ids) => setValue('selectedStudentIds', ids)}
              totalCount={students.length}
              isLoading={isLoading}
              isError={isError}
              isFetchingNextPage={isFetchingNextPage}
              onViewProfile={(userId) => window.open(`/profile/${userId}`, '_blank', 'noopener,noreferrer')}
            />
          )}
        </div>
      </div>
    </div>
  )
}
