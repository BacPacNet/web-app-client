import React from 'react'
import Image from 'next/image'
import { PostType } from '@/types/constants'

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
  major: string
  handleProfileClicked: (adminId: string) => void
}

const UserCard: React.FC<UserCardProps> = ({ user, year, major, avatarLink, avatar, adminId, userData, postID, type, handleProfileClicked }) => {
  return (
    <div onClick={() => handleProfileClicked(adminId as string)} className="flex gap-4 cursor-pointer items-center">
      <div className="rounded-full w-[48px] h-[48px]">
        <Image src={avatarLink || avatar} width={48} height={48} className="object-cover rounded-full h-[inherit]" alt="User Avatar" />
      </div>
      <div>
        <h3 className="font-semibold text-xs text-neutral-700">{user}</h3>
        <div className="flex flex-col">
          {year && <p className="hidden md:block text-[10px] text-neutral-500">{year}</p>}
          <p className="text-[10px] text-neutral-500">{major}</p>
        </div>
      </div>
    </div>
  )
}

export default UserCard
