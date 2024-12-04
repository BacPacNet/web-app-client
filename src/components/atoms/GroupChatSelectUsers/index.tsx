import React from 'react'
import { FaUser } from 'react-icons/fa'
type user = {
  _id: string
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

const GroupSelectUsers = ({ selectedUsers, setSelectedUsers, user }: Props) => {
  const handleClick = (user: user) => {
    if (selectedUsers?.some((selectedUser: user) => selectedUser._id == user._id)) {
      const filterd = selectedUsers.filter((selectedUser: user) => selectedUser._id !== user._id)
      setSelectedUsers(filterd)
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const isSelected = selectedUsers?.some((selectedUser: user) => selectedUser._id == user._id)

  return (
    <div className="flex justify-start items-center gap-4 w-full ">
      <input onChange={() => handleClick(user)} className="w-4" type="checkbox" checked={isSelected} />
      <div className="flex items-center gap-2">
        <img className="w-10 h-10 rounded-full object-cover" src={user?.profileImageUrl} alt="" />
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

export default GroupSelectUsers
