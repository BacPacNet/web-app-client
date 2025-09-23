import React, { useState } from 'react'
import { useToggleFollow } from '@/services/connection'
import Button from '../atoms/Buttons'
import { useRouter } from 'next/navigation'
import { Spinner } from '../spinner/Spinner'
import Image from 'next/image'
import { userTypeEnum } from '@/types/RegisterForm'
import avatar from '@assets/avatar.svg'
import { showCustomDangerToast } from '../atoms/CustomToasts/CustomToasts'
import { useModal } from '@/context/ModalContext'
import { FaCrown } from 'react-icons/fa'
import communityAdminBadge from '@assets/communityAdminBadge.svg'

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
  role: string
  affiliation: string
  isSelfProfile?: boolean
  showCommunityGroupMember?: boolean
  isGroupAdmin?: boolean
  handleRemoveClick?: (id: string) => void
  isRemovePending?: boolean
  isViewerAdmin?: boolean
  isCommunityAdmin?: boolean
  adminCommunityId?: string
  isOfficialGroup?: boolean
}

const UserListItem: React.FC<FollowingItemProps> = ({
  id,
  type,
  firstName,
  lastName,
  university,
  study_year,
  major,
  occupation,
  role,
  affiliation,
  imageUrl,
  isFollowing,
  isSelfProfile,
  showCommunityGroupMember,
  isGroupAdmin,
  handleRemoveClick,
  isRemovePending,
  isViewerAdmin,
  isCommunityAdmin,
  isOfficialGroup,
}) => {
  const router = useRouter()
  const { closeModal } = useModal()
  const { mutateAsync: toggleFollow } = useToggleFollow(type)

  const [imgSrc, setImgSrc] = useState(imageUrl || '')
  const [isFollowingState, setIsFollowingState] = useState(isFollowing)
  const [isProcessing, setIsProcessing] = useState(false)

  const isStudent = role === userTypeEnum.Student
  const showRemoveButton = !isSelfProfile && isViewerAdmin && showCommunityGroupMember
  const showFollowButton = !isSelfProfile && !showRemoveButton
  const isNotAllowedToRemove = isCommunityAdmin && isOfficialGroup

  const handleFollowClick = async () => {
    setIsFollowingState(true)
    setIsProcessing(true)

    try {
      await toggleFollow(id)
    } catch (err) {
      setIsFollowingState(false)
      showCustomDangerToast('Failed to follow')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleProfileClick = () => {
    closeModal()
    router.push(`/profile/${id}`)
  }

  return (
    <div className="flex items-center px-2 py-4 md:p-4 border-b border-neutral-200 justify-between">
      <div onClick={handleProfileClick} className="flex gap-4 items-center cursor-pointer">
        <Image
          onError={() => setImgSrc(avatar)}
          src={imgSrc}
          alt={`${firstName} ${lastName}`}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-neutral-700 text-xs flex items-center gap-1">
            {firstName} {lastName}
            {isGroupAdmin && <FaCrown className="text-warning-500" />}
            {isCommunityAdmin && <Image src={communityAdminBadge} alt="university logo" width={14} height={14} />}
          </h3>
          {/*{university && <p className="text-2xs text-gray-1 line-clamp-1">{university}</p>}*/}
          <p className="text-3xs text-neutral-500">{isStudent ? study_year : occupation}</p>
          <p className="text-3xs text-neutral-500">{isStudent ? major : affiliation}</p>
        </div>
      </div>

      {showRemoveButton && !isNotAllowedToRemove && (
        <Button disabled={isRemovePending} onClick={() => handleRemoveClick?.(id)} variant="danger_secondary" size="small">
          Remove
        </Button>
      )}

      {showFollowButton && (
        <div className="py-2 bg-primary-50 rounded-md">
          {isFollowingState ? (
            <Button onClick={handleProfileClick} className="whitespace-nowrap text-neutral-700" variant="border" size="small">
              View Profile
            </Button>
          ) : (
            <Button onClick={handleFollowClick} variant="shade" size="small" disabled={isProcessing}>
              {isProcessing ? <Spinner /> : 'Follow'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default UserListItem
