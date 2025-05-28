'use client'

import { notificationRoleAccess } from '@/components/organisms/NotificationTabs/NotificationTab'
import { notificationStatus } from '@/services/notification'
import { useChangeCommunityGroupStatus, useJoinRequestPrivateGroup } from '@/services/community-group'
import { useJoinCommunityGroup } from '@/services/notification'
import Buttons from '../../Buttons'

type NotificationActionsProps = {
  data: any
}

export const NotificationActions = ({ data }: NotificationActionsProps) => {
  const { mutate: joinGroup } = useJoinCommunityGroup()
  const { mutate: changeGroupStatus } = useChangeCommunityGroupStatus(data?.communityGroupId?._id || '')
  const { mutate: handleJoinCommunityRequest } = useJoinRequestPrivateGroup(data?.communityGroupId?._id || '')

  const handleAcceptInvite = (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!data?.communityGroupId?._id) return

    if (data.type === notificationRoleAccess.GROUP_INVITE) {
      const payload = {
        isAccepted: true,
        groupId: data.communityGroupId._id,
        id: id,
      }
      joinGroup(payload)
    }
  }

  const handleChangeGroupStatus = (status: string, notificationId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    switch (data.type) {
      case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
        changeGroupStatus({
          status,
          notificationId,
          communityGroupId: data?.communityGroupId?._id,
          adminId: data?.receiverId,
          userId: data?.sender_id?._id,
        })
        break

      case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
        handleJoinCommunityRequest({
          status,
          notificationId,
          userId: data?.sender_id?._id,
          adminId: data?.receiverId,
          communityGroupId: data?.communityGroupId?._id,
        })
        break

      default:
        break
    }
  }

  if (!data) return null

  switch (data.type) {
    case notificationRoleAccess.GROUP_INVITE: {
      if (data?.status === notificationStatus.default) {
        return (
          <Buttons onClick={handleAcceptInvite(data._id)} className="w-max" variant="shade" size="medium">
            Accept Request
          </Buttons>
        )
      } else if (data?.status === notificationStatus.accepted) {
        return <p className="text-xs text-success-500">You have accepted the invite.</p>
      } else if (data?.status === notificationStatus.rejected) {
        return <p className="text-xs text-destructive-600">You have rejected the invite.</p>
      } else {
        return null
      }
    }

    case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
    case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
      if (data.status === notificationStatus.accepted) {
        return <p className="text-xs text-success-500">You have accepted the request.</p>
      } else if (data.status === notificationStatus.rejected) {
        return <p className="text-xs text-destructive-600">You have rejected the request.</p>
      } else {
        return (
          <div className="flex items-center gap-4">
            <Buttons onClick={handleChangeGroupStatus('accepted', data._id)} className="w-max font-inter" variant="shade" size="medium">
              Accept Request
            </Buttons>
            <Buttons onClick={handleChangeGroupStatus('rejected', data._id)} className="w-max font-inter" variant="notificationDanger" size="medium">
              Reject Request
            </Buttons>
          </div>
        )
      }

    default:
      return null
  }
}
