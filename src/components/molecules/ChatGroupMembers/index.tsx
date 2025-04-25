'use client'
import { userTypeEnum } from '@/types/RegisterForm'
import Image from 'next/image'
import React, { useState } from 'react'
import avatar from '@assets/avatar.svg'
import { useRemoveGroupChatMember } from '@/services/Messages'
import { Spinner } from '@/components/spinner/Spinner'

type User = {
  userId: {
    _id: string
    firstName: string
    lastName: string
    role: userTypeEnum
    occupation: string
    affiliation: string
    major: string
    studyYear: string
  }
  isOnline?: boolean
  isStarred: boolean
}
type Props = {
  users: User[]
  chatId: string
  adminId: string
}

const ChatGroupMembers = ({ users, chatId, adminId }: Props) => {
  const [usersList, setUsersList] = useState(users || [])

  const { mutateAsync, isPending } = useRemoveGroupChatMember(chatId)
  const [removing, setRemoving] = useState('')
  const handleRemoveUser = async (userIdToRemove: string) => {
    setRemoving(userIdToRemove)
    const res: any = await mutateAsync({ userToToggleId: userIdToRemove })

    if (res?.id) {
      const newUserList = usersList.filter((user) => user.userId._id !== res?.id)
      setUsersList(newUserList)
    }
    setRemoving('')
  }

  return (
    <div className="w-[400px] mt-2 rounded-b-lg  bg-white max-h-64 overflow-y-auto">
      <p className="font-bold text-md font-poppins text-neutral-900">Members</p>
      {usersList?.length == 1 ? (
        <div>No Members Yet</div>
      ) : (
        usersList?.length > 1 &&
        usersList.map((user: any) => {
          if (adminId == user?.userId?._id) return
          return (
            <div
              key={user._id}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              className="flex justify-between items-center w-full hover:bg-neutral-200  py-2 cursor-pointer transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <Image src={user?.userId?.profileDp || avatar} alt="dp" width={44} height={44} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold">{user?.userId.firstName}</p>
                  <p className="text-2xs text-neutral-600">
                    {user?.profile?.role == 'student' ? `${user.userId.study_year} ` : user?.userId?.occupation}
                  </p>
                  <p className="text-2xs text-neutral-600">{user?.userId?.role == 'student' ? user?.profile?.major : user?.userId?.affiliation}</p>
                </div>
              </div>
              <button
                disabled={isPending}
                onClick={() => handleRemoveUser(user?.userId?._id)}
                className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg text-destructive-600 text-2xs h-10"
              >
                {isPending && removing == user?.userId?._id ? <Spinner /> : ' Remove'}
              </button>
            </div>
          )
        })
      )}
    </div>
  )
}

export default ChatGroupMembers
