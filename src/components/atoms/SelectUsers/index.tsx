import React from 'react'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'

type user = {
  _id: string
  profileImageUrl: string
  firstName: string
  year: string
  degree: string
  major: string
}

type Props = {
  selectedUsers: any
  user: user
  setValue: (key: any, payload: any[]) => void
}

const SelectUsers = ({ selectedUsers, user, setValue }: Props) => {
  const handleClick = (user: user) => {
    if (selectedUsers?.some((selectedUser: user) => selectedUser?._id == user._id)) {
      const filterUsers = selectedUsers.filter((selectedUser: user) => selectedUser._id !== user._id)
      setValue('selectedUsers', filterUsers)
    } else {
      setValue('selectedUsers', [...selectedUsers, user])
    }
  }

  const isSelected = selectedUsers?.some((selectedUser: user) => selectedUser._id == user._id)

  return (
    <label
      htmlFor={user._id}
      onChange={() => handleClick(user)}
      className="flex justify-start p-4 items-center gap-4 w-full hover:bg-surface-primary-50 cursor-pointer"
    >
      <input id={user._id} className="w-4" type="checkbox" checked={isSelected} />
      <div className="flex items-center gap-2">
        <Image width={40} height={40} className="w-10 h-10 rounded-full object-cover" src={user?.profileImageUrl || avatar} alt="" />
        <div>
          <p className="text-sm font-semibold">{user?.firstName}</p>
          <p className="text-2xs text-neutral-500">
            {user.year} {user.degree} {user.major}
          </p>
        </div>
      </div>
    </label>
  )
}

export default SelectUsers
