'use client'
import React, { useState } from 'react'
import { useRemoveGroupChatMember } from '@/services/Messages'
import Title from '@/components/atoms/Title'
import UserListItem from '@/components/Timeline/UserListItem'
import { ChatUser } from '@/types/constants'
import { useUniStore } from '@/store/store'

interface Props {
  users: ChatUser[]
  chatId: string
  adminId: string
}

const ChatGroupMembers = ({ users, chatId, adminId }: Props) => {
  const [usersList, setUsersList] = useState(users || [])
  const { userProfileData } = useUniStore()
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
    <div>
      <Title>Members</Title>
      {usersList
        .filter((user) => !user.userId.isBlocked)
        .map((user) => {
          const { userId } = user
          return (
            <UserListItem
              key={user._id}
              firstName={userId.firstName}
              lastName={userId.lastName}
              id={userId._id as string}
              university={''}
              study_year={userId.studyYear}
              degree={''}
              major={userId.major}
              occupation={userId.occupation}
              imageUrl={userId.profileDp}
              type={''}
              isSelfProfile={userProfileData?.users_id === userId._id}
              isFollowing={userProfileData?.following?.some((userItem) => userItem.userId === userId._id) as boolean}
              role={userId.role || 'student'}
              affiliation={userId.affiliation}
              showCommunityGroupMember={true}
              isViewerAdmin={adminId === userProfileData?.users_id}
              isGroupAdmin={userId._id === adminId}
              handleRemoveClick={(id) => handleRemoveUser(id)}
              isRemovePending={isPending}
            />
          )
        })}
    </div>
  )
}

export default ChatGroupMembers
