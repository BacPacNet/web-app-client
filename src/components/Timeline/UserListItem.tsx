import React from 'react'
import { useToggleFollow } from '@/services/connection'
import Button from '../atoms/Buttons'
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
  isSelfProfile?: boolean
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
  isSelfProfile,
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
    <div className="flex items-center px-2 py-4 md:p-4 border-b border-border justify-between ">
      <div onClick={() => handleProfileClicked(id)} className="flex gap-4 items-center cursor-pointer">
        <img src={imageUrl || avatar.src} alt={firstName} className="w-12 h-12 rounded-full flex-none" />
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
        {!isSelfProfile && (
          <>
            {!userFollowingIDs?.includes(id) ? (
              <Button onClick={handleFollowClick} variant="primary" size="extra_small">
                Follow
              </Button>
            ) : (
              <Button onClick={() => handleProfileClicked(id)} className="whitespace-nowrap" variant="shade" size="extra_small">
                View Profile
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UserListItem
