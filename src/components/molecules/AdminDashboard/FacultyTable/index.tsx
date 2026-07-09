'use client'

import AdminPillBadge from '@/components/molecules/AdminDashboard/AdminPillBadge'
import AdminUserStatusBadge from '@/components/molecules/AdminDashboard/AdminUserStatusBadge'
import FacultyRowActionMenu from '@/components/molecules/AdminDashboard/FacultyRowActionMenu'
import { getInactiveOpacityClass } from '@/lib/utils'
import { Users } from '@/types/Connections'
import Image from 'next/image'
import { useMemo, useState } from 'react'

type FacultyUser = Users & {
  isUserDeactive?: boolean
}

type Props = {
  users: FacultyUser[]
  selectedFacultyIds: string[]
  onSelectionChange: (ids: string[]) => void
  totalCount?: number
  isLoading?: boolean
  isError?: boolean
  isFetchingNextPage?: boolean
  onViewProfile?: (userId: string) => void
  className?: string
}

const AVATAR_COLOR_CLASSES = [
  'bg-surface-primary-50 text-primary-500',
  'bg-sky-50 text-sky-600',
  'bg-pink-50 text-pink-600',
  'bg-amber-50 text-amber-600',
  'bg-teal-50 text-teal-600',
]

const CHECKBOX_CLASS =
  "h-4 w-4 shrink-0 appearance-none rounded border-2 border-neutral-200 cursor-pointer checked:bg-primary checked:border-primary relative after:content-[''] after:absolute after:w-[4px] after:h-[8px] after:border-r-2 after:border-b-2 after:border-white after:rotate-45 after:top-[1.5px] after:left-[5px] checked:after:block after:hidden"

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.trim().charAt(0) ?? ''
  const last = lastName?.trim().charAt(0) ?? ''

  if (first || last) {
    return `${first}${last}`.toUpperCase()
  }

  return '?'
}

function getAvatarColorClass(userId: string) {
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLOR_CLASSES[hash % AVATAR_COLOR_CLASSES.length]
}

function getDisplayEmail(user: FacultyUser) {
  return user.email || user.profile?.email?.[0]?.UniversityEmail || '-'
}

function isUserActive(user: FacultyUser) {
  return !user.isUserDeactive
}

export default function FacultyTable({
  users,
  selectedFacultyIds,
  onSelectionChange,
  totalCount,
  isLoading = false,
  isError = false,
  isFetchingNextPage = false,
  onViewProfile,
  className = '',
}: Props) {
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({})

  const allSelected = users.length > 0 && users.every((user) => selectedFacultyIds.includes(user._id))
  const someSelected = users.some((user) => selectedFacultyIds.includes(user._id))

  const showingLabel = useMemo(() => {
    const total = totalCount ?? users.length
    const visible = users.length

    if (isLoading) return 'Loading faculty...'
    if (total === 0) return 'Showing 0 of 0 faculty'

    return `Showing ${visible} of ${total} faculty`
  }, [isLoading, totalCount, users.length])

  const handleSelectAll = () => {
    if (allSelected) {
      const visibleIds = new Set(users.map((user) => user._id))
      onSelectionChange(selectedFacultyIds.filter((id) => !visibleIds.has(id)))
      return
    }

    const mergedIds = new Set([...selectedFacultyIds, ...users.map((user) => user._id)])
    onSelectionChange(Array.from(mergedIds))
  }

  const handleSelectOne = (userId: string) => {
    if (selectedFacultyIds.includes(userId)) {
      onSelectionChange(selectedFacultyIds.filter((id) => id !== userId))
      return
    }

    onSelectionChange([...selectedFacultyIds, userId])
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <p className="text-sm text-neutral-500">{showingLabel}</p>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="grid grid-cols-[40px_minmax(180px,1.4fr)_minmax(160px,1.2fr)_minmax(120px,1fr)_minmax(150px,1.1fr)_130px_18px] items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(input) => {
                if (input) input.indeterminate = someSelected && !allSelected
              }}
              onChange={handleSelectAll}
              className={CHECKBOX_CLASS}
              aria-label="Select all faculty"
            />
          </div>
          <p>Name</p>
          <p>Email</p>
          <p>Affiliation</p>
          <p>Occupation</p>
          <p>Status</p>
          <span className="sr-only">Actions</span>
        </div>

        {isLoading && <p className="px-4 py-6 text-sm text-neutral-500">Loading faculty...</p>}

        {!isLoading && isError && <p className="px-4 py-6 text-sm text-red-500">Failed to load faculty.</p>}

        {!isLoading && !isError && users.length === 0 && <p className="px-4 py-6 text-sm text-neutral-500">No faculty found.</p>}

        {!isLoading &&
          !isError &&
          users.map((user) => {
            const isSelected = selectedFacultyIds.includes(user._id)
            const isActive = isUserActive(user)
            const profileImageSrc = failedImageIds[user._id] ? null : user.profile?.profile_dp?.imageUrl || null
            const initials = getInitials(user.firstName, user.lastName)
            const avatarColorClass = getAvatarColorClass(user._id)
            const inactiveOpacityClass = getInactiveOpacityClass(isActive)

            return (
              <div
                key={user._id}
                className={`grid grid-cols-[40px_minmax(180px,1.4fr)_minmax(160px,1.2fr)_minmax(120px,1fr)_minmax(150px,1.1fr)_130px_18px] items-center gap-3 border-b border-neutral-100 px-4 py-3 text-sm last:border-none ${
                  isSelected ? 'bg-surface-primary-50' : 'bg-white'
                }`}
              >
                <div className={`flex items-center justify-center ${inactiveOpacityClass}`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectOne(user._id)}
                    className={CHECKBOX_CLASS}
                    aria-label={`Select ${user.firstName} ${user.lastName}`}
                  />
                </div>

                <div className={`flex min-w-0 items-center gap-3 ${inactiveOpacityClass}`}>
                  {profileImageSrc ? (
                    <Image
                      src={profileImageSrc}
                      alt={`${user.firstName} ${user.lastName}`}
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded-full object-cover"
                      onError={() => {
                        setFailedImageIds((prev) => {
                          if (prev[user._id]) return prev
                          return { ...prev, [user._id]: true }
                        })
                      }}
                    />
                  ) : (
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColorClass}`}>
                      {initials}
                    </div>
                  )}

                  <p className="truncate text-xs font-medium font-inter text-[#111827]">
                    {user.firstName} {user.lastName}
                  </p>
                </div>

                <p className={`truncate text-2xs text-[#9CA3AF] ${inactiveOpacityClass}`}>{getDisplayEmail(user)}</p>
                <p className={`truncate text-2xs font-medium font-inter text-[#111827] ${inactiveOpacityClass}`}>
                  {user.profile?.affiliation || '-'}
                </p>
                <AdminPillBadge label={user.profile?.occupation} isUserActive={isActive} />
                <AdminUserStatusBadge isActive={isActive} />

                <div className="flex justify-end">
                  <FacultyRowActionMenu
                    userId={user._id}
                    facultyName={`${user.firstName} ${user.lastName}`.trim()}
                    avatarUrl={profileImageSrc ?? undefined}
                    initials={initials}
                    avatarColorClass={avatarColorClass}
                    occupation={user.profile?.occupation}
                    affiliation={user.profile?.affiliation}
                    isActive={isActive}
                    onViewProfile={onViewProfile ? () => onViewProfile(user._id) : undefined}
                  />
                </div>
              </div>
            )
          })}

        {isFetchingNextPage && <p className="px-4 py-4 text-sm text-neutral-500">Loading more faculty...</p>}
      </div>
    </div>
  )
}
