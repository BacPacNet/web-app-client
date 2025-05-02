'use client'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import universityPlaceholder from '@assets/university_banner.png'
import logoPlaceholder from '@assets/Logo Circle.svg'
import './index.css'
import { useUniStore } from '@/store/store'
import { useGetCommunityGroup, useUpdateCommunity } from '@/services/community-university'
import { Skeleton } from '@/components/ui/Skeleton'
import EditCommunityGroupModal from '../EditCommunityGroupModal'
import { useDeleteCommunityGroup, useJoinCommunityGroup } from '@/services/community-group'
import { openModal } from '../Modal/ModalManager'
import CommunityLeaveModal from '../CommunityLeaveModal'
import { CommunityGroupTypeEnum, CommunityGroupVisibility, status } from '@/types/CommuityGroup'
import publicIcon from '@assets/public.svg'
import Buttons from '@/components/atoms/Buttons'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { FaLock } from 'react-icons/fa6'
import CustomTooltip from '@/components/atoms/CustomTooltip'
import GroupAvatarWithBadge from '@/components/atoms/GroupAvatarWithBadge'
import CoverImageUploader from '@/components/atoms/CoverImage'
import CommunitySettingMenu from '@/components/atoms/CommunitySettingMenu'
import { useRouter } from 'next/navigation'
import JoinGroupButton from '@/components/atoms/JoinGroupButton'
import { CommunityGroupModal } from '../Modal/CommunityGroupModal'
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
  const [_showEditGroupMoadal, setShowEditGroupMoadal] = useState<boolean>(false)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const { data: communityGroups, isLoading: isCommunityGroupsLoading, refetch } = useGetCommunityGroup(communityID, communityGroupID)
  const { mutate: joinCommunityGroup, isPending } = useJoinCommunityGroup()
  const { mutate: deleteCommunityGroup } = useDeleteCommunityGroup()
  const router = useRouter()

  const handleShowMembers = () => {
    openModal(<CommunityGroupModal communityGroupId={communityGroupID} isGroupAdmin={isGroupAdmin} users={communityGroups?.users || []} />)
  }

  useEffect(() => {
    if (communityGroupID) {
      refetch()
    }
  }, [communityGroupID])

  const isGroupOfficial = communityGroups?.communityGroupType === CommunityGroupTypeEnum.OFFICIAL
  const isGroupPrivate = communityGroups?.communityGroupAccess === CommunityGroupVisibility.PRIVATE

  const isUserVerifiedForCommunity = useMemo(() => {
    return userProfileData?.email?.some((email) => email.communityId === communityGroups?.communityId?._id) || false
  }, [userProfileData, communityGroups])

  const totalCommunityGroupMember = communityGroups?.users.filter((user) => user.status === status.accepted).length

  useEffect(() => {
    if (communityGroups && userData) {
      setIsGroupAdmin(communityGroups.adminUserId.toString() === userData.id?.toString())

      setIsUserJoinedCommunityGroup(communityGroups.users.some((item) => item.userId.toString() === userData.id && item.isRequestAccepted))
    }
  }, [communityGroups, userData, setIsGroupAdmin])

  const handleToggleJoinCommunityGroup = (communityGroupID: string) => {
    if (isUserRequestPending) return
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

  const isUserRequestPending = useMemo(() => {
    return communityGroups?.users?.some((user) => user.userId === userProfileData?.users_id && user.status === status.pending) || false
  }, [communityGroups, userProfileData])

  const userStatus = useMemo(() => {
    return communityGroups?.users?.find((user) => user.userId === userProfileData?.users_id)?.status as status
  }, [communityGroups, userProfileData])

  const handleEditCommunityGroupModal = () => {
    if (!communityGroups) return
    openModal(<EditCommunityGroupModal setNewGroup={setShowEditGroupMoadal} communityGroups={communityGroups} />)
  }

  const handleDeleteGroup = () => {
    deleteCommunityGroup(communityGroups?._id || '')
    router.push(`/community/${communityGroups?.communityId._id}`)
  }

  if (isCommunityGroupsLoading) return <Skeleton className="w-full h-60 bg-slate-300 my-4" />

  return (
    <>
      <div className="rounded-2xl bg-white shadow-card mb-4">
        <CoverImageUploader imageUrl={communityGroups?.communityGroupLogoCoverUrl?.imageUrl || universityPlaceholder} />

        <div className="p-4">
          <div className="card-title flex justify-between items-center">
            <div className="flex gap-2 flex-wrap items-center">
              <GroupAvatarWithBadge
                groupLogoUrl={communityGroups?.communityGroupLogoUrl?.imageUrl || logoPlaceholder}
                isOfficial={isGroupOfficial}
                badgeLogoUrl={communityGroups?.communityId?.communityLogoUrl.imageUrl}
              />
              <p className="text-sm font-bold">{communityGroups?.title}</p>
              {/*<p className="ai-power text-xs font-extrabold">AI POWERED </p>*/}
            </div>

            {isUserJoinedCommunityGroup || isGroupAdmin ? (
              <CommunitySettingMenu
                isOpen={toggleDropdown}
                toggleOpen={() => setToggleDropdown(!toggleDropdown)}
                isAdmin={isGroupAdmin}
                groupStatus={communityGroups?.status}
                onEdit={handleEditCommunityGroupModal}
                onDelete={handleDeleteGroup}
                onLeave={() => handleToggleJoinCommunityGroup(communityGroupID)}
              />
            ) : (
              <JoinGroupButton
                isPrivate={isGroupPrivate}
                isVerified={isUserVerifiedForCommunity}
                isPending={isPending}
                userStatus={userStatus}
                onClick={() => handleToggleJoinCommunityGroup(communityGroupID)}
              />
            )}
          </div>
          <div>
            <p className="text-xs text-neutral-500 py-4">{communityGroups?.description}</p>
            <div className="flex items-center gap-2">
              <Buttons onClick={handleShowMembers} className="text-neutral-500" size="extra_small_paddind_2" variant="border">
                {totalCommunityGroupMember} Members
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
