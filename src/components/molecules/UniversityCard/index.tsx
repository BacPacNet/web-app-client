'use client'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import './index.css'
import { useUniStore } from '@/store/store'
import { useGetCommunity, useJoinCommunity, useLeaveCommunity, useUpdateCommunity } from '@/services/community-university'
import { IoMdSettings } from 'react-icons/io'
import { replaceImage } from '@/services/uploadImage'
import { MdAddAPhoto } from 'react-icons/md'
import Button from '@/components/atoms/Buttons'
import { Skeleton } from '@/components/ui/Skeleton'
import useCookie from '@/hooks/useCookie'
import Spinner from '@/components/atoms/spinner'
import { openModal } from '../Modal/ModalManager'
import CommunityLeaveModal from '../CommunityLeaveModal'

interface Props {
  communityID: string
  communityGroupID?: string
  isGroupAdmin: boolean
  setIsGroupAdmin: (isGroupAdmin: boolean) => void
}

export default function UniversityCard({ communityID, isGroupAdmin, setIsGroupAdmin }: Props) {
  const [isUserJoinedCommunity, setIsUserJoinedCommunity] = useState<boolean | null>(null)
  const { data: communityData, isLoading: isCommunityLoading } = useGetCommunity(communityID)

  const { mutate: joinCommunity, isPending: isJoinLoading } = useJoinCommunity()
  const { mutate: leaveCommunity, isPending: isLeaveLoading } = useLeaveCommunity()
  const { mutate: updateCommunity } = useUpdateCommunity()
  //  const selectedCommunityData = Communitydata?.community?.find((item: any) => item?._id == communityID)
  //  const selectedCommunityGroupData = communityGroupID && CommunityGroupdata?.groups?.find((item: any) => item?._id == communityGroupID)

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
      // leaveCommunity(communityID, {
      //   onSuccess: () => {
      //     setIsUserJoinedCommunity(false)
      //   },
      // })
      openModal(<CommunityLeaveModal communityID={communityID} setIsUserJoinedCommunity={setIsUserJoinedCommunity} />, 'h-max w-96')
    }
  }

  //  const handleCoverImageUpload = async (e: any) => {
  //    const files = e.target.files

  //    if (files && files[0]) {
  //      const imagedata: any = await replaceImage(files[0], communityData?.communityCoverUrl?.publicId)

  //      const dataToPush = { communityCoverUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

  //      updateCommunity({ id: communityData?._id, data: dataToPush })
  //    } else {
  //      console.error('No file selected.')
  //    }
  //  }

  //  const handleLogoImageUpload = async (e: any) => {
  //    const files = e.target.files

  //    if (files && files[0]) {
  //      const imagedata: any = await replaceImage(files[0], communityData?.communityLogoUrl?.publicId)

  //      const dataToPush = { communityLogoUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

  //      updateCommunity({ id: communityData?._id, data: dataToPush })
  //    } else {
  //      console.error('No file selected.')
  //    }
  //  }

  if (isCommunityLoading) return <Skeleton className="w-full h-60 bg-slate-300 my-4" />

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
      </div>
      <div className="p-4">
        <div className="card-title flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <div
              style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
              className="relative flex items-center justify-center bg-white rounded-full w-[40px] h-[40px] overflow-hidden"
            >
              <Image
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                alt="logo"
                src={communityData?.communityLogoUrl?.imageUrl || universityPlaceholder}
                className="object-cover object-top"
              />
            </div>
            <p className="text-sm font-bold">{communityData?.name}</p>
            <p className="ai-power text-xs font-extrabold">AI POWERED </p>
          </div>
          <div>
            <Button onClick={() => handleToggleJoinCommunity(communityID)} size="extra_small_paddind_2" variant="primary">
              {isJoinLoading || isLeaveLoading ? 'Loading...' : !isUserJoinedCommunity ? 'Join Community' : 'Leave Community'}
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
