'use client'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import './index.css'
import { useUniStore } from '@/store/store'
import { useGetCommunity, useJoinCommunity, useLeaveCommunity } from '@/services/community-university'
import universityLogoPlaceholder from '@assets/unibuzz_rounded.svg'
import Button from '@/components/atoms/Buttons'
import { Skeleton } from '@/components/ui/Skeleton'

import { openModal } from '../Modal/ModalManager'
import CommunityLeaveModal from '../CommunityLeaveModal'
import Spinner from '@/components/atoms/spinner'

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

  const { mutate: joinCommunity, isPending: isJoinLoading } = useJoinCommunity()
  const { mutate: leaveCommunity, isPending: isLeaveLoading } = useLeaveCommunity()

  const { userData, userProfileData } = useUniStore()

  useEffect(() => {
    if (communityData && userData) {
      setIsUserJoinedCommunity(communityData.users.some((user) => user?.id?.toString() === userData?.id))
    }
  }, [communityData, userData])

  useEffect(() => {
    if (communityData && userData) {
      const { id } = userData
      setIsGroupAdmin(communityData.adminId.toString() === id?.toString())
    }
  }, [communityData, userData])

  useEffect(() => {
    setLogoSrc(communityData?.communityLogoUrl?.imageUrl)
  }, [communityData])

  const userVerifiedCommunityIds = useMemo(() => {
    return userData?.userVerifiedCommunities?.map((c) => c.communityId.toString()) || []
  }, [userData])

  const userUnverifiedVerifiedCommunityIds = useMemo(() => {
    return userData?.userUnVerifiedCommunities?.map((c) => c.communityId.toString()) || []
  }, [userData])

  const userVerifiedCommunityGroupIds = useMemo(() => {
    return userData?.userVerifiedCommunities?.flatMap((x) => x.communityGroups.map((y) => y.communityGroupId.toString())) || []
  }, [userData])

  const userUnverifiedVerifiedCommunityGroupIds = useMemo(() => {
    return userData?.userUnVerifiedCommunities?.flatMap((x) => x.communityGroups.map((y) => y.communityGroupId.toString())) || []
  }, [userData])

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
    <div className="rounded-2xl bg-white shadow-card">
      <div className=" relative h-[100px] md:h-[164px] w-full overflow-hidden rounded-t-2xl mt-4">
        <Image
          src={communityData?.communityCoverUrl?.imageUrl || universityPlaceholder.src}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt={'university'}
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="p-4">
        <div className="card-title flex flex-wrap justify-between items-center gap-2">
          <div className="flex flex-wrap  gap-2 items-center">
            <div
              style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
              className="relative flex items-center justify-center bg-white rounded-full w-[40px] h-[40px] overflow-hidden"
            >
              <Image
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                alt="logo"
                src={logoSrc || universityLogoPlaceholder}
                onError={() => setLogoSrc(universityLogoPlaceholder)}
                className="object-cover object-top"
              />
            </div>
            <p className="text-sm font-bold">{communityData?.name}</p>
            <p className="ai-power text-3xs font-extrabold">AI POWERED </p>
          </div>
          <div>
            <Button onClick={() => handleToggleJoinCommunity(communityID)} size="extra_small_paddind_2" variant="primary">
              {isJoinLoading || isLeaveLoading ? <Spinner /> : !isUserJoinedCommunity ? 'Join Community' : 'Leave Community'}
            </Button>
          </div>
        </div>
        <div>
          <p className="text-2xs text-neutral-500 py-4 ">{communityData?.about}</p>
          <p className="text-2xs text-neutral-500">
            <span>{communityData?.users.length}</span> members
          </p>
        </div>
      </div>
    </div>
  )
}
