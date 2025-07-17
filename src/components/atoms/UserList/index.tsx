import React from 'react'
import Image from 'next/image'
import { Users } from '@/types/Connections'

type UserListProps = {
  users: Users[]
  onUserClick: (e: React.MouseEvent, user: Users) => void
  fallbackImage: string
  emptyText?: string
}

const UserList: React.FC<UserListProps> = ({ users, onUserClick, fallbackImage, emptyText = 'No users found' }) => {
  if (!users || users.length === 0) {
    return <p className="text-center text-sm text-neutral-500 py-4">{emptyText}</p>
  }

  return (
    <>
      {users.map((user) => (
        <div
          key={user._id}
          onClick={(e) => onUserClick(e, user)}
          className="flex justify-between w-full hover:bg-neutral-200 px-6 py-2 cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <Image
              src={user.profile?.profile_dp?.imageUrl || fallbackImage}
              alt="dp"
              width={44}
              height={44}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{user.firstName}</p>
              <p className="text-2xs text-neutral-600">{user.profile?.role === 'student' ? user.profile.study_year : user.profile?.occupation}</p>
              <p className="text-2xs text-neutral-600">{user.profile?.role === 'student' ? user.profile?.major : user.profile?.affiliation}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default UserList
