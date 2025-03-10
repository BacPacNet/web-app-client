import React from 'react'
import { useToggleFollow } from '@/services/connection'
import Button from '../atoms/Buttons'
import avatar from '@assets/avatar.svg'
import { useRouter } from 'next/navigation'
import { Spinner } from '../spinner/Spinner'
import Image from 'next/image'

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
  isChat?: boolean
  isFollowing: boolean
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
  isFollowing,
}) => {
  const { mutate: toggleFollow, isPending } = useToggleFollow(type)
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
        <Image src={imageUrl || avatar.src} alt={firstName} width={48} height={48} className="w-12 h-12 rounded-full flex-none object-cover" />
        <div className="">
          <h3 className="font-medium text-base text-gray-dark">
            {firstName} {lastName}
          </h3>
          {university && <p className="text-2xs text-gray-1 line-clamp-1">{university}</p>}

          <p className="text-3xs sm:text-2xs text-gray-1 line-clamp-1">
            {study_year} {degree} {major}
          </p>
        </div>
      </div>

      <div className="p-2 bg-primary-50 rounded-md">
        <>
          {!isFollowing ? (
            <Button onClick={handleFollowClick} variant="primary" size="extra_small">
              {isPending ? <Spinner /> : 'Follow'}
            </Button>
          ) : (
            <Button onClick={() => handleProfileClicked(id)} className="whitespace-nowrap" variant="shade" size="extra_small">
              View Profile
            </Button>
          )}
        </>
      </div>
    </div>
  )
}

export default UserListItem
