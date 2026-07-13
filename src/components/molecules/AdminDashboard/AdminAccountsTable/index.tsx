'use client'

import AdminAccountsRowActionMenu from '@/components/molecules/AdminDashboard/AdminAccountsRowActionMenu'
import { formatDate } from '@/lib/date'
import { getUserProfileSubtitleLines } from '@/lib/userProfileSubtitle'
import { CommunityAdminAccount } from '@/services/communityAdminAccounts'
import Image from 'next/image'
import { useMemo, useState } from 'react'

type Props = {
  admins: CommunityAdminAccount[]
  isLoading?: boolean
  isError?: boolean
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

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.trim().charAt(0) ?? ''
  const last = lastName?.trim().charAt(0) ?? ''

  if (first || last) {
    return `${first}${last}`.toUpperCase()
  }

  return '?'
}

function getAvatarColorClass(userId?: string) {
  const seed = userId || 'unknown'
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLOR_CLASSES[hash % AVATAR_COLOR_CLASSES.length]
}

function getDisplayEmail(admin: CommunityAdminAccount) {
  return admin.email || admin.profile?.email?.[0]?.UniversityEmail || '-'
}

function getDateAddedLabel(admin: CommunityAdminAccount) {
  const dateValue = admin.profile?.communityAdminAddedAt || admin.createdAt
  const formattedDate = formatDate(dateValue)

  return formattedDate ? `Added ${formattedDate}` : '-'
}

export default function AdminAccountsTable({ admins, isLoading = false, isError = false, onViewProfile, className = '' }: Props) {
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({})

  const showingLabel = useMemo(() => {
    if (isLoading) return 'Loading admin accounts...'
    if (admins.length === 0) return 'Showing 0 admin accounts'

    return `Showing ${admins.length} admin account${admins.length === 1 ? '' : 's'}`
  }, [admins.length, isLoading])

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <p className="text-sm text-neutral-500">{showingLabel}</p>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="grid grid-cols-[minmax(220px,1.6fr)_minmax(180px,1.2fr)_minmax(150px,1fr)_18px] items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          <p>Account</p>
          <p>Email</p>
          <p>Date added</p>
          <span className="sr-only">Actions</span>
        </div>

        {isLoading && <p className="px-4 py-6 text-sm text-neutral-500">Loading admin accounts...</p>}

        {!isLoading && isError && <p className="px-4 py-6 text-sm text-red-500">Failed to load admin accounts.</p>}

        {!isLoading && !isError && admins.length === 0 && <p className="px-4 py-6 text-sm text-neutral-500">No admin accounts found.</p>}

        {!isLoading &&
          !isError &&
          admins.map((admin) => {
            const profileImageSrc = failedImageIds[admin._id] ? null : admin.profile?.profile_dp?.imageUrl || null
            const initials = getInitials(admin.firstName, admin.lastName)
            const avatarColorClass = getAvatarColorClass(admin._id)
            const { line1, line2 } = getUserProfileSubtitleLines({
              role: admin.profile?.role,
              study_year: admin.profile?.study_year,
              major: admin.profile?.major,
              occupation: admin.profile?.occupation,
              affiliation: admin.profile?.affiliation,
            })

            return (
              <div
                key={admin._id}
                className="grid grid-cols-[minmax(220px,1.6fr)_minmax(180px,1.2fr)_minmax(150px,1fr)_18px] items-center gap-3 border-b border-neutral-100 px-4 py-3 text-sm last:border-none"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {profileImageSrc ? (
                    <Image
                      src={profileImageSrc}
                      alt={`${admin.firstName} ${admin.lastName}`}
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                      onError={() => {
                        setFailedImageIds((prev) => {
                          if (prev[admin._id]) return prev
                          return { ...prev, [admin._id]: true }
                        })
                      }}
                    />
                  ) : (
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColorClass}`}>
                      {initials}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-inter text-2xs font-semibold text-[#111827]">
                      {admin.firstName} {admin.lastName}
                    </p>
                    {line1 ? <p className="truncate font-inter text-3xs text-neutral-500">{line1}</p> : null}
                    {line2 ? <p className="truncate font-inter text-3xs text-neutral-500">{line2}</p> : null}
                  </div>
                </div>

                <p className="truncate text-2xs text-[#6B7280]">{getDisplayEmail(admin)}</p>
                <p className="truncate text-2xs text-[#9CA3AF]">{getDateAddedLabel(admin)}</p>

                <div className="flex justify-end">
                  <AdminAccountsRowActionMenu
                    userId={admin._id}
                    adminName={`${admin.firstName} ${admin.lastName}`.trim()}
                    avatarUrl={profileImageSrc ?? undefined}
                    initials={initials}
                    avatarColorClass={avatarColorClass}
                    detailOne={line1}
                    detailTwo={line2}
                    onViewProfile={onViewProfile ? () => onViewProfile(admin._id) : undefined}
                  />
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
