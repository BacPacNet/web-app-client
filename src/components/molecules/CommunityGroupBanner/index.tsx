'use client'
import Image from 'next/image'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import universityPlaceholder from '@assets/university_banner.png'
import logoPlaceholder from '@assets/Logo Circle.svg'
import './index.css'
import { useUniStore } from '@/store/store'
import { useGetCommunityGroup, useUpdateCommunity } from '@/services/community-university'
import { replaceImage } from '@/services/uploadImage'
import { Skeleton } from '@/components/ui/Skeleton'
import EditCommunityGroupModal from '../EditCommunityGroupModal'
import { useDeleteCommunityGroup, useJoinCommunityGroup } from '@/services/community-group'
import { openModal } from '../Modal/ModalManager'
import CommunityLeaveModal from '../CommunityLeaveModal'
import settingIcon from '@assets/settingIcon.svg'
import { CommunityGroupTypeEnum, CommunityGroupVisibility, status } from '@/types/CommuityGroup'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { FiEdit } from 'react-icons/fi'
import publicIcon from '@assets/public.svg'
import { TbLogout2 } from 'react-icons/tb'
import Buttons from '@/components/atoms/Buttons'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { FaLock } from 'react-icons/fa6'
import CustomTooltip from '@/components/atoms/CustomTooltip'
import { BsExclamationCircleFill } from 'react-icons/bs'
import { MdDeleteForever } from 'react-icons/md'
interface Props {
  communityID: string
  communityGroupID: string
  isGroupAdmin: boolean
  setIsGroupAdmin: (isGroupAdmin: boolean) => void
  isUserJoinedCommunityGroup: boolean | null
  setIsUserJoinedCommunityGroup: (setIsMember: boolean) => void
}

