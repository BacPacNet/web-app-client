import { CommunityUsers } from '@/types/Community'
import React from 'react'

type media = {
  imageUrl: string
  publicId: string
}
type User = {
  _id: string
  firstName: string
  isOnline?: boolean
  profile: {
    profile_dp: media
    _id: string
    university_name?: string
    study_year?: string
    degree?: string
  }
}

type Props = {
  setSelectedUsers: (value: string[]) => void
  selectedUsers: string[]
  user: any
  userID?: string
}

const SelectUsers = ({ user, selectedUsers, setSelectedUsers, userID }: Props) => {
  const handleClick = (userId: string) => {
    //setSelectedUsers([...selectedUsers, userId])
    if (selectedUsers?.some((id) => id == userID)) {
      const filterd = selectedUsers.filter((id) => id !== userID)
      setSelectedUsers(filterd)
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const isSelected = selectedUsers?.some((userId) => userId === userID)
  return (
    <div className="flex justify-between w-full">
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
      <input onChange={() => handleClick(userID as string)} className="w-4" type="checkbox" checked={isSelected} />
    </div>
  )
}

export default SelectUsers
