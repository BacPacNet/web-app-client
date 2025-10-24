import React from 'react'
import Image from 'next/image'
import { PostType } from '@/types/constants'
import badge from '@assets/badge.svg'
import communityAdminBadge from '@assets/communityAdminBadge.svg'
import { userTypeEnum } from '@/types/RegisterForm'
interface UserCardProps {
  user: string
  year?: string
  university: string
  avatarLink?: string
  avatar: string
  adminId?: string
  userData?: { id: string }
  postID: string
  type: PostType.Community | PostType.Timeline
  major?: string
  affiliation?: string
  occupation?: string
  handleProfileClicked: (adminId: string) => void
  isPost?: boolean
  isVerified?: boolean
  isCommunityAdmin?: boolean
  adminCommunityId?: string
  role?: string
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  year,
  major,
  avatarLink,
  avatar,
  adminId,
  affiliation,
  occupation,
  handleProfileClicked,
  isPost,
  isVerified,
  isCommunityAdmin,
  role,
}) => {
  const isStudent = role === userTypeEnum.Student
  return (
    <div onClick={() => handleProfileClicked(adminId as string)} className="flex gap-2 cursor-pointer items-center flex-shrink-0">
      <div className="rounded-full w-[48px] h-[48px]">
        <Image src={avatarLink || avatar} width={48} height={48} className="object-cover rounded-full h-[inherit]" alt="User Avatar" />
      </div>
      <div>
        <div className="flex gap-1 items-center">
          <h3 className="font-semibold text-xs text-neutral-700">{user}</h3>
        </div>

        <div className="flex flex-col">
          <p className="block text-[10px] text-neutral-500">
            {' '}
            <p>{isStudent ? year : occupation}</p>{' '}
          </p>
          <p className="text-[10px] text-neutral-500">{isStudent ? major : affiliation}</p>
        </div>
      </div>
    </div>
  )
}

export default UserCard
