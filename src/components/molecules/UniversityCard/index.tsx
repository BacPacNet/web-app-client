'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import universityPlaceholder from '@assets/university_banner.svg'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import settingIcon from '@assets/settingIcon.svg'
import { TbLogout2 } from 'react-icons/tb'

import './index.css'
import { useUniStore } from '@/store/store'
import { useJoinCommunity } from '@/services/community-university'
import { Skeleton } from '@/components/ui/Skeleton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import Buttons from '@/components/atoms/Buttons'
import { useModal } from '@/context/ModalContext'
import LeavingCommunityCard from '../LeaveCommunityModal'
import { Community } from '@/types/Community'

interface Props {
  communityID: string
  communityGroupID?: string
  isGroupAdmin: boolean
  setIsGroupAdmin: (isGroupAdmin: boolean) => void
  communityData?: Community
  isCommunityLoading: boolean
}

export default function UniversityCard({ communityID, isGroupAdmin, setIsGroupAdmin, communityData, isCommunityLoading }: Props) {
  const [isUserJoinedCommunity, setIsUserJoinedCommunity] = useState<boolean | null>(null)
  const { userData } = useUniStore()
  const { openModal } = useModal()
  const [toggleDropdown, setToggleDropdown] = useState(false)

  //  const { data: communityData, isLoading: isCommunityLoading } = useGetCommunity(communityID)
  const [logoSrc, setLogoSrc] = useState(communityData?.communityLogoUrl?.imageUrl || universityLogoPlaceholder)
  const [coverSrc, setCoverSrc] = useState(communityData?.communityCoverUrl?.imageUrl || universityPlaceholder.src)

  useEffect(() => {
    if (communityData && userData) {
      setIsUserJoinedCommunity(communityData.users.some((user) => user?._id === userData?.id))
      setIsGroupAdmin(communityData?.adminId?.map(String).includes(userData?.id?.toString() || ''))
    }
  }, [communityData, userData, setIsGroupAdmin])

  useEffect(() => {
    setLogoSrc(communityData?.communityLogoUrl?.imageUrl || universityLogoPlaceholder)
    setCoverSrc(communityData?.communityCoverUrl?.imageUrl || universityPlaceholder.src)
  }, [communityData])

  const { mutate: joinCommunity } = useJoinCommunity()

  const handleToggleJoinCommunity = () => {
    setToggleDropdown(false)
    if (!isUserJoinedCommunity) {
      joinCommunity(communityID, {
        onSuccess: () => setIsUserJoinedCommunity(true),
      })
    } else {
      openModal(
        <LeavingCommunityCard
          universityName={communityData?.name || ''}
          logo={communityData?.communityLogoUrl.imageUrl || ''}
          setIsUserJoinedCommunity={setIsUserJoinedCommunity}
          communityId={communityID}
        />,
        'h-max w-[500px]'
      )
    }
  }

  if (isCommunityLoading) return <Skeleton className="w-full h-60 bg-slate-300 my-4" />

  return (
    <div className="rounded-lg bg-white shadow-card p-6 mb-4">
      <div className="relative h-[100px] md:h-[164px] w-full overflow-hidden rounded-lg ">
        <Image
          src={coverSrc}
          layout="fill"
          objectFit="fill"
          alt="university"
          className="h-full w-full object-fill object-top"
          onError={() => setCoverSrc(universityPlaceholder.src)}
        />
      </div>
      <div className="pt-4">
        <div className="flex justify-between items-center gap-2">
          <div className="flex gap-2 items-center">
            <div className="relative flex items-center justify-center bg-white rounded-full w-[48px] h-[48px] overflow-hidden p-1 shadow-md">
              <Image
                layout="fill"
                alt="logo"
                src={logoSrc}
                onError={() => setLogoSrc(universityLogoPlaceholder)}
                className="object-contain rounded-full w-[48px] h-[48px]"
              />
            </div>
            <p className="text-xs font-bold text-neutral-700">{communityData?.name}</p>
            {/*<p className="ai-power text-xs font-black">AI POWERED</p>*/}
          </div>
          {isUserJoinedCommunity ? (
            <Popover open={toggleDropdown} onOpenChange={(open) => setToggleDropdown(open)}>
              <PopoverTrigger>
                <Image onClick={() => setToggleDropdown(!toggleDropdown)} src={settingIcon} width={32} height={32} alt="Settings" />
              </PopoverTrigger>
              <PopoverContent className="p-0 drop-shadow-lg  top-2 w-40 bg-white shadow-card border-none absolute -right-[20px]">
                <div className="flex flex-col">
                  {/* {isGroupAdmin && (
                    <div className="flex items-center px-4 py-2 gap-2 hover:bg-neutral-100 cursor-pointer">
                      <FiEdit onClick={() => setToggleDropdown(false)} size={16} className="text-primary-500" />
                      <p className="font-medium text-neutral-700 text-xs">Edit</p>
                    </div>
                  )} */}
                  {!isGroupAdmin && (
                    <div onClick={handleToggleJoinCommunity} className="flex items-center px-4 py-2 gap-2 hover:bg-neutral-100 cursor-pointer">
                      <TbLogout2 size={16} className="text-red-500" />
                      <p className="font-medium text-neutral-700 text-xs">Leave</p>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <Buttons size="medium" onClick={handleToggleJoinCommunity}>
              Join Community
            </Buttons>
          )}
        </div>
        <p className="text-2xs text-neutral-500 font-medium pt-4">{communityData?.about}</p>
      </div>
    </div>
  )
}
