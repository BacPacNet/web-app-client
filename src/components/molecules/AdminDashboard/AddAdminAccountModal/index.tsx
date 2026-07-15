'use client'

import Buttons from '@/components/atoms/Buttons'
import AdminUserSearchBar from '@/components/molecules/AdminDashboard/AdminUserSearchBar'
import { useModal } from '@/context/ModalContext'
import { getUserProfileSubtitleLines } from '@/lib/userProfileSubtitle'
import { useAddCommunityAdmin } from '@/services/communityAdminAccounts'
import { useAdminUsersForConnections } from '@/services/user'
import { useUniStore } from '@/store/store'
import { Users } from '@/types/Connections'
import { userTypeEnum } from '@/types/RegisterForm'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa'

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

function getAvatarColorClass(userId: string) {
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLOR_CLASSES[hash % AVATAR_COLOR_CLASSES.length]
}

function getDisplayEmail(user: Users) {
  return user.email || user.profile?.email?.[0]?.UniversityEmail || '-'
}

type Props = {
  existingAdminIds?: string[]
}

export default function AddAdminAccountModal({ existingAdminIds = [] }: Props) {
  const { closeModal } = useModal()
  const { userProfileData } = useUniStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<Users | null>(null)
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  const universityName = userProfileData?.university_name || ''
  const { mutate: addAdmin, isPending } = useAddCommunityAdmin()

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading, isError } = useAdminUsersForConnections(
    searchTerm,
    5,
    Boolean(universityName),
    universityName,
    [],
    [],
    [],
    [],
    userTypeEnum.Faculty
  )
  const users = useMemo(() => {
    const allUsers = data?.pages.flatMap((page) => page.users) || []
    return allUsers
  }, [data, existingAdminIds])

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

  const handleAdd = () => {
    if (!selectedUser) return

    addAdmin(
      { userId: selectedUser._id },
      {
        onSuccess: () => {
          closeModal()
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-start font-poppins text-sm font-bold text-[#3A3B3C]">Add Admin</h3>

        <p className="text-start text-xs text-[#6B7280]">Search for a verified university member to grant admin rights.</p>
      </div>

      <AdminUserSearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by name" />

      <div ref={scrollRef} className="max-h-[280px] overflow-y-auto rounded-xl border border-neutral-200">
        {isLoading ? <p className="px-4 py-6 text-sm text-neutral-500">Searching users...</p> : null}

        {!isLoading && isError ? <p className="px-4 py-6 text-sm text-red-500">Failed to search users.</p> : null}

        {!isLoading && !isError && users.length === 0 ? (
          <p className="px-4 py-6 text-sm text-neutral-500">{searchTerm ? 'No users found.' : 'Start typing to search users.'}</p>
        ) : null}

        {!isLoading &&
          !isError &&
          users.map((user) => {
            const isSelected = selectedUser?._id === user._id
            const profileImageSrc = failedImageIds[user._id] ? null : user.profile?.profile_dp?.imageUrl || null
            const initials = getInitials(user.firstName, user.lastName)
            const avatarColorClass = getAvatarColorClass(user._id)
            const { line1, line2 } = getUserProfileSubtitleLines({
              role: user.profile?.role,
              study_year: user.profile?.study_year,
              major: user.profile?.major,
              occupation: user.profile?.occupation,
              affiliation: user.profile?.affiliation,
            })

            return (
              <button
                key={user._id}
                type="button"
                onClick={() => setSelectedUser(user)}
                className={`flex w-full items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3 text-left transition-colors last:border-none ${
                  isSelected ? 'bg-surface-primary-50' : 'bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
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
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColorClass}`}>
                      {initials}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-2xs font-medium text-[#111827]">
                      {user.firstName} {user.lastName}
                    </p>
                    {line1 ? <p className="truncate text-3xs text-neutral-500">{line1}</p> : null}
                    {line2 ? <p className="truncate text-3xs text-neutral-500">{line2}</p> : null}
                    {/* <p className="truncate text-3xs text-[#9CA3AF]">{getDisplayEmail(user)}</p> */}
                  </div>
                </div>

                {isSelected ? <FaCheck className="h-4 w-4 shrink-0 text-primary-500" /> : null}
              </button>
            )
          })}

        {isFetchingNextPage ? <p className="px-4 py-3 text-center text-sm text-neutral-500">Loading more...</p> : null}
      </div>

      <div className="flex gap-4">
        <Buttons size="small" variant="primary" className="w-full" onClick={handleAdd} disabled={!selectedUser || isPending}>
          {isPending ? 'Adding...' : 'Add Admin'}
        </Buttons>
        <Buttons size="small" variant="shade" className="w-full" onClick={closeModal} disabled={isPending}>
          Cancel
        </Buttons>
      </div>
    </div>
  )
}
