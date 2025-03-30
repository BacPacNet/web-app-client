'use client'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import './index.css'
import { useUniStore } from '@/store/store'
import { useGetCommunity, useJoinCommunity, useLeaveCommunity } from '@/services/community-university'
import universityLogoPlaceholder from '@assets/unibuzz_rounded.svg'
import { Skeleton } from '@/components/ui/Skeleton'

import { openModal } from '../Modal/ModalManager'
import CommunityLeaveModal from '../CommunityLeaveModal'
import settingIcon from '@assets/settingIcon.svg'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { TbLogout2 } from 'react-icons/tb'
import { FaUniversity } from 'react-icons/fa'
import { FiEdit } from 'react-icons/fi'

interface Props {
  communityID: string
  communityGroupID?: string
  isGroupAdmin: boolean
  setIsGroupAdmin: (isGroupAdmin: boolean) => void
}

export default function UniversityCard({ communityID, isGroupAdmin, setIsGroupAdmin }: Props) {
  const [isUserJoinedCommunity, setIsUserJoinedCommunity] = useState<boolean | null>(null)

  const { data: communityData, isLoading: isCommunityLoading } = useGetCommunity(communityID)
  const [logoSrc, setLogoSrc] = useState(communityData?.communityLogoUrl?.imageUrl)

  const { mutate: joinCommunity } = useJoinCommunity()

  const { userData, userProfileData } = useUniStore()

  useEffect(() => {
    if (communityData && userData) {
      setIsUserJoinedCommunity(communityData.users.some((user) => user?.id?.toString() === userData?.id))
    }
  }, [communityData, userData])

  useEffect(() => {
    if (communityData && userData) {
      const { id } = userData
      setIsGroupAdmin(communityData?.adminId?.toString() === id?.toString())
    }
  }, [communityData, userData])

  useEffect(() => {
    setLogoSrc(communityData?.communityLogoUrl?.imageUrl)
  }, [communityData])

  const handleToggleJoinCommunity = (communityGroupID: string) => {
    if (!isUserJoinedCommunity) {
      joinCommunity(communityID, {
        onSuccess: () => {
          setIsUserJoinedCommunity(true)
        },
      })
    } else {
      openModal(<CommunityLeaveModal communityID={communityID} setIsUserJoinedCommunity={setIsUserJoinedCommunity} />, 'h-max w-96')
    }
  }

  if (isCommunityLoading) return <Skeleton className="w-full h-60 bg-slate-300 my-4" />

  return (
    <div className="rounded-lg bg-white shadow-card p-6">
      <div className="relative h-[100px] md:h-[164px] w-full overflow-hidden rounded-lg">
        <Image
          src={communityData?.communityCoverUrl?.imageUrl || universityPlaceholder.src}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt={'university'}
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="pt-4">
        <div className="card-title flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap  gap-2 items-center">
            <div
              style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
              className="relative flex items-center justify-center bg-white rounded-full w-[48px] h-[48px] overflow-hidden p-1"
            >
              <Image
                layout="fill"
                alt="logo"
                src={logoSrc || universityLogoPlaceholder}
                onError={() => setLogoSrc(universityLogoPlaceholder)}
                className="object-contain shadow-card rounded-full w-[48px] h-[48px]"
              />
            </div>
            <p className="text-xs font-bold text-neutral-700">{communityData?.name}</p>
            <p className="ai-power text-xs font-black">AI POWERED </p>
          </div>
          <div>
            <Popover>
              <PopoverTrigger>
                <Image src={settingIcon} width={32} height={32} alt="" />
              </PopoverTrigger>
              <PopoverContent className="p-0 relative drop-shadow-lg right-16 top-2 w-40 bg-white shadow-card border-none">
                <div className="flex flex-col">
                  {isGroupAdmin && (
                    <div className="flex  items-center px-4 py-2 gap-2 hover:bg-neutral-100">
                      <FiEdit size={16} className="text-primary-500" />
                      <p className="font-medium text-neutral-700 text-xs">Edit</p>
                    </div>
                  )}
                  {!isUserJoinedCommunity ? (
                    <div onClick={() => handleToggleJoinCommunity(communityID)} className="flex  items-center px-4 py-2 gap-2 hover:bg-neutral-100">
                      <FaUniversity strokeWidth={2} size={16} className="text-primary-500" />
                      <p className="font-medium text-neutral-700 text-xs">Join</p>
                    </div>
                  ) : (
                    <div onClick={() => handleToggleJoinCommunity(communityID)} className="flex  items-center px-4 py-2 gap-2 hover:bg-neutral-100">
                      <TbLogout2 strokeWidth={2} size={16} className="text-red-500" />
                      <p className="font-medium text-neutral-700 text-xs">Leave</p>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div>
          <p className="text-2xs text-neutral-500 font-medium pt-4 ">{communityData?.about}</p>
          {/*<p className="text-2xs text-neutral-500">
            <span>{communityData?.users.length}</span> members
          </p>*/}
        </div>
      </div>
    </div>
  )
}
