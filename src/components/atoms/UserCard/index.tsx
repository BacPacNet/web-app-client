import React from 'react'
import Image from 'next/image'
import { PostType } from '@/types/constants'
import badge from '@assets/badge.svg'
import communityAdminBadge from '@assets/communityAdminBadge.svg'
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
}) => {
  return (
    <div onClick={() => handleProfileClicked(adminId as string)} className="flex gap-2 cursor-pointer items-center">
      <div className="rounded-full w-[48px] h-[48px]">
        <Image src={avatarLink || avatar} width={48} height={48} className="object-cover rounded-full h-[inherit]" alt="User Avatar" />
      </div>
      <div>
        <div className="flex gap-1 items-center">
          <h3 className="font-semibold text-xs text-neutral-700">{user}</h3>
          {/*{}*/}
          {isCommunityAdmin ? (
            <Image src={communityAdminBadge} width={14} height={14} alt="Verified" />
          ) : (
            isVerified && <Image src={badge} width={14} height={14} alt="Verified" />
          )}
        </div>

        <div className="flex flex-col">
          <p className="block text-[10px] text-neutral-500">{year || occupation} </p>
          <p className="text-[10px] text-neutral-500">{major || affiliation}</p>
        </div>
      </div>
    </div>
  )
}

export default UserCard
