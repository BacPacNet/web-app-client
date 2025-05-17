import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import avatar from '@/assets/avatar.png'
import { useUsersProfileForConnections } from '@/services/user'
import { Users } from '@/types/Connections'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

type UserSelectDropdownProps = {
  searchInput: string
  show: boolean
  onSelect: (e: React.MouseEvent, user: Users) => void
  currentUserId: string
  dropdownRef?: React.RefObject<HTMLDivElement>
}

const UserSelectDropdown: React.FC<UserSelectDropdownProps> = ({ searchInput, show, onSelect, currentUserId, dropdownRef }) => {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } = useUsersProfileForConnections(searchInput, 10, true)

  const userProfiles = data?.pages.flatMap((page) => page.users).filter((user) => user._id !== currentUserId) || []

  const containerRef = useRef<HTMLDivElement>(null)

  useInfiniteScroll({
    containerRef,
    onBottomReach: () => {
      fetchNextPage()
    },
    deps: [fetchNextPage, hasNextPage, isFetchingNextPage],
  })

  if (!show) return null

  return (
    <div ref={containerRef} className="w-full mt-2 rounded-lg border border-neutral-200 bg-white max-h-64 overflow-y-auto">
      {isLoading ? (
        <p className="text-center text-sm text-neutral-500 py-4">Loading...</p>
      ) : userProfiles.length > 0 ? (
        userProfiles.map((user) => (
          <div
            key={user._id}
            onClick={(e) => onSelect(e, user)}
            className="flex justify-between w-full hover:bg-neutral-200 px-6 py-2 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Image
                src={user?.profile?.profile_dp?.imageUrl || avatar}
                alt="dp"
                width={44}
                height={44}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold">{user?.firstName}</p>
                <p className="text-2xs text-neutral-600">
                  {user?.profile?.role === 'student' ? `${user.profile.study_year} ` : user?.profile?.occupation}
                </p>
                <p className="text-2xs text-neutral-600">{user?.profile?.role === 'student' ? user.profile.major : user?.profile?.affiliation}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-sm text-neutral-500 py-4">No users found.</p>
      )}

      {isFetchingNextPage && <p className="text-center text-sm text-neutral-500 py-2">Loading more...</p>}
    </div>
  )
}

export default UserSelectDropdown
