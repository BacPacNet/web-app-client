'use client'
import Button from '@/components/atoms/Buttons'
import React, { useState } from 'react'
import Image from 'next/image'
import { userType } from '@/store/userSlice/userType'
import { Community } from '@/types/Community'
import universityLogoPlaceholder from '@assets/unibuzz_rounded.svg'
import { useRouter } from 'next/navigation'
import badge from '@assets/badge.svg'

interface Props {
  subscribedCommunities: Community[]
  communityId: string
  userData: Partial<userType>
  handleCommunityClick: (index: number) => void
  isGroup: boolean
}

function NavbarSubscribedUniversity({ subscribedCommunities, communityId, handleCommunityClick, isGroup }: Props) {
  const router = useRouter()
  const handleAddUniversityEmailUsersModal = () => {
    router.push('/discover')
    //openModal(<JoinUniversityModal />, 'w-[500px] h-[500px]')
  }

  if (subscribedCommunities?.length === 0)
    return (
      <div className="w-full">
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
    isVerified?: boolean
  }
  index: number
  handleCommunityClick: (index: number) => void
  communityId: string
  isGroup: boolean
}

const CommunityHolder = ({ community, index, handleCommunityClick, communityId, isGroup }: CommunityHolderProps) => {
  const [logoSrc, setLogoSrc] = useState(community.communityLogoUrl.imageUrl)

  const isSelected = communityId === community._id && !isGroup
  return (
    <div
      onClick={() => handleCommunityClick(index)}
      key={index}
      className={`flex items-center justify-between overflow-x-hidden hover:bg-neutral-100 rounded-md pl-2 my-1 ${isSelected && 'bg-secondary'}`}
    >
      <div className={` flex items-center gap-3 py-2 cursor-pointer`}>
        <Image
          width={40}
          height={40}
          className="w-[40px] h-[40px] object-contain rounded-full shadow-logo p-1"
          src={logoSrc}
          alt={community.name}
          onError={() => setLogoSrc(universityLogoPlaceholder)}
        />

        <div className="flex items-center gap-1">
          <p className={`text-xs line-clamp-2 ${isSelected ? 'text-neutral-700 font-bold' : 'text-neutral-500 font-medium '}`}>{community.name} </p>
          {/*<FaCircleCheck color="#6647ff" size={16} />*/}
          {community.isVerified && <Image src={badge} width={16} height={16} alt="badge" />}
        </div>
      </div>
    </div>
  )
}
