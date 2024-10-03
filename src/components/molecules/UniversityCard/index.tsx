'use client'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import './index.css'
import { FaUniversity } from 'react-icons/fa'
import { useQueryClient } from '@tanstack/react-query'
import { useUniStore } from '@/store/store'
import { useJoinCommunity, useJoinCommunityGroup, useLeaveCommunity } from '@/services/community-university'
import { IoMdSettings } from 'react-icons/io'

interface Props {
  universityLogo: string
  universityName: string
  isAiPowered: boolean
  joinedSince: string
  description: string
  memberCount: number
  currSelectedGroup?: any
  communityID: string
  communityGroupID?: string
}

export default function UniversityCard({
  universityLogo,
  universityName = 'Lorem University',
  isAiPowered = true,
  joinedSince = '7/23/2024',
  description = 'Official community page for Lorem University. For inquiries contact the Human Resources Department in B-Wing of Northern Campus.',
  memberCount = 242,
  currSelectedGroup,
  communityID,
  communityGroupID,
}: Props) {
  const queryClient = useQueryClient()
  const Communitydata: any = queryClient.getQueryData(['UserSubscribedCommunityGroups'])
  const CommunityGroupdata: any = queryClient.getQueryData(['communityGroups', communityID])
  const [isJoined, setIsJoined] = useState(false)
  const [dataToDisplay, setDataToDisplay] = useState({ title: '', desc: '', membersCount: 0, coverImage: '', logoImage: '', adminId: '', id: '' })
  const { mutate: JoinCommunity } = useJoinCommunity()
  const { mutate: LeaveCommunity } = useLeaveCommunity()
  const { mutate: JoinCommunityGroup } = useJoinCommunityGroup()
  // console.log('commId', communityID, 'data', Communitydata?.community)

  const selectedCommunityData = Communitydata?.community?.find((item: any) => item?._id == communityID)

  const selectedCommunityGroupData = communityGroupID && CommunityGroupdata?.groups?.find((item: any) => item?._id == communityGroupID)
  console.log('commId', selectedCommunityData, 'data', selectedCommunityGroupData)

  const { userData } = useUniStore()

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

  useEffect(() => {
    if (communityID && !communityGroupID) {
      if (userVerifiedCommunityIds.includes(communityID) || userUnverifiedVerifiedCommunityIds.includes(communityID)) {
        setIsJoined(true)
      } else {
        setIsJoined(false)
      }
    }
    if (communityGroupID && communityID) {
      if (userVerifiedCommunityGroupIds.includes(communityGroupID) || userUnverifiedVerifiedCommunityGroupIds.includes(communityGroupID)) {
        setIsJoined(true)
      } else {
        setIsJoined(false)
      }
    }
  }, [
    communityID,
    communityGroupID,
    userVerifiedCommunityIds,
    userUnverifiedVerifiedCommunityIds,
    userUnverifiedVerifiedCommunityGroupIds,
    userVerifiedCommunityGroupIds,
  ])

  useEffect(() => {
    if (communityGroupID) {
      setDataToDisplay({
        title: selectedCommunityGroupData?.title,
        desc: selectedCommunityGroupData?.description,
        membersCount: selectedCommunityGroupData?.memberCount,
        coverImage: selectedCommunityGroupData?.communityGroupLogoCoverUrl?.imageUrl,
        logoImage: selectedCommunityGroupData?.communityGroupLogoUrl?.imageUrl,
        adminId: selectedCommunityGroupData?.adminUserId?._id,
        id: selectedCommunityGroupData?._id,
      })
    } else {
      setDataToDisplay({
        title: selectedCommunityData?.name,
        desc: 'nothing',
        membersCount: selectedCommunityData?.numberOfUser,
        coverImage: selectedCommunityData?.communityCoverUrl?.imageUrl,
        logoImage: selectedCommunityData?.communityLogoUrl?.imageUrl,
        adminId: selectedCommunityData?.adminId,
        id: selectedCommunityData?._id,
      })
    }
  }, [communityGroupID, selectedCommunityData, selectedCommunityGroupData])
  // console.log('dataToDisplay', dataToDisplay)

  const handleToggleJoinCommunityOrGroup = (id: string, join: boolean) => {
    console.log('id', id)

    if (communityGroupID) {
      JoinCommunityGroup(id)
    } else if (join) {
      JoinCommunity(id)
    } else {
      LeaveCommunity(id)
    }
  }

  return (
    <div className="rounded-2xl bg-white shadow-card">
      <div className=" relative h-[164px] w-full overflow-hidden rounded-t-2xl">
        <Image
          src={dataToDisplay.coverImage || universityPlaceholder}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt={'university'}
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="p-4">
        <div className="card-title flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div
              style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
              className="relative flex items-center justify-center bg-white rounded-full w-[40px] h-[40px] overflow-hidden"
            >
              {dataToDisplay?.logoImage ? (
                <Image alt="logo" src={dataToDisplay?.logoImage} fill />
              ) : (
                <FaUniversity className="text-warning-500 text-[20px]" />
              )}
            </div>
            <p className="text-sm font-bold">{dataToDisplay?.title}</p>
            {isAiPowered && <p className="ai-power text-xs font-extrabold">AI POWERED </p>}
          </div>
          <p className="text-sm text-primary-500">
            Joined since <span>{joinedSince}</span>{' '}
          </p>
          {/* Buttons  */}
          {!isJoined && dataToDisplay?.adminId != userData.id ? (
            <button
              onClick={() => handleToggleJoinCommunityOrGroup(dataToDisplay?.id, true)}
              className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-1 max-md:py-3 rounded-xl mr-10 max-xl:mr-5 max-lg:text-sm max-md:mr-0"
            >
              Join Community
            </button>
          ) : dataToDisplay?.adminId == userData.id ? (
            <button className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-2 w-max h-max  rounded-full mr-10 max-xl:mr-5 max-lg:text-sm max-md:mr-0">
              <IoMdSettings />
            </button>
          ) : (
            <button
              onClick={() => handleToggleJoinCommunityOrGroup(dataToDisplay?.id, false)}
              className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-1 max-md:py-3 rounded-xl mr-10 max-xl:mr-5 max-lg:text-sm max-md:mr-0"
            >
              leave Community
            </button>
          )}
          {/* Buttons end  */}
        </div>
        <div>
          <p className="text-2xs text-neutral-500 py-4">{dataToDisplay.desc}</p>
          <p className="text-2xs text-neutral-500">
            <span>{dataToDisplay?.membersCount}</span> members
          </p>
        </div>
      </div>
    </div>
  )
}
