'use client'
import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'
import universityPlaceholder from '@assets/university_banner.svg'
import './index.css'
import { useUniStore } from '@/store/store'
import EditCommunityGroupModal from '../EditCommunityGroupModal'
import { useJoinCommunityGroup } from '@/services/community-group'
import CommunityLeaveModal from '../CommunityLeaveModal'
import { CommunityGroupType, CommunityGroupTypeEnum, CommunityGroupVisibility, status } from '@/types/CommuityGroup'
import publicIcon from '@assets/public.svg'
import Buttons from '@/components/atoms/Buttons'
import { FaLock } from 'react-icons/fa6'
import CustomTooltip from '@/components/atoms/CustomTooltip'
import GroupAvatarWithBadge from '@/components/atoms/GroupAvatarWithBadge'
import CoverImageUploader from '@/components/atoms/CoverImage'
import CommunitySettingMenu from '@/components/atoms/CommunitySettingMenu'
import JoinGroupButton from '@/components/atoms/JoinGroupButton'
import { CommunityGroupModal } from '../Modal/CommunityGroupModal'
import useDeviceType from '@/hooks/useDeviceType'
import DeleteCommunityGroupModal from '../DeleteCommunityGroupModal'
import { useModal } from '@/context/ModalContext'
import PostSkeleton from '@/components/Timeline/PostSkeleton'
import { notificationRoleAccess } from '@/components/organisms/NotificationTabs/NotificationTab'
import { notificationStatus } from '@/services/notification'
import { useJoinCommunityGroup as useJoinCommunityGroupFromNotification } from '@/services/notification'

interface Props {
  communityID: string
  communityGroupID: string
  isGroupAdmin: boolean
  setIsGroupAdmin: (isGroupAdmin: boolean) => void
  isUserJoinedCommunityGroup: boolean | null
  setIsUserJoinedCommunityGroup: (setIsMember: boolean) => void
  communityGroups: CommunityGroupType
  isCommunityGroupsLoading: boolean
  refetch: () => void
  setIsCommunityGroupLive: (isCommunityGroupNotLive: boolean) => void
  isCommunityGroupLive: boolean | null
  notificationId: string
  notificationType: string
}

