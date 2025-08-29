import Buttons from '@/components/atoms/Buttons'
import { notificationRoleAccess } from '@/components/organisms/NotificationTabs/NotificationTab'
import { useChangeCommunityGroupStatus } from '@/services/community-group'
import { useUniStore } from '@/store/store'
import React from 'react'
import { notificationStatus as notificationStatusEnum, useJoinCommunityGroup } from '@/services/notification'
import { useRouter } from 'next/navigation'
import { CommunityGroupNotLiveCardProps } from '@/types/CommuityGroup'

const CommunityGroupNotLiveCard = ({
  communityAdminId,
  communityGroupId,
  communityGroupAdminId,
  notificationType,
  notificationId,
  notificationStatus,
  refetch,
  communityID,
  communityGroupTitle,
  communityName,
}: CommunityGroupNotLiveCardProps) => {
  const { mutate: changeGroupStatus } = useChangeCommunityGroupStatus(communityGroupId || '')
  const { userData } = useUniStore()
  const { mutate: joinGroup } = useJoinCommunityGroup()
  const router = useRouter()

  const handleAcceptInvite = () => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!communityGroupId) return

    if (notificationType === notificationRoleAccess.GROUP_INVITE) {
      const payload = {
        isAccepted: true,
        groupId: communityGroupId,
        id: notificationId,
      }
      joinGroup(payload, {
        onSuccess: () => {
          refetch()
        },
      })
    }
  }

  const handleChangeGroupStatus = (status: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    switch (notificationType) {
      case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
        changeGroupStatus(
          {
            status,
            notificationId,
            communityGroupId: communityGroupId,
            adminId: communityAdminId,
            userId: communityGroupAdminId,
            text:
              status == notificationStatusEnum.accepted
                ? `Congratulations! ${communityGroupTitle} is now officially recognized by ${communityName}.`
                : `Your request to create ${communityGroupTitle} as an official group at ${communityName} was not approved.`,
          },
          {
            onSuccess: () => {
              refetch()
              if (status == 'rejected') {
                router.push(`/community/${communityID}`)
              }
            },
          }
        )
        break

      default:
        break
    }
  }

  if (notificationStatus == notificationStatusEnum.accepted) return null

  return (
    <div className="rounded-lg bg-white shadow-card mb-4 p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <p className="text-neutral-700 font-semibold font-inter text-sm">Request Pending</p>
        <p className="text-neutral-700  font-inter text-sm">
          This group is awaiting university admin approval. Members will be able to access the group once the review is complete.
        </p>
      </div>
      <div className="flex justify-end">
        {userData?.id?.toString() == communityAdminId?.toString() && notificationType == notificationRoleAccess.OFFICIAL_GROUP_REQUEST ? (
          <div className="flex items-center gap-4">
            <Buttons onClick={handleChangeGroupStatus('rejected')} className="w-max font-inter " variant="notificationDanger" size="small">
              Reject
            </Buttons>
            <Buttons onClick={handleChangeGroupStatus('accepted')} className="w-max font-inter" variant="primary" size="small">
              Accept
            </Buttons>
          </div>
        ) : notificationType == notificationRoleAccess.GROUP_INVITE &&
          notificationStatus == notificationStatusEnum.default &&
          userData?.id?.toString() !== communityGroupAdminId?.toString() ? (
          <div className="flex items-center gap-4">
            <Buttons onClick={handleAcceptInvite()} className="w-max font-inter" variant="border_primary" size="medium">
              Accept Request
            </Buttons>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CommunityGroupNotLiveCard
