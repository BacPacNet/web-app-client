'use client'
import Button from '@/components/atoms/Buttons'
import React, { useState } from 'react'
import Image from 'next/image'
import { userType } from '@/store/userSlice/userType'
import { Community } from '@/types/Community'
import UniversityVerificationModal from '@/components/organisms/SettingsSection/SettingModals/UniversityVerificationModal'
import { openModal } from '../../Modal/ModalManager'
import { FaCircleCheck } from 'react-icons/fa6'
import { truncateString } from '@/lib/utils'
import universityLogoPlaceholder from '@assets/unibuzz_rounded.svg'

interface Props {
  subscribedCommunities: Community[]
  communityId: string
  userData: Partial<userType>
  handleCommunityClick: (index: number) => void
  isGroup: boolean
}

function NavbarSubscribedUniversity({ subscribedCommunities, communityId, handleCommunityClick, isGroup }: Props) {
  const handleAddUniversityEmailUsersModal = () => {
    openModal(<UniversityVerificationModal />)
  }

  if (subscribedCommunities?.length === 0)
    return (
      <div className="px-4 w-full">
        <Button onClick={() => handleAddUniversityEmailUsersModal()} variant="primary" className="w-full">
          Add Your University
        </Button>
      </div>
    )

  return subscribedCommunities?.map((community, index) => {
    return (
      <CommunityHolder
        key={community._id}
        community={community}
        index={index}
        handleCommunityClick={handleCommunityClick}
        communityId={communityId}
        isGroup={isGroup}
      />
    )
  })
}

export default NavbarSubscribedUniversity

interface CommunityHolderProps {
  community: {
    _id: string
    name: string
    communityLogoUrl: { imageUrl: string }
  }
  index: number
  handleCommunityClick: (index: number) => void
  communityId: string
  isGroup: boolean
}

const CommunityHolder = ({ community, index, handleCommunityClick, communityId, isGroup }: CommunityHolderProps) => {
  const [logoSrc, setLogoSrc] = useState(community.communityLogoUrl.imageUrl)
  return (
    <div
      onClick={() => handleCommunityClick(index)}
      key={index}
      className={`flex items-center justify-between overflow-x-hidden hover:bg-secondary ${
        communityId === community._id && !isGroup && 'bg-secondary'
      }`}
    >
      <div className={` flex items-center gap-2 py-2 px-4 cursor-pointer`}>
        <Image
          width={40}
          height={40}
          className="w-[40px] h-[40px] object-cover rounded-full"
          src={logoSrc}
          alt={community.name}
          onError={() => setLogoSrc(universityLogoPlaceholder)}
        />

        <div className="flex items-center gap-1">
          <p className="text-xs  xl:w-max ">{truncateString(community.name)} </p>
          <FaCircleCheck color="#6647ff" size={16} />
        </div>
      </div>
    </div>
  )
}
