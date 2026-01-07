'use client'

import Spinner from '@/components/atoms/spinner'
import SettingsUnblockUserListItem from '@/components/molecules/SettingsUnblockUserListItem'
import { useBlockUser, useGetUserBlockedList } from '@/services/userProfile'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FaChevronLeft } from 'react-icons/fa'

export const BlockedUsersPage = () => {
  const router = useRouter()
  const { data, isLoading, error } = useGetUserBlockedList()
  const { mutateAsync: mutateBlockUser, isPending } = useBlockUser()
  const queryClient = useQueryClient()

  const handleUnblockUser = async (userId: string) => {
    await mutateBlockUser(userId)
    queryClient.invalidateQueries({ queryKey: ['getUserBlockedList'] })
  }

  return (
    <div className="rounded-lg">
      <div onClick={() => router.back()} className="flex items-center gap-2 pb-4 pt-0  border-b border-neutral-300 cursor-pointer">
        <FaChevronLeft className="text-neutral-500" />
        <span className="text-neutral-500 font-medium text-sm">Account</span>
      </div>
      <div className="py-4">
        <div className="flex flex-col gap-2">
          <h6 className="font-poppins font-bold text-neutral-700 text-[20px]">Blocked Users</h6>
          <p className="text-neutral-500 text-sm ">
            These are your blocked users. They cannot post, message, invite, or search for you. You can unblock them anytime here.
          </p>
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-full min-h-[300px]">
            <Spinner />
          </div>
        ) : data?.blockedUsers?.length > 0 ? (
          data?.blockedUsers?.map((user: any) => (
            <SettingsUnblockUserListItem
              key={user._id}
              firstName={user.firstName}
              lastName={user.lastName}
              id={user._id}
              university={user.university}
              study_year={user.study_year}
              degree={user.degree}
              major={user.major}
              occupation={user.occupation}
              imageUrl={user.imageUrl}
              type={user.type}
              role={user.role}
              affiliation={user.affiliation}
              handleRemoveClick={() => handleUnblockUser(user.id)}
              isRemovePending={isPending}
            />
          ))
        ) : (
          <p className="text-neutral-500 text-sm">No blocked users found</p>
        )}
      </div>
    </div>
  )
}
