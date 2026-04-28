'use client'

import Buttons from '@/components/atoms/Buttons'
import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import UserSearchInput from '@/components/atoms/UserSearchBox'
import SegmentedControl, { SegmentedOption } from '@/components/atoms/SegmentControl'
import avatar from '@assets/avatar.svg'
import useCookie from '@/hooks/useCookie'
import { parseDateOfBirth } from '@/lib/date'
import { useAdminDashboardUsers } from '@/services/admin-dashboard-auth'
import { userTypeEnum } from '@/types/RegisterForm'
import { ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE, parseAdminDashboardSelectedUniversity } from '@/utils/adminDashboard'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import AdminDashboardShell from '../AdminDashboardShell'

const statusFilterOptions: SegmentedOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Students', value: userTypeEnum.Student },
  { label: 'Faculty', value: userTypeEnum.Faculty },
]

export default function AdminDashboardUsersScreen() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [selectedOccupations, setSelectedOccupations] = useState<string[]>([])
  const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>([])
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({})
  const [selectedUniversityCookie] = useCookie(ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE)
  const scrollRef = useRef<HTMLDivElement>(null)

  const selectedUniversity = useMemo(() => {
    if (!selectedUniversityCookie) return null
    return parseAdminDashboardSelectedUniversity(selectedUniversityCookie)
  }, [selectedUniversityCookie])

  const roleFilter = selectedStatus === 'all' ? '' : selectedStatus

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading, isError } = useAdminDashboardUsers(
    selectedUniversity?.name || '',
    searchTerm,
    roleFilter,
    selectedYears,
    selectedMajors,
    selectedOccupations,
    selectedAffiliations
  )

  const users = useMemo(() => data?.pages.flatMap((page) => page.users) || [], [data])

  const yearOptions = useMemo(() => {
    return Array.from(new Set(users.map((user) => user.profile?.study_year).filter((value): value is string => Boolean(value))))
  }, [users])

  const majorOptions = useMemo(() => {
    return Array.from(new Set(users.map((user) => user.profile?.major).filter((value): value is string => Boolean(value))))
  }, [users])

  const occupationOptions = useMemo(() => {
    return Array.from(new Set(users.map((user) => user.profile?.occupation).filter((value): value is string => Boolean(value))))
  }, [users])

  const affiliationOptions = useMemo(() => {
    return Array.from(new Set(users.map((user) => user.profile?.affiliation).filter((value): value is string => Boolean(value))))
  }, [users])

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

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)

    if (value === userTypeEnum.Student) {
      setSelectedOccupations([])
      setSelectedAffiliations([])
      return
    }

    if (value === userTypeEnum.Faculty) {
      setSelectedYears([])
      setSelectedMajors([])
    }
  }

  const showStudentFilters = selectedStatus !== userTypeEnum.Faculty
  const showFacultyFilters = selectedStatus !== userTypeEnum.Student

  return (
    <AdminDashboardShell title="Users">
      <div className="flex h-[72vh] flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[280px] flex-1">
              <UserSearchInput value={searchTerm} onChange={setSearchTerm} />
            </div>

            <Buttons variant="primary" size="medium" leftIcon={<FiPlus size={16} />} onClick={() => router.push('/admin-dashboard/users/import')}>
              Add users
            </Buttons>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
            <div className="w-full max-w-[360px]">
              <SegmentedControl options={statusFilterOptions} value={selectedStatus} onChange={handleStatusChange} />
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              {showStudentFilters ? (
                <>
                  <MultiSelectDropdown
                    options={yearOptions}
                    value={selectedYears}
                    onChange={setSelectedYears}
                    placeholder="Year"
                    err={false}
                    search
                  />
                  <MultiSelectDropdown
                    options={majorOptions}
                    value={selectedMajors}
                    onChange={setSelectedMajors}
                    placeholder="Major"
                    err={false}
                    search
                  />
                </>
              ) : null}

              {showFacultyFilters ? (
                <>
                  <MultiSelectDropdown
                    options={occupationOptions}
                    value={selectedOccupations}
                    onChange={setSelectedOccupations}
                    placeholder="Occupation"
                    err={false}
                    search
                  />
                  <MultiSelectDropdown
                    options={affiliationOptions}
                    value={selectedAffiliations}
                    onChange={setSelectedAffiliations}
                    placeholder="Affiliation"
                    err={false}
                    search
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>

        {!selectedUniversity?.name && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
            Select a university to view and manage its users.
          </div>
        )}

        {selectedUniversity?.name && (
          <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-xl border border-neutral-200">
            <div className="grid grid-cols-6 gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              <p>Name</p>
              <p>DOB</p>
              <p>Status</p>
              <p>Year / Occupation</p>
              <p>Major / Affiliation</p>
              <p>Email</p>
            </div>

            {isLoading && <p className="px-4 py-6 text-sm text-neutral-500">Loading users...</p>}

            {!isLoading && isError && <p className="px-4 py-6 text-sm text-red-500">Failed to load users.</p>}

            {!isLoading && !isError && users.length === 0 && <p className="px-4 py-6 text-sm text-neutral-500">No users found.</p>}

            {!isLoading &&
              !isError &&
              users.map((user) => {
                const isStudent = user.profile?.role === userTypeEnum.Student
                const dob = parseDateOfBirth(user.dob || user.profile?.dob || undefined)
                const profileImageSrc = failedImageIds[user._id] ? avatar : user.profile?.profile_dp?.imageUrl || avatar

                return (
                  <div
                    key={user._id}
                    className="grid grid-cols-6 gap-3 border-b border-neutral-100 px-4 py-3 text-sm text-neutral-700 last:border-none"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={profileImageSrc}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                        onError={() => {
                          setFailedImageIds((prev) => {
                            if (prev[user._id]) return prev
                            return { ...prev, [user._id]: true }
                          })
                        }}
                      />
                      <p className="font-medium text-neutral-900">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <p>{dob || '-'}</p>
                    <p className="capitalize">{user.profile?.role || '-'}</p>
                    <p>{isStudent ? user.profile?.study_year || '-' : user.profile?.occupation || '-'}</p>
                    <p>{isStudent ? user.profile?.major || '-' : user.profile?.affiliation || '-'}</p>
                    <p className="break-words">{user.email || '-'}</p>
                  </div>
                )
              })}

            {isFetchingNextPage && <p className="px-4 py-4 text-sm text-neutral-500">Loading more users...</p>}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  )
}