export default function CommunityGroupBanner({
  communityID,
  communityGroupID,
  isGroupAdmin,
  setIsGroupAdmin,
  setIsUserJoinedCommunityGroup,
  isUserJoinedCommunityGroup,
  communityGroups,
  isCommunityGroupsLoading,
  refetch,
  setIsCommunityGroupLive,
  isCommunityGroupLive,
  notificationId,
  notificationType,
}: Props) {
  const { userData, userProfileData } = useUniStore()
  const { openModal } = useModal()
  const { isMobile } = useDeviceType()
  const [_showEditGroupMoadal, setShowEditGroupMoadal] = useState<boolean>(false)
  const [toggleDropdown, setToggleDropdown] = useState(false)
  const { mutate: joinCommunityGroup, isPending } = useJoinCommunityGroup()
  const { mutate: joinGroup } = useJoinCommunityGroupFromNotification()
  const CommunityGroupMember = communityGroups?.users.filter((user) => user.status === status.accepted)

  const handleShowMembers = () => {
    openModal(
      <CommunityGroupModal
        adminId={communityGroups?.adminUserId as string}
        communityGroupId={communityGroupID}
        isGroupAdmin={isGroupAdmin}
        users={CommunityGroupMember || []}
        communityAdminIds={communityGroups?.communityId?.adminId as string[]}
        isOfficialGroup={communityGroups?.communityGroupType === CommunityGroupTypeEnum.OFFICIAL}
      />
    )
  }

  const handleAcceptInvite = () => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!communityGroupID) return

    if (notificationType === notificationRoleAccess.GROUP_INVITE) {
      const payload = {
        isAccepted: true,
        groupId: communityGroupID,
        id: notificationId,
      }
      joinGroup(payload, {
        onSuccess: () => {
          refetch()
        },
      })
    }
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

      setIsUserJoinedCommunityGroup(communityGroups?.users?.some((item) => item?._id?.toString() === userData?.id && item?.isRequestAccepted))
    }
  }, [communityGroups, userData, setIsGroupAdmin])

  useEffect(() => {
    if (communityGroups?.isCommunityGroupLive) {
      setIsCommunityGroupLive(true)
    } else {
      setIsCommunityGroupLive(false)
    }
  }, [communityGroups])

  useEffect(() => {
    if (communityGroups?.isCommunityGroupLive) {
      setIsCommunityGroupLive(true)
    } else {
      setIsCommunityGroupLive(false)
    }
  }, [communityGroups])

  const handleToggleJoinCommunityGroup = (communityGroupID: string) => {
    if (isUserRequestPending && isGroupPrivate) return
    if (!isUserJoinedCommunityGroup) {
      joinCommunityGroup(communityGroupID)
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
    return communityGroups?.users?.some((user) => user._id === userProfileData?.users_id && user.status === status.pending) || false
  }, [communityGroups, userProfileData])

  const userStatus = useMemo(() => {
    return communityGroups?.users?.find((user) => user._id === userProfileData?.users_id)?.status as status
  }, [communityGroups, userProfileData])

  const handleEditCommunityGroupModal = () => {
    if (!communityGroups) return
    openModal(<EditCommunityGroupModal setNewGroup={setShowEditGroupMoadal} communityGroups={communityGroups} />)
  }

  const handleDeleteGroup = () => {
    openModal(<DeleteCommunityGroupModal communityId={communityGroups?.communityId?._id} communityGroupId={communityGroups?._id} />, 'h-max w-96')
    //deleteCommunityGroup(communityGroups?._id || '')
    //router.push(`/community/${communityGroups?.communityId._id}`)
  }

  if (isCommunityGroupsLoading) return <PostSkeleton count={1} />

  return (
    <>
      <div className="rounded-lg bg-white shadow-card mb-4">
        <CoverImageUploader imageUrl={communityGroups?.communityGroupLogoCoverUrl?.imageUrl || universityPlaceholder} />

        <div className="p-4">
          <div className="card-title flex justify-between items-center">
            <div className="flex gap-2 flex-wrap items-center">
              <GroupAvatarWithBadge
                groupLogoUrl={communityGroups?.communityGroupLogoUrl?.imageUrl as string}
                isOfficial={isGroupOfficial}
                badgeLogoUrl={communityGroups?.communityId?.communityLogoUrl.imageUrl}
              />
              <p className="text-sm font-bold">{communityGroups?.title}</p>
              {/*<p className="ai-power text-xs font-extrabold">AI POWERED </p>*/}
            </div>

            {isUserJoinedCommunityGroup || isGroupAdmin ? (
              <CommunitySettingMenu
                isOpen={toggleDropdown}
                toggleOpen={setToggleDropdown}
                isAdmin={isGroupAdmin}
                groupStatus={communityGroups?.status}
                onEdit={handleEditCommunityGroupModal}
                onDelete={handleDeleteGroup}
                onLeave={() => handleToggleJoinCommunityGroup(communityGroupID)}
              />
            ) : isCommunityGroupLive == null || !isCommunityGroupLive ? null : communityGroups?.notificationStatus == notificationStatus.default &&
              communityGroups?.notificationTypes == notificationRoleAccess.GROUP_INVITE ? (
              <Buttons onClick={handleAcceptInvite()} variant="primary" size="medium">
                Accept Request
              </Buttons>
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
              <Buttons
                disabled={!isUserJoinedCommunityGroup && communityGroups?.status !== 'pending'}
                onClick={handleShowMembers}
                className="text-neutral-500"
                size="small"
                variant="border"
              >
                {totalCommunityGroupMember} Members
              </Buttons>
              <CustomTooltip
                position={isMobile ? 'bottom' : 'right'}
                icon={
                  !isGroupPrivate ? (
                    <Image src={publicIcon} width={32} height={32} alt="" />
                  ) : (
                    <FaLock size={32} className="text-primary-500 bg-secondary p-2 rounded-full overflow-visible" />
                  )
                }
                content={
                  <>
                    <p className="font-medium text-neutral-900 text-xs sm:text-sm">Private and Public Groups</p>
                    <ul className="mt-2 space-y-2 text-sm text-gray-700">
                      <li className="text-2xs sm:text-xs text-neutral-700">
                        <p className="font-bold">• Public:</p>
                        <p>All users can join these groups without requesting permission. Labeled with globe icon.</p>
                      </li>
                      <li className="text-2xs sm:text-xs text-neutral-700">
                        <p className="font-bold">• Private:</p>
                        <p>Must request access to join the group. Only verified users can request access. Labeled with lock icon.</p>
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
