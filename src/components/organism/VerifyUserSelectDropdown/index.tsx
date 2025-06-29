import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import avatar from '@/assets/avatar.png'
import { Users } from '@/types/Connections'
import { FaCheck } from 'react-icons/fa'
import { userProfileType } from '@/store/userProfileSlice/userProfileType'

type UserSelectDropdownProps = {
  show: boolean
  users: userProfileType[]
  onSelect: (e: React.MouseEvent, user: userProfileType) => void
  currentUserId: string
  selectedUsers: userProfileType[]
  onBottomReach?: () => void
  isLoading?: boolean
  isFetchingMore?: boolean
  hasNextPage?: boolean
}

const VerifyUserSelectDropdown: React.FC<UserSelectDropdownProps> = ({
  show,
  users,
  onSelect,
  currentUserId,
  selectedUsers,
  onBottomReach,
  isLoading = false,
  isFetchingMore = false,
  hasNextPage = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!onBottomReach) return
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        const bottom = scrollTop + clientHeight >= scrollHeight - 10
        if (bottom && hasNextPage && !isFetchingMore) {
          onBottomReach()
        }
      }
    }

    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [onBottomReach, hasNextPage, isFetchingMore])

  // Optional: attach infinite scroll if onBottomReach is provided
  // React.useEffect(() => {
  //   if (!onBottomReach) return
  //   const handleScroll = () => {
  //     if (!containerRef.current) return
  //     const { scrollTop, scrollHeight, clientHeight } = containerRef.current
  //     if (scrollTop + clientHeight >= scrollHeight - 50) {
  //       onBottomReach()
  //     }
  //   }
  //   const container = containerRef.current
  //   container?.addEventListener('scroll', handleScroll)
  //   return () => container?.removeEventListener('scroll', handleScroll)
  // }, [onBottomReach])

  if (!show) return null

  const filteredUsers = users.filter((u) => u._id !== currentUserId)

  return (
    <div ref={containerRef} className="w-full mt-2 rounded-lg border border-neutral-200 bg-white max-h-[50vh] overflow-y-auto">
      {isLoading ? (
        <p className="text-center text-sm text-neutral-500 py-4">Loading...</p>
      ) : filteredUsers.length > 0 ? (
        filteredUsers.map((user) => {
          const isSelected = selectedUsers.some((u) => u._id === user._id)
          return (
            <div
              key={user._id}
              onClick={(e) => onSelect(e, user)}
              className="flex justify-between items-center w-full hover:bg-neutral-200 px-6 py-2 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <Image src={user?.profile_dp?.imageUrl || avatar} alt="dp" width={44} height={44} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold">{user?.firstName}</p>
                  <p className="text-2xs text-neutral-600">{user?.role === 'student' ? `${user?.study_year} ` : user?.occupation}</p>
                  <p className="text-2xs text-neutral-600">{user?.role === 'student' ? user.major : user?.affiliation}</p>
                </div>
              </div>
              {isSelected && <FaCheck className="w-5 h-5 text-primary shrink-0" />}
            </div>
          )
        })
      ) : (
        <p className="text-center text-sm text-neutral-500 py-4">No users found.</p>
      )}

      {isFetchingMore && <p className="text-center text-sm text-neutral-500 py-2">Loading more...</p>}
    </div>
  )
}

export default VerifyUserSelectDropdown
