'use client'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import './index.css'
import { useUniStore } from '@/store/store'
import { useGetCommunityGroup, useUpdateCommunity } from '@/services/community-university'
import { replaceImage } from '@/services/uploadImage'
import { MdAddAPhoto } from 'react-icons/md'
import Button from '@/components/atoms/Buttons'
import { Skeleton } from '@/components/ui/Skeleton'
import { HiPencilAlt } from 'react-icons/hi'
import EditCommunityGroupModal from '../EditCommunityGroupModal'
import { useJoinCommunityGroup } from '@/services/community-group'
import { openModal } from '../Modal/ModalManager'
import CommunityLeaveModal from '../CommunityLeaveModal'

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
  const { mutate: updateCommunity } = useUpdateCommunity()

  useEffect(() => {
    if (communityGroupID) {
      refetch()
    }
  }, [communityGroupID])

  useEffect(() => {
    if (communityGroups && userData) {
      const { id } = userData
      setIsGroupAdmin(communityGroups.adminUserId.toString() === id?.toString())
    }
  }, [communityGroups, userData])

  useEffect(() => {
    if (communityGroups && userData) {
      setIsUserJoinedCommunityGroup(communityGroups?.users?.some((user) => user.userId.toString() === userData?.id))
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
      openModal(
        <CommunityLeaveModal communityGroupID={communityGroupID} setIsUserJoinedCommunityGroup={setIsUserJoinedCommunityGroup} />,
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
        </div>
        <div className="p-4">
          <div className="card-title flex justify-between items-center">
            <div className="flex gap-2  flex-wrap items-center">
              <div
                style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
                className="relative flex items-center justify-center bg-white rounded-full w-11 h-11 lg:w-14 lg:h-14 overflow-hidden"
              >
                <Image
                  width={40}
                  height={40}
                  objectFit="cover"
                  objectPosition="center"
                  alt="logo"
                  className="w-11 h-11 lg:w-14 lg:h-14"
                  src={communityGroups?.communityGroupLogoUrl?.imageUrl || universityPlaceholder}
                />
              </div>
              <p className="text-sm font-bold">{communityGroups?.title}</p>
              {/*<p className="ai-power text-xs font-extrabold">AI POWERED </p>*/}
            </div>
            <div
              className={`${
                communityGroups?.adminUserId != userData?.id ? 'flex-col justify-center items-center text-center gap-2' : 'gap-4'
              } flex  items-center`}
            >
              {isGroupAdmin ? (
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
              )}
            </div>
          </div>
          <div>
            <p className="text-xs text-neutral-500 pt-4">{communityGroups?.description}</p>
            <p className="text-xs text-neutral-500 pt-2">
              <span>{communityGroups?.users?.length}</span> members
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
