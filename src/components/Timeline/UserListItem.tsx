import React from 'react'
import { useToggleFollow } from '@/services/connection'
import LoginButtons from '../atoms/LoginButtons'
import avatar from '@assets/avatar.svg'
import { useRouter } from 'next/navigation'

interface FollowingItemProps {
  firstName: string
  lastName: string
  id: string
  university: string
  study_year: string
  degree: string
  major: string
  occupation: string
  imageUrl: string
  type: string
  userFollowingIDs: string[]
  isChat?: boolean
}

const UserListItem: React.FC<FollowingItemProps> = ({
  id,
  type,
  firstName,
  lastName,
  university,
  study_year,
  degree,
  major,
  occupation,
  imageUrl,
  userFollowingIDs,
  isChat,
}) => {
  const { mutate: toggleFollow } = useToggleFollow(type)
  const router = useRouter()

  const handleFollowClick = () => {
    toggleFollow(id)
  }

  const handleProfileClicked = (id: string) => {
    router.push(`/profile/${id}`)
  }

  return (
    <div className="flex items-center p-2 md:p-4 border-b border-border justify-between">
      <div onClick={() => handleProfileClicked(id)} className="flex gap-4 items-center cursor-pointer">
        <img src={imageUrl || avatar.src} alt={firstName} className="w-12 h-12 rounded-full " />
        <div className="">
          <h3 className="font-medium text-base text-gray-dark">
            {firstName} {lastName}
          </h3>
          {university && <p className="text-2xs text-gray-1">{university}</p>}

          <p className="text-2xs text-gray-1">
            {study_year} {degree} {major}
          </p>
        </div>
      </div>

      <div className="p-2 bg-primary-50 rounded-md">
        <LoginButtons onClick={handleFollowClick} variant="shade" size="extra_small">
          {userFollowingIDs?.includes(id) ? 'UnFollow' : 'Follow'}
        </LoginButtons>
        {/*<Popover>
          <PopoverTrigger>
            <SlOptionsVertical className="text-primary" />
          </PopoverTrigger>
          <PopoverContent className="relative right-24 bottom-10 w-36 p-5 border-none shadow-lg bg-white shadow-gray-light z-50">
            {isChat ? (
              <p onClick={() => createUserChat({ userId: id })}>Start-chat</p>
            ) : (
              <p onClick={() => toggleFollow(id)}>{userFollowingIDs?.includes(id) ? 'Un-Follow' : 'Follow'}</p>
            )}
          </PopoverContent>
        </Popover>*/}
      </div>
    </div>
  )
}

export default UserListItem
