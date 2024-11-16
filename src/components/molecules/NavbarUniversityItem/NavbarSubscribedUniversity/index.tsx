'use client'
import Button from '@/components/atoms/Buttons'
import React, { useState } from 'react'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { userType } from '@/store/userSlice/userType'
import { Community } from '@/types/Community'
import UniversityVerificationModal from '@/components/organisms/SettingsSection/SettingModals/UniversityVerificationModal'

interface Props {
  subscribedCommunities: Community[]
  communityId: string
  userData: Partial<userType>
  handleCommunityClick: (index: number) => void
}

function NavbarSubscribedUniversity({ subscribedCommunities, communityId, handleCommunityClick }: Props) {
  const [modal, setModal] = useState<string | null>(null)
  if (subscribedCommunities?.length === 0)
    return (
      <div className="px-4 w-full">
        <Button onClick={() => setModal(modal?.length ? null : 'University')} variant="primary" className="w-full">
          Add Your University
        </Button>
        {modal?.length && (
          <div className="fixed w-1/2 h-full left-[30%] top-0 flex justify-center items-center ">
            <div onClick={() => setModal(null)} className="bg-secondary opacity-70 w-2/3 h-full fixed -z-10 rounded-2xl"></div>
            <UniversityVerificationModal setModal={setModal} />
          </div>
        )}
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

          <p className="text-xs">{community.name}</p>
        </div>
      </div>
    )
  })
}

export default NavbarSubscribedUniversity
