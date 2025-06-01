import Title from '@/components/atoms/Title'
import UserListItem from '@/components/Timeline/UserListItem'
import { useRemoveUserFromCommunityGroup } from '@/services/community-group'
import { useUniStore } from '@/store/store'
import { CommunityGroupUsers } from '@/types/CommuityGroup'
import React, { useState } from 'react'

interface Props {
  users: CommunityGroupUsers[]
  adminId: string
  communityGroupId: string
}

export const CommunityGroupModal = ({ users, adminId, communityGroupId }: Props) => {
  const { userProfileData } = useUniStore()
  const [members, setMembers] = useState<CommunityGroupUsers[]>(users)
  const { mutate: mutateRemoveUserFromCommunityGroup, isPending: isPending } = useRemoveUserFromCommunityGroup()

  const handleRemoveUser = (id: string) => {
    mutateRemoveUserFromCommunityGroup(
      { communityGroupId, userId: id },
      {
        onSuccess: (response: any) => {
          setMembers(response.data.communityGroup.users)
        },
      }
    )
  }
  return (
    <div>
      <Title>Members</Title>
      {members?.map((user) => {
        return (
          <UserListItem
            key={user._id as string}
            firstName={user.firstName}
            lastName={user.lastName}
            id={user._id as string}
            university={''}
            study_year={user.year}
            degree={''}
            major={user.major}
            occupation={user.occupation}
            imageUrl={user.profileImageUrl}
            type={''}
            isSelfProfile={userProfileData?.users_id === user._id}
            isFollowing={userProfileData?.following?.some((userItem) => userItem.userId === user._id) as boolean}
            role={user.role || 'student'}
            affiliation={user.affiliation}
            showCommunityGroupMember={true}
            isViewerAdmin={adminId === userProfileData?.users_id}
            isGroupAdmin={user._id === adminId}
            handleRemoveClick={(id) => handleRemoveUser(id)}
            isRemovePending={isPending}
          />
        )
      })}
    </div>
  )
}
