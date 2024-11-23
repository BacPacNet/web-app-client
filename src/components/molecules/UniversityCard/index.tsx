'use client'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import './index.css'
import { FaUniversity } from 'react-icons/fa'
import { useQueryClient } from '@tanstack/react-query'
import { useUniStore } from '@/store/store'
import {
  useGetCommunity,
  useGetCommunityGroup,
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
import Button from '@/components/atoms/Buttons'
import { Skeleton } from '@/components/ui/Skeleton'
import useCookie from '@/hooks/useCookie'

interface Props {
  communityID: string
  communityGroupID?: string
}

export default function UniversityCard({ communityID, communityGroupID }: Props) {
  //  const queryClient = useQueryClient()
  //  const Communitydata: any = queryClient.getQueryData(['UserSubscribedCommunityGroups'])
  //  const CommunityGroupdata: any = queryClient.getQueryData(['communityGroups', communityID])
  //  const { data: communityGroups } = useGetCommunityGroups(communityID, true)
  const [isJoined, setIsJoined] = useState(false)
  const [cookieValue] = useCookie('uni_user_token')

  const { data: communityData, isLoading: isCommunityLoading } = useGetCommunity(communityID)
  const { data: communityGroups, isLoading: isCommunityGroupsLoading, refetch } = useGetCommunityGroup(communityID, communityGroupID, isJoined)

  useEffect(() => {
    if (communityGroupID) {
      refetch()
    }
  }, [communityGroupID])

  const [coverImage, setCoverImage] = useState('')
  const [logoImage, setLogoImage] = useState('')
  const [dataToDisplay, setDataToDisplay] = useState({ title: '', desc: '', membersCount: 0, coverImage: '', logoImage: '', adminId: '', id: '' })
  const { mutate: JoinCommunity } = useJoinCommunity()
  const { mutate: LeaveCommunity } = useLeaveCommunity()
  const { mutate: JoinCommunityGroup } = useJoinCommunityGroup()
  const { mutate: updateCommunity } = useUpdateCommunity()
  const { mutate: UpdateCommunityGroup } = useUpdateCommunityGroup()
  //  const selectedCommunityData = Communitydata?.community?.find((item: any) => item?._id == communityID)
  //  const selectedCommunityGroupData = communityGroupID && CommunityGroupdata?.groups?.find((item: any) => item?._id == communityGroupID)

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

  //  useEffect(() => {
  //    if (communityGroupID) {
  //      setDataToDisplay({
  //        title: selectedCommunityGroupData?.title,
  //        desc: selectedCommunityGroupData?.description,
  //        membersCount: selectedCommunityGroupData?.memberCount,
  //        coverImage: selectedCommunityGroupData?.communityGroupLogoCoverUrl?.imageUrl,
  //        logoImage: selectedCommunityGroupData?.communityGroupLogoUrl?.imageUrl,
  //        adminId: selectedCommunityGroupData?.adminUserId?._id,
  //        id: selectedCommunityGroupData?._id,
  //      })
  //    } else {
  //      setDataToDisplay({
  //        title: selectedCommunityData?.name,
  //        desc: 'nothing',
  //        membersCount: selectedCommunityData?.numberOfUser,
  //        coverImage: selectedCommunityData?.communityCoverUrl?.imageUrl,
  //        logoImage: selectedCommunityData?.communityLogoUrl?.imageUrl,
  //        adminId: selectedCommunityData?.adminId,
  //        id: selectedCommunityData?._id,
  //      })
  //    }
  //  }, [communityGroupID, selectedCommunityData, selectedCommunityGroupData])

  const handleToggleJoinCommunityOrGroup = (id: string, join: boolean, communityName?: string) => {
    if (communityGroupID) {
      JoinCommunityGroup(id)
    } else if (join) {
      JoinCommunity({ id, communityName })
    } else {
      LeaveCommunity(id)
    }
  }

  const handleCoverImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], communityData?.communityCoverUrl?.publicId)

      const dataToPush = { communityCoverUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

      updateCommunity({ id: communityData?._id, data: dataToPush })
    } else {
      console.error('No file selected.')
    }
  }

  const handleLogoImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], communityData?.communityLogoUrl?.publicId)

      const dataToPush = { communityLogoUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

      updateCommunity({ id: communityData?._id, data: dataToPush })
    } else {
      console.error('No file selected.')
    }
  }

  //group image
  //  const handleGroupCoverImageUpload = async (e: any) => {
  //    const files = e.target.files

  //    if (files && files[0]) {
  //      const imagedata: any = await replaceImage(files[0], selectedCommunityGroupData?.communityGroupLogoCoverUrl?.publicId)

  //      const dataToPush = { communityGroupLogoCoverUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

  //      UpdateCommunityGroup({ dataToPush, id: selectedCommunityGroupData?._id })
  //    } else {
  //      console.error('No file selected.')
  //    }
  //  }

  //  const handleGroupLogoImageUpload = async (e: any) => {
  //    const files = e.target.files

  //    if (files && files[0]) {
  //      const imagedata: any = await replaceImage(files[0], selectedCommunityGroupData?.communityGroupLogoUrl?.publicId)

  //      const dataToPush = { communityGroupLogoUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }
  //      UpdateCommunityGroup({ dataToPush, id: selectedCommunityGroupData?._id })
  //    } else {
  //      console.error('No file selected.')
  //    }
  //  }

  if (isCommunityLoading || isCommunityGroupsLoading) return <Skeleton className="w-full h-60 bg-slate-300 my-4" />

  return (
    <div className="rounded-2xl bg-white shadow-card">
      <div className=" relative h-[164px] w-full overflow-hidden rounded-t-2xl mt-4">
        <Image
          src={communityData?.communityCoverUrl?.imageUrl || universityPlaceholder}
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
            }  w-8 h-8 rounded-full bg-white shadow-2xl z-0 top-5 right-[5%] flex items-center justify-center `}
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
            }  w-8 h-8 rounded-full bg-white shadow-2xl z-0 top-5 right-[5%] flex items-center justify-center `}
          >
            <input
              style={{ display: 'none' }}
              type="file"
              id="CommunityGroupCoverImagefile"
              // onChange={(e) => handleGroupCoverImageUpload(e)}
            />
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
                  }  w-8 h-8 rounded-full bg-white shadow-2xl z-[2] top-1 right-1 flex items-center justify-center `}
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
                  }  w-8 h-8 rounded-full bg-white shadow-2xl z-[2] top-1 right-1 flex items-center justify-center `}
                >
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    id="communityGrouplogoImagefile"
                    //  onChange={(e) => handleGroupLogoImageUpload(e)}
                  />
                  <label htmlFor="communityGrouplogoImagefile">
                    <MdAddAPhoto />
                  </label>
                </div>
              )}

              <Image
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                alt="logo"
                src={communityData?.communityLogoUrl?.imageUrl || universityPlaceholder}
                className="object-cover object-top"
              />
            </div>
            <p className="text-sm font-bold">{communityGroups?.title || communityData?.name}</p>
            <p className="ai-power text-xs font-extrabold">AI POWERED </p>
          </div>
          <div
            className={`${
              dataToDisplay?.adminId != userData.id ? 'flex-col justify-center items-center text-center gap-2' : 'gap-4'
            } flex  items-center`}
          >
            {/* <p className="text-sm text-primary-500 text-center">
              since <span>{joinedSince}</span>{' '}
            </p> */}

            {/* Buttons  */}
            {!isJoined && communityData?.adminId != userData.id ? (
              <Button
                onClick={() => handleToggleJoinCommunityOrGroup(communityGroupID || communityID, true, communityData?.name)}
                size="extra_small"
                variant="primary"
              >
                Join {communityGroupID ? 'Group' : 'Community '}
              </Button>
            ) : communityData?.adminId == userData.id ? (
              <button className="text-primary-500 font-medium bg-[#F3F2FF] px-2 py-2 w-max h-max  rounded-full max-lg:text-sm max-md:mr-0">
                <IoMdSettings />
              </button>
            ) : (
              <Button onClick={() => handleToggleJoinCommunityOrGroup(communityGroupID || communityID, false)} size="extra_small" variant="shade">
                Leave {communityGroupID ? 'Group' : 'Community '}
              </Button>
            )}
          </div>
        </div>
        <div>
          <p className="text-2xs text-neutral-500 py-4 ">{communityData?.about}</p>
          <p className="text-2xs text-neutral-500">
            <span>{communityData?.numberOfUser}</span> members
          </p>
        </div>
      </div>
    </div>
  )
}
