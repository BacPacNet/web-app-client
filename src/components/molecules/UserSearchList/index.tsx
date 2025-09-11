import React, { useRef, useState } from 'react'
import Image from 'next/image'
import avatar from '@/assets/avatar.png'
import { useUsersProfileForConnections } from '@/services/user'
import { Users } from '@/types/Connections'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { FaCheck } from 'react-icons/fa'

type UserSelectDropdownProps = {
  searchInput: string
  show: boolean
  onSelect: (e: React.MouseEvent, user: Users) => void
  currentUserId: string
  dropdownRef?: React.RefObject<HTMLDivElement>
  maxHeight?: number
  individualsUsers: Users[] | Users | null | undefined
}

const UserSelectDropdown: React.FC<UserSelectDropdownProps> = ({ searchInput, show, onSelect, currentUserId, individualsUsers, maxHeight = 312 }) => {
  console.log('individualsUsers', individualsUsers)
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } = useUsersProfileForConnections(searchInput, 10, true)
  //  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const userProfiles = data?.pages.flatMap((page) => page.users).filter((user) => user._id !== currentUserId) || []

  const containerRef = useRef<HTMLDivElement>(null)

  const handleSelect = (e: React.MouseEvent, user: Users) => {
    onSelect(e, user)
    //setSelectedUsers((prev) => (prev.includes(user._id) ? prev.filter((id) => id !== user._id) : [...prev, user._id]))
  }

  useInfiniteScroll({
    containerRef,
    onBottomReach: () => {
      fetchNextPage()
    },
    deps: [fetchNextPage, hasNextPage, isFetchingNextPage],
  })

  if (!show) return null

  return (
    <div ref={containerRef} className={`w-full mt-2 rounded-lg border border-neutral-200 bg-white max-h-[50vh] overflow-y-auto `}>
      {isLoading ? (
        <p className="text-center text-sm text-neutral-500 py-4">Loading...</p>
      ) : userProfiles.length > 0 ? (
        userProfiles.map((user) => {
          const isSelected = Array.isArray(individualsUsers) ? individualsUsers.some((u) => u._id === user._id) : false
          return (
            <div
              key={user._id}
              onClick={(e) => {
                handleSelect(e, user)
              }}
              className="flex justify-between items-center w-full hover:bg-neutral-200 px-6 py-2 cursor-pointer expand"
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
              {isSelected && <FaCheck className="w-5 h-5 text-primary shrink-0" />}
            </div>
          )
        })
      ) : (
        <p className="text-center text-sm text-neutral-500 py-4">No users found.</p>
      )}

      {isFetchingNextPage && <p className="text-center text-sm text-neutral-500 py-2">Loading more...</p>}
    </div>
  )
}

export default UserSelectDropdown
