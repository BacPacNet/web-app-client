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
      className="flex justify-start p-4 items-center gap-4 w-full hover:bg-surface-primary-50 cursor-pointer border-b border-neutral-300"
    >
      <input
        id={user._id}
        type="checkbox"
        checked={isSelected}
        className="w-[16px] h-[16px] appearance-none rounded border-2 border-neutral-200 cursor-pointer
                    checked:bg-primary checked:border-primary
                    relative after:content-[''] after:absolute after:w-[4px] after:h-[8px] after:border-r-2 after:border-b-2 after:border-white
                    after:rotate-45 after:top-[1.5px] after:left-[5px] checked:after:block after:hidden"
      />
      <div className="flex items-center gap-2">
        <Image width={48} height={48} className="w-12 h-1w rounded-full object-cover" src={user?.profileImageUrl || avatar} alt="" />
        <div>
          <p className="text-2xs font-semibold">{user?.firstName}</p>
          <p className="text-3xs text-neutral-500">{user.year}</p>
          <p className="text-3xs text-neutral-500">{user.major}</p>
        </div>
      </div>
    </label>
  )
}

export default SelectUsers
