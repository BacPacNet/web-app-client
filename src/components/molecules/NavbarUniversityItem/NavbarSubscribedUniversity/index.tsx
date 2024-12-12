'use client'
import Button from '@/components/atoms/Buttons'
import React, { useState } from 'react'
import Image from 'next/image'
import avatar from '@assets/unibuzz_rounded.svg'
import { userType } from '@/store/userSlice/userType'
import { Community } from '@/types/Community'
import UniversityVerificationModal from '@/components/organisms/SettingsSection/SettingModals/UniversityVerificationModal'
import { openModal } from '../../Modal/ModalManager'
import { FaCircleCheck } from 'react-icons/fa6'
interface Props {
  subscribedCommunities: Community[]
  communityId: string
  userData: Partial<userType>
  handleCommunityClick: (index: number) => void
}

function NavbarSubscribedUniversity({ subscribedCommunities, communityId, handleCommunityClick }: Props) {
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
      <div
        onClick={() => handleCommunityClick(index)}
        key={index}
        className={`flex items-center justify-between hover:bg-secondary ${communityId === community._id && 'bg-secondary'}`}
      >
        <div className={` flex items-center gap-3 py-2 px-4 cursor-pointer`}>
          <Image
            width={40}
            height={40}
            className="w-[40px] h-[40px] object-cover rounded-full"
            src={community.communityLogoUrl.imageUrl || avatar}
            alt={community.name}
          />

          <div className="flex items-center gap-2">
            <p className="text-xs  ">{community.name} </p>
            <p>
              <FaCircleCheck color="blue" size={16} />
            </p>
          </div>
        </div>
      </div>
    )
  })
}

export default NavbarSubscribedUniversity
