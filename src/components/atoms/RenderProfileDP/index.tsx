import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import Image from 'next/image'
import React from 'react'
import avatar from '@assets/avatar.svg'
import { userProfileType } from '@/store/userProfileSlice/userProfileType'

interface Props {
  userProfileData: Partial<userProfileType> | null
}

function ProfilePicture({ userProfileData }: Props) {
  if (userProfileData && Object?.keys(userProfileData)?.length === 0) {
    return <UserListItemSkeleton />
  }
  if (!userProfileData) return null

  return (
    <Image
      width={60}
      height={60}
      objectFit="cover"
      className="w-[60px] h-[60px] rounded-full flex-none"
      src={userProfileData.profile_dp?.imageUrl || avatar}
      alt="profile.png"
    />
  )
}

export default ProfilePicture
