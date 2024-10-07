'use client'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import './index.css'
import { FaUniversity } from 'react-icons/fa'
import { useQueryClient } from '@tanstack/react-query'
import { useUniStore } from '@/store/store'
import {
  useGetCommunityGroups,
  useJoinCommunity,
  useJoinCommunityGroup,
  useLeaveCommunity,
  useUpdateCommunity,
  useUpdateCommunityGroup,
} from '@/services/community-university'
import { IoMdSettings } from 'react-icons/io'
import { replaceImage } from '@/services/uploadImage'
import { MdAddAPhoto } from 'react-icons/md'

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
  const { data: communityGroups } = useGetCommunityGroups(communityID, true)
  const [isJoined, setIsJoined] = useState(false)
  const [coverImage, setCoverImage] = useState('')
  const [logoImage, setLogoImage] = useState('')
  const [dataToDisplay, setDataToDisplay] = useState({ title: '', desc: '', membersCount: 0, coverImage: '', logoImage: '', adminId: '', id: '' })
  const { mutate: JoinCommunity } = useJoinCommunity()
  const { mutate: LeaveCommunity } = useLeaveCommunity()
  const { mutate: JoinCommunityGroup } = useJoinCommunityGroup()
  const { mutate: updateCommunity } = useUpdateCommunity()
  const { mutate: UpdateCommunityGroup } = useUpdateCommunityGroup()
  const selectedCommunityData = Communitydata?.community?.find((item: any) => item?._id == communityID)
  const selectedCommunityGroupData = communityGroupID && CommunityGroupdata?.groups?.find((item: any) => item?._id == communityGroupID)

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

  const handleToggleJoinCommunityOrGroup = (id: string, join: boolean) => {
    if (communityGroupID) {
      JoinCommunityGroup(id)
    } else if (join) {
      JoinCommunity(id)
    } else {
      LeaveCommunity(id)
    }
  }

  const handleCoverImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], selectedCommunityData.communityCoverUrl?.publicId)

      const dataToPush = { communityCoverUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

      updateCommunity({ id: selectedCommunityData?._id, data: dataToPush })
    } else {
      console.error('No file selected.')
    }
  }

  const handleLogoImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], selectedCommunityData?.communityLogoUrl?.publicId)

      const dataToPush = { communityLogoUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

      updateCommunity({ id: selectedCommunityData?._id, data: dataToPush })
    } else {
      console.error('No file selected.')
    }
  }

  //group image
  const handleGroupCoverImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], selectedCommunityGroupData?.communityGroupLogoCoverUrl?.publicId)

      const dataToPush = { communityGroupLogoCoverUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

      UpdateCommunityGroup({ dataToPush, id: selectedCommunityGroupData?._id })
    } else {
      console.error('No file selected.')
    }
  }

  const handleGroupLogoImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], selectedCommunityGroupData?.communityGroupLogoUrl?.publicId)

      const dataToPush = { communityGroupLogoUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }
      UpdateCommunityGroup({ dataToPush, id: selectedCommunityGroupData?._id })
    } else {
      console.error('No file selected.')
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
        {!communityGroupID ? (
          <div
            className={`${
              dataToDisplay?.adminId == userData.id ? 'absolute  ' : 'hidden'
            }  w-8 h-8 rounded-full bg-white shadow-2xl z-30 top-5 right-[5%] flex items-center justify-center `}
          >
            <input style={{ display: 'none' }} type="file" id="CommunityCoverImagefile" onChange={(e) => handleCoverImageUpload(e)} />
            <label htmlFor="CommunityCoverImagefile">
              <MdAddAPhoto />
            </label>
          </div>
        ) : (
          <div
            className={`${
              dataToDisplay?.adminId == userData.id ? 'absolute  ' : 'hidden'
            }  w-8 h-8 rounded-full bg-white shadow-2xl z-30 top-5 right-[5%] flex items-center justify-center `}
          >
            <input style={{ display: 'none' }} type="file" id="CommunityGroupCoverImagefile" onChange={(e) => handleGroupCoverImageUpload(e)} />
            <label htmlFor="CommunityGroupCoverImagefile">
              <MdAddAPhoto />
            </label>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="card-title flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div
              style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
              className="relative flex items-center justify-center bg-white rounded-full w-[40px] h-[40px] overflow-hidden"
            >
              {!communityGroupID ? (
                <div
                  className={`${
                    dataToDisplay?.adminId == userData.id ? 'absolute  ' : 'hidden'
                  }  w-8 h-8 rounded-full bg-white shadow-2xl z-30 top-1 right-1 flex items-center justify-center `}
                >
                  <input style={{ display: 'none' }} type="file" id="communitylogoImagefile" onChange={(e) => handleLogoImageUpload(e)} />
                  <label htmlFor="communitylogoImagefile">
                    <MdAddAPhoto />
                  </label>
                </div>
              ) : (
                <div
                  className={`${
                    dataToDisplay?.adminId == userData.id ? 'absolute  ' : 'hidden'
                  }  w-8 h-8 rounded-full bg-white shadow-2xl z-30 top-1 right-1 flex items-center justify-center `}
                >
                  <input style={{ display: 'none' }} type="file" id="communityGrouplogoImagefile" onChange={(e) => handleGroupLogoImageUpload(e)} />
                  <label htmlFor="communityGrouplogoImagefile">
                    <MdAddAPhoto />
                  </label>
                </div>
              )}

              {dataToDisplay?.logoImage ? (
                <Image alt="logo" src={dataToDisplay?.logoImage} fill />
              ) : (
                <FaUniversity className="text-warning-500 text-[20px]" />
              )}
            </div>
            <p className="text-sm font-bold">{dataToDisplay?.title}</p>
            {isAiPowered && <p className="ai-power text-xs font-extrabold">AI POWERED </p>}
          </div>
          <div
            className={`${
              dataToDisplay?.adminId != userData.id ? 'flex-col justify-center items-center text-center gap-2' : 'gap-4'
            } flex  items-center`}
          >
            <p className="text-sm text-primary-500 text-center">
              since <span>{joinedSince}</span>{' '}
            </p>
            {/* Buttons  */}
            {!isJoined && dataToDisplay?.adminId != userData.id ? (
              <button
                onClick={() => handleToggleJoinCommunityOrGroup(dataToDisplay?.id, true)}
                className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-1 max-md:py-3 rounded-xl   max-lg:text-sm "
              >
                Join {communityGroupID ? 'Group' : 'Community '}
              </button>
            ) : dataToDisplay?.adminId == userData.id ? (
              <button className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-2 w-max h-max  rounded-full   max-lg:text-sm max-md:mr-0">
                <IoMdSettings />
              </button>
            ) : (
              <button
                onClick={() => handleToggleJoinCommunityOrGroup(dataToDisplay?.id, false)}
                className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-1 max-md:py-3 rounded-xl   max-lg:text-sm max-md:mr-0"
              >
                leave {communityGroupID ? 'Group' : 'Community '}
              </button>
            )}
            {/* Buttons end  */}
          </div>
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
