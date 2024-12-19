import React from 'react'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'

type user = {
  id: string
  profileImageUrl: string
  firstName: string
  year: string
  degree: string
  major: string
}

type Props = {
  setSelectedUsers: (value: any[]) => void
  selectedUsers: any
  user: user
}

const SelectUsers = ({ selectedUsers, setSelectedUsers, user }: Props) => {
  const handleClick = (user: user) => {
    if (selectedUsers?.some((selectedUser: user) => selectedUser.id == user.id)) {
      const filterd = selectedUsers.filter((selectedUser: user) => selectedUser.id !== user.id)
      setSelectedUsers(filterd)
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const isSelected = selectedUsers?.some((selectedUser: user) => selectedUser.id == user.id)

  return (
    <div className="flex justify-start items-center gap-4 w-full ">
      <input onChange={() => handleClick(user)} className="w-4" type="checkbox" checked={isSelected} />
      <div className="flex items-center gap-2">
        <Image width={40} height={40} className="w-10 h-10 rounded-full object-cover" src={user?.profileImageUrl || avatar} alt="" />
        <div>
          <p className="text-sm font-semibold">{user?.firstName}</p>
          {/*<p className="text-2xs text-neutral-500">{data?.profile?.university_name ? data?.profile?.university_name : 'Not Availaible'}</p>*/}
          <p className="text-2xs text-neutral-500">
            {user.year} {user.degree} {user.major}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SelectUsers