export default function CommunityGroupBanner({
  communityID,
  communityGroupID,
  isGroupAdmin,
  setIsGroupAdmin,
  setIsUserJoinedCommunityGroup,
  isUserJoinedCommunityGroup,
}: Props) {
  const { userData, userProfileData } = useUniStore()
  const [showEditGroupMoadal, setShowEditGroupMoadal] = useState<boolean>(false)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const { data: communityGroups, isLoading: isCommunityGroupsLoading, refetch } = useGetCommunityGroup(communityID, communityGroupID)
  const { mutate: joinCommunityGroup } = useJoinCommunityGroup()
  const { mutate: updateCommunity } = useUpdateCommunity()
  const { mutate: deleteCommunityGroup } = useDeleteCommunityGroup()
  useEffect(() => {
    if (communityGroupID) {
      refetch()
    }
  }, [communityGroupID])

  const isGroupOfficial = communityGroups?.communityGroupType === CommunityGroupTypeEnum.OFFICIAL
  const isGroupPrivate = communityGroups?.communityGroupAccess === CommunityGroupVisibility.PRIVATE
  const isUserVerifiedForCommunity = userProfileData?.email?.some((community) => community.communityId === communityGroups?.communityId?._id)

  useEffect(() => {
    if (communityGroups && userData) {
      setIsGroupAdmin(communityGroups.adminUserId.toString() === userData.id?.toString())
      setIsUserJoinedCommunityGroup(communityGroups.users.some((item) => item.userId.toString() === userData.id && item.isRequestAccepted))
    }
  }, [communityGroups, userData, setIsGroupAdmin])

  const handleToggleJoinCommunityGroup = (communityGroupID: string) => {
    if (!isUserJoinedCommunityGroup) {
      joinCommunityGroup(communityGroupID),
        {
          onSuccess: (response: any) => {
            showCustomSuccessToast(response.data.message)
          },
        }
    } else {
      openModal(
        <CommunityLeaveModal
          setIsMember={setIsUserJoinedCommunityGroup}
          communityGroupID={communityGroupID}
          setIsUserJoinedCommunityGroup={setIsUserJoinedCommunityGroup}
        />,
        'h-max w-96'
      )
    }
  }

  const handleEditCommunityGroupModal = () => {
    if (!communityGroups) return
    openModal(<EditCommunityGroupModal setNewGroup={setShowEditGroupMoadal} communityGroups={communityGroups} />)
  }

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

  if (isCommunityGroupsLoading) return <Skeleton className="w-full h-60 bg-slate-300 my-4" />

  return (
    <>
      <div className="rounded-2xl bg-white shadow-card mb-4">
        <div className="relative h-[164px] w-full overflow-hidden rounded-t-2xl mt-4">
          <Image
            src={communityGroups?.communityGroupLogoCoverUrl?.imageUrl || universityPlaceholder}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            alt={'university'}
            className="h-full w-full object-cover object-top"
          />
        </div>
        <div className="p-4">
          <div className="card-title flex justify-between items-center">
            <div className="flex gap-2 flex-wrap items-center">
              <div
                className={`relative z-1 flex items-center justify-center bg-white rounded-full w-11 h-11 lg:w-14 lg:h-14 overflow-visible ${
                  isGroupOfficial && 'border-2 border-primary-500'
                } `}
              >
                <Image
                  width={40}
                  height={40}
                  objectFit="cover"
                  objectPosition="center"
                  alt="logo"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full"
                  src={communityGroups?.communityGroupLogoUrl?.imageUrl || logoPlaceholder}
                />

                {isGroupOfficial && (
                  <div className="absolute bg-white -bottom-2 w-5 h-5 border-2 border-primary-500 rounded-full flex justify-center">
                    <Image
                      className="object-contain rounded-full"
                      src={communityGroups?.communityId?.communityLogoUrl.imageUrl as string}
                      width={12}
                      height={12}
                      alt=""
                    />
                  </div>
                )}
              </div>
              <p className="text-sm font-bold">{communityGroups?.title}</p>
              {/*<p className="ai-power text-xs font-extrabold">AI POWERED </p>*/}
            </div>

            {isUserJoinedCommunityGroup ? (
              <Popover open={toggleDropdown}>
                <PopoverTrigger>
                  <div className="relative">
                    <Image onClick={() => setToggleDropdown(!toggleDropdown)} src={settingIcon} width={32} height={32} alt="" />
                    {communityGroups?.status == status.pending && isGroupAdmin ? (
                      <BsExclamationCircleFill size={12} className="absolute text-warning-500 top-1 right-0 " />
                    ) : (
                      ''
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  onClick={() => setToggleDropdown(!toggleDropdown)}
                  className="p-0 relative drop-shadow-lg right-16 top-2 w-40 bg-white shadow-card border-none"
                >
                  <div className="flex flex-col">
                    {isGroupAdmin && (
                      <div onClick={handleEditCommunityGroupModal} className="flex  items-center px-4 py-2 gap-2 hover:bg-neutral-100 cursor-pointer">
                        <FiEdit size={16} className="text-primary-500" />
                        <p className="font-medium text-neutral-700 text-xs">Edit</p>
                        {communityGroups?.status == status.pending ? <BsExclamationCircleFill size={16} className=" text-warning-500  " /> : ''}
                      </div>
                    )}

                    {isGroupAdmin && (
                      <div
                        onClick={() => deleteCommunityGroup(communityGroups?._id || '')}
                        className="flex  items-center px-4 py-2 gap-2 hover:bg-neutral-100 cursor-pointer"
                      >
                        <MdDeleteForever size={16} className="text-destructive-600" />
                        <p className="font-medium text-neutral-700 text-xs">Delete</p>
                      </div>
                    )}
                    {!isGroupAdmin && (
                      <div
                        onClick={() => handleToggleJoinCommunityGroup(communityGroupID)}
                        className="flex  items-center px-4 py-2 gap-2 hover:bg-neutral-100 cursor-pointer"
                      >
                        <TbLogout2 strokeWidth={2} size={16} className="text-red-500" />
                        <p className="font-medium text-neutral-700 text-xs">Leave</p>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <>
                {isGroupPrivate ? (
                  <>
                    {isUserVerifiedForCommunity ? (
                      <Buttons size="extra_small_paddind_2" onClick={() => handleToggleJoinCommunityGroup(communityGroupID)}>
                        Request Access
                      </Buttons>
                    ) : (
                      <Buttons variant="disable" size="extra_small_paddind_2" disabled={true}>
                        Verified Users Only
                      </Buttons>
                    )}
                  </>
                ) : (
                  <Buttons size="extra_small_paddind_2" onClick={() => handleToggleJoinCommunityGroup(communityGroupID)}>
                    Join Group
                  </Buttons>
                )}
              </>
            )}

            {/*{isGroupAdmin ? (
                <div
                  onClick={() => handleEditCommunityGroupModal()}
                  className="flex gap-2 items-center text-2xs lg:text-xs text-primary-500 whitespace-nowrap cursor-pointer"
                >
                  <button>Edit Group</button>
                  <HiPencilAlt size={16} />
                </div>
              ) : (
                <Button onClick={() => handleToggleJoinCommunityGroup(communityGroupID)} size="extra_small" variant="primary">
                  {!isUserJoinedCommunityGroup ? 'Join Group' : 'Leave Group'}
                </Button>
              )}*/}
          </div>
          <div>
            <p className="text-xs text-neutral-500 py-4">{communityGroups?.description}</p>
            <div className="flex items-center gap-2">
              <Buttons className="text-neutral-500" size="extra_small_paddind_2" variant="border">
                {communityGroups?.users?.length} Members
              </Buttons>
              <CustomTooltip
                icon={
                  !isGroupPrivate ? (
                    <Image src={publicIcon} width={32} height={32} alt="" />
                  ) : (
                    <FaLock size={32} className="text-primary-500 bg-secondary p-2 rounded-full overflow-visible" />
                  )
                }
                content={
                  <>
                    <p className="font-medium text-neutral-900">Private and Public Groups</p>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700">
                      <li className="text-xs text-neutral-700">
                        <p className="font-bold">• Public:</p>
                        <p>
                          All users can join these groups without <br />
                          requesting permission. Labeled with globe icon.
                        </p>
                      </li>
                      <li className="text-xs text-neutral-700">
                        <p className="font-bold">• Private:</p>
                        <p>
                          Must request access to join the group. Only <br /> verified users can request access. Labeled with <br /> lock icon.
                        </p>
                      </li>
                    </ul>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
