'use client'

import { STUDENT_MAJOR_FILTER_OPTIONS, STUDENT_YEAR_FILTER_OPTIONS } from '@/components/molecules/AdminDashboard/StudentFilterRow'
import StudentFilterToolbar from '@/components/molecules/AdminDashboard/StudentFilterToolbar'
import StudentTable from '@/components/molecules/AdminDashboard/StudentTable'
import { useAdminUsersForConnections } from '@/services/user'
import { useUniStore } from '@/store/store'
import { userTypeEnum } from '@/types/RegisterForm'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'

type AdminStudentsFilterForm = {
  searchTerm: string
  selectedYears: string[]
  selectedMajor: string
  selectedStudentIds: string[]
  actionYear: string
  actionMajor: string
}

const defaultValues: AdminStudentsFilterForm = {
  searchTerm: '',
  selectedYears: [],
  selectedMajor: '',
  selectedStudentIds: [],
  actionYear: '',
  actionMajor: '',
}

export default function AdminStudentsPage() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { userProfileData } = useUniStore()
  const { watch, setValue, getValues } = useForm<AdminStudentsFilterForm>({ defaultValues })

  const searchTerm = watch('searchTerm')
  const selectedYears = watch('selectedYears')
  const selectedMajor = watch('selectedMajor')
  const selectedStudentIds = watch('selectedStudentIds')
  const actionYear = watch('actionYear')
  const actionMajor = watch('actionMajor')

  const universityName = userProfileData?.university_name || ''

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading, isError } = useAdminUsersForConnections(
    searchTerm,
    20,
    Boolean(universityName),
    universityName,
    selectedYears,
    selectedMajor ? [selectedMajor] : [],
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

  const handleYearToggle = (year: string) => {
    const currentYears = getValues('selectedYears')
    setValue('selectedYears', currentYears.includes(year) ? currentYears.filter((item) => item !== year) : [...currentYears, year])
  }

  const clearSelection = () => {
    setValue('selectedStudentIds', [])
    setValue('actionYear', '')
    setValue('actionMajor', '')
  }

  const handleApply = () => {
    clearSelection()
  }

  const handleCancelSelection = () => {
    clearSelection()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Students</h1>

      <div className="mt-6 flex flex-col gap-6">
        <StudentFilterToolbar
          searchTerm={searchTerm}
          onSearchChange={(value) => setValue('searchTerm', value)}
          yearOptions={STUDENT_YEAR_FILTER_OPTIONS}
          majorOptions={STUDENT_MAJOR_FILTER_OPTIONS}
          selectedYears={selectedYears}
          selectedMajor={selectedMajor}
          onYearToggle={handleYearToggle}
          onMajorChange={(value) => setValue('selectedMajor', value)}
          selectedCount={selectedStudentIds.length}
          actionYear={actionYear}
          actionMajor={actionMajor}
          onActionYearChange={(value) => setValue('actionYear', value)}
          onActionMajorChange={(value) => setValue('actionMajor', value)}
          onApply={handleApply}
          onCancelSelection={handleCancelSelection}
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
              onViewProfile={(userId) => router.push(`/profile/${userId}`)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
