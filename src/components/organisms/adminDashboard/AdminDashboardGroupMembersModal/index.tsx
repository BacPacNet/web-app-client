'use client'

import avatar from '@assets/avatar.svg'
import SegmentedControl, { SegmentedOption } from '@/components/atoms/SegmentControl'
import { useAdminDashboardGroupMembers } from '@/services/admin-dashboard-auth'
import { status } from '@/types/CommuityGroup'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  groupId: string
  groupTitle: string
}

const statusOptions: SegmentedOption[] = [
  { label: 'Joined', value: status.accepted },
  { label: 'Invited', value: status.pending },
]

export default function AdminDashboardGroupMembersModal({ groupId, groupTitle }: Props) {
  const [userStatus, setUserStatus] = useState<string>(status.accepted)
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({})
  const listRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useAdminDashboardGroupMembers(groupId, userStatus, 20)

  const handleProfileClicked = (userId: string) => {
    window.open(`/profile/${userId}`, '_blank', 'noopener,noreferrer')
  }
  const members = useMemo(() => {
    return (
      data?.pages.flatMap((page) => {
        if (Array.isArray(page.data)) return page.data
        if (Array.isArray(page.members)) return page.members
        return []
      }) || []
    )
  }, [data])

  useEffect(() => {
    const container = listRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 16

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="flex h-full flex-col">
      <p className="text-lg font-semibold text-neutral-900">Members</p>
      <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{groupTitle}</p>

      <div className="mt-4">
        <SegmentedControl options={statusOptions} value={userStatus} onChange={setUserStatus} />
      </div>

      <div ref={listRef} className="mt-4 flex-1 overflow-y-auto rounded-xl border border-neutral-200">
        {isLoading && <p className="px-4 py-6 text-sm text-neutral-500">Loading members...</p>}

        {!isLoading && isError && <p className="px-4 py-6 text-sm text-red-500">Failed to load members.</p>}

        {!isLoading && !isError && members.length === 0 && <p className="px-4 py-6 text-sm text-neutral-500">No members found.</p>}

        {!isLoading &&
          !isError &&
          members.map((member) => {
            const userRole = member.role || '-'
            const detail = member.year || member.major || member.occupation || member.affiliation || '-'
            const profileImageSrc = failedImageIds[member._id] ? avatar : member.profileImageUrl || avatar

            return (
              <div
                key={member._id}
                className="grid grid-cols-3 gap-3 border-b border-neutral-100 px-4 py-3 text-sm text-neutral-700 last:border-none"
              >
                <div onClick={() => handleProfileClicked(member._id)} className="flex items-center gap-2 cursor-pointer">
                  <Image
                    src={profileImageSrc}
                    alt={`${member.firstName} ${member.lastName}`}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                    onError={() => {
                      setFailedImageIds((prev) => {
                        if (prev[member._id]) return prev
                        return { ...prev, [member._id]: true }
                      })
                    }}
                  />
                  <p className="break-all font-medium text-neutral-900">
                    {member.firstName} {member.lastName}
                  </p>
                </div>
                <p className="capitalize">{userRole}</p>
                <p className="break-words">{detail}</p>
              </div>
            )
          })}

        {isFetchingNextPage && <p className="px-4 py-4 text-sm text-neutral-500">Loading more members...</p>}
      </div>
    </div>
  )
}
