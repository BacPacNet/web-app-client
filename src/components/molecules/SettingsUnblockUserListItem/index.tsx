import React, { useState } from 'react'
import { useToggleFollow } from '@/services/connection'
import Button from '@/components/atoms/Buttons'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/spinner/Spinner'
import Image from 'next/image'
import { getUserProfileSubtitleLines } from '@/lib/userProfileSubtitle'
import avatar from '@assets/avatar.svg'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { useModal } from '@/context/ModalContext'
import { FaCrown } from 'react-icons/fa'
import communityAdminBadge from '@assets/communityAdminBadge.svg'
import { HiCheckCircle } from 'react-icons/hi'

interface SettingsUnblockUserListItemProps {
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
  role: string
  affiliation: string

  handleRemoveClick?: (id: string) => void
  isRemovePending?: boolean
}

const SettingsUnblockUserListItem: React.FC<SettingsUnblockUserListItemProps> = ({
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
  handleRemoveClick,
  isRemovePending,
}) => {
  const router = useRouter()

  const [imgSrc, setImgSrc] = useState(imageUrl || '')

  const { line1, line2 } = getUserProfileSubtitleLines({
    role,
    study_year,
    major,
    occupation,
    affiliation,
  })

  const handleProfileClick = () => {
    router.push(`/profile/${id}`)
  }

  return (
    <div className="flex items-center  py-4 border-b border-neutral-200 justify-between ">
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
          </h3>
          {line1 && <p className="text-3xs text-neutral-500">{line1}</p>}
          {line2 && <p className="text-3xs text-neutral-500">{line2}</p>}
        </div>
      </div>

      <Button disabled={isRemovePending} onClick={() => handleRemoveClick?.(id)} variant="border_danger" size="small">
        Unblock User
      </Button>
    </div>
  )
}

export default SettingsUnblockUserListItem
