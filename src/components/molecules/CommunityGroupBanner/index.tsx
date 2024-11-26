'use client'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import './index.css'
import { useUniStore } from '@/store/store'
import { useGetCommunityGroup, useUpdateCommunity, useUpdateCommunityGroup } from '@/services/community-university'
import { replaceImage } from '@/services/uploadImage'
import { MdAddAPhoto } from 'react-icons/md'
import Button from '@/components/atoms/Buttons'
import { Skeleton } from '@/components/ui/Skeleton'
import { HiPencilAlt } from 'react-icons/hi'
import EditCommunityGroupModal from '../EditCommunityGroupModal'
import { useJoinCommunityGroup, useLeaveCommunityGroup } from '@/services/community-group'

interface Props {
  communityID: string
  communityGroupID: string
  isGroupAdmin: boolean
  setIsGroupAdmin: (isGroupAdmin: boolean) => void
}

export default function CommunityGroupBanner({ communityID, communityGroupID, isGroupAdmin, setIsGroupAdmin }: Props) {
  const { userData } = useUniStore()
  const [showEditGroupMoadal, setShowEditGroupMoadal] = useState<boolean>(false)
  const [isUserJoinedCommunityGroup, setIsUserJoinedCommunityGroup] = useState<boolean | null>(null)
  const { data: communityGroups, isLoading: isCommunityGroupsLoading, refetch } = useGetCommunityGroup(communityID, communityGroupID)
  const { mutate: joinCommunityGroup, isPending: isJoinCommunityPending } = useJoinCommunityGroup()
  const { mutate: leaveCommunityGroup, isPending: isLeaveCommunityPending } = useLeaveCommunityGroup()
  const { mutate: updateCommunity } = useUpdateCommunity()
  const { mutate: UpdateCommunityGroup } = useUpdateCommunityGroup()

  useEffect(() => {
    if (communityGroupID) {
      refetch()
    }
  }, [communityGroupID])

  useEffect(() => {
    if (communityGroups && setIsGroupAdmin) {
      setIsGroupAdmin(communityGroups?.adminUserId?._id === userData?.id)
    }
  }, [communityGroups])

  useEffect(() => {
    if (communityGroups && userData) {
      setIsUserJoinedCommunityGroup(communityGroups.users.some((user) => user.userId.toString() === userData.id))
    }
  }, [communityGroups])

  const handleToggleJoinCommunityGroup = (communityGroupID: string) => {
    if (!isUserJoinedCommunityGroup) {
      joinCommunityGroup(communityGroupID, {
        onSuccess: () => {
          setIsUserJoinedCommunityGroup(true)
        },
      })
    } else {
      leaveCommunityGroup(communityGroupID, {
        onSuccess: () => {
          setIsUserJoinedCommunityGroup(false)
        },
      })
    }
  }

  const [coverImage, setCoverImage] = useState('')
  const [logoImage, setLogoImage] = useState('')
  const [dataToDisplay, setDataToDisplay] = useState({ title: '', desc: '', membersCount: 0, coverImage: '', logoImage: '', adminId: '', id: '' })

  //  const selectedCommunityData = Communitydata?.community?.find((item: any) => item?._id == communityID)
  //  const selectedCommunityGroupData = communityGroupID && CommunityGroupdata?.groups?.find((item: any) => item?._id == communityGroupID)

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

  //  useEffect(() => {
  //    if (communityID && !communityGroupID) {
  //      if (userVerifiedCommunityIds.includes(communityID) || userUnverifiedVerifiedCommunityIds.includes(communityID)) {
  //        setIsJoined(true)
  //      } else {
  //        setIsJoined(false)
  //      }
  //    }
  //    if (communityGroupID && communityID) {
  //      if (userVerifiedCommunityGroupIds.includes(communityGroupID) || userUnverifiedVerifiedCommunityGroupIds.includes(communityGroupID)) {
  //        setIsJoined(true)
  //      } else {
  //        setIsJoined(false)
  //      }
  //    }
  //  }, [
  //    communityID,
  //    communityGroupID,
  //    userVerifiedCommunityIds,
  //    userUnverifiedVerifiedCommunityIds,
  //    userUnverifiedVerifiedCommunityGroupIds,
  //    userVerifiedCommunityGroupIds,
  //  ])

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

  const handleCoverImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], communityGroups?.communityGroupLogoCoverUrl?.publicId)

      const dataToPush = { communityCoverUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

      updateCommunity({ id: communityGroups?._id, data: dataToPush })
    } else {
      console.error('No file selected.')
    }
  }

  const handleLogoImageUpload = async (e: any) => {
    const files = e.target.files

    if (files && files[0]) {
      const imagedata: any = await replaceImage(files[0], communityGroups?.communityGroupLogoUrl?.publicId)

      const dataToPush = { communityLogoUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }

      updateCommunity({ id: communityGroups?._id, data: dataToPush })
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

  if (isCommunityGroupsLoading) return <Skeleton className="w-full h-60 bg-slate-300 my-4" />

  return (
    <>
      {showEditGroupMoadal && communityGroups && <EditCommunityGroupModal setNewGroup={setShowEditGroupMoadal} communityGroups={communityGroups} />}

      <div className="rounded-2xl bg-white shadow-card">
        <div className=" relative h-[164px] w-full overflow-hidden rounded-t-2xl mt-4">
          <Image
            src={communityGroups?.communityGroupLogoCoverUrl?.imageUrl || universityPlaceholder}
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
                  src={communityGroups?.communityGroupLogoUrl?.imageUrl || universityPlaceholder}
                  className="object-cover object-top"
                />
              </div>
              <p className="text-sm font-bold">{communityGroups?.title}</p>
              {/*<p className="ai-power text-xs font-extrabold">AI POWERED </p>*/}
            </div>
            <div
              className={`${
                dataToDisplay?.adminId != userData.id ? 'flex-col justify-center items-center text-center gap-2' : 'gap-4'
              } flex  items-center`}
            >
              {isGroupAdmin ? (
                <div className="flex gap-2 items-center text-2xs lg:text-xs text-primary-500">
                  <button onClick={() => setShowEditGroupMoadal(true)}>Edit Group</button>
                  <HiPencilAlt size={16} />
                </div>
              ) : (
                <Button onClick={() => handleToggleJoinCommunityGroup(communityGroupID)} size="extra_small" variant="primary">
                  {!isUserJoinedCommunityGroup ? 'Join Group' : 'Leave Group'}
                </Button>
              )}
              {/*
            {!isJoined && communityGroups?.adminId != userData.id ? (
              <Button
                onClick={() => handleToggleJoinCommunityOrGroup(communityGroupID || communityID, true, communityGroups?.title)}
                size="extra_small"
                variant="primary"
              >
                Join {communityGroupID ? 'Group' : 'Community '}
              </Button>
            ) : communityGroups?.adminId == userData.id ? (
              <button className="text-primary-500 font-medium bg-[#F3F2FF] px-2 py-2 w-max h-max  rounded-full max-lg:text-sm max-md:mr-0">
                <IoMdSettings />
              </button>
            ) : (
              <Button onClick={() => handleToggleJoinCommunityOrGroup(communityGroupID || communityID, false)} size="extra_small" variant="shade">
                Leave {communityGroupID ? 'Group' : 'Community '}
              </Button>
            )}*/}
            </div>
          </div>
          <div>
            <p className="text-2xs text-neutral-500 pt-4">{communityGroups?.description}</p>
            <p className="text-2xs text-neutral-500 pt-2">
              <span>{communityGroups?.users?.length}</span> members
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
