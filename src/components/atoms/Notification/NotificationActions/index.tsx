'use client'

import { notificationRoleAccess } from '@/components/organisms/NotificationTabs/NotificationTab'
import { notificationStatus } from '@/services/notification'
import { useChangeCommunityGroupStatus, useJoinRequestPrivateGroup } from '@/services/community-group'
import { useJoinCommunityGroup } from '@/services/notification'
import Buttons from '../../Buttons'
import GenericInfoModal from '@/components/molecules/VerifyUniversityToJoinModal/VerifyUniversityToJoinModal'
import { showCustomDangerToast } from '../../CustomToasts/CustomToasts'
import { useModal } from '@/context/ModalContext'
import { verifyUniversityEmailMessage } from '@/types/constants'

type NotificationActionsProps = {
  data: any
}

export const NotificationActions = ({ data }: NotificationActionsProps) => {
  const { mutateAsync: joinGroup } = useJoinCommunityGroup()
  const { mutate: changeGroupStatus } = useChangeCommunityGroupStatus(data?.communityGroupId?._id || '')
  const { mutate: handleJoinCommunityRequest } = useJoinRequestPrivateGroup(data?.communityGroupId?._id || '')
  const { openModal } = useModal()
  const handleAcceptInvite = (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!data?.communityGroupId?._id) return

    if (data.type === notificationRoleAccess.GROUP_INVITE) {
      const payload = {
        isAccepted: true,
        groupId: data.communityGroupId._id,
        id: id,
      }
      joinGroup(payload, {
        onError: (error: any) => {
          if (error.response.data.message == verifyUniversityEmailMessage) {
            openModal(
              <GenericInfoModal
                buttonLabel="Verify Student Email"
                redirectUrl="/setting/university-verification"
                title="Verify Account to Join "
                description="Access to private groups is limited to verified users. Please complete verification to continue."
              />,
              'w-[350px] sm:w-[490px] hideScrollbar'
            )
          }
        },
      })
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
          text:
            status == notificationStatus.accepted
              ? `Congratulations! ${data?.communityGroupId?.title} is now officially recognized by ${data?.communityDetails?.name}.`
              : `Your request to create ${data?.communityGroupId?.title} as an official group at ${data?.communityDetails?.name} was not approved.`,
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
          <Buttons onClick={handleAcceptInvite(data._id)} className="w-max" variant="border_primary" size="medium">
            Accept Request
          </Buttons>
        )
      } else if (data?.status === notificationStatus.accepted) {
        return <p className="text-2xs text-success-500">You have accepted the invite.</p>
      } else if (data?.status === notificationStatus.rejected) {
        return <p className="text-2xs text-destructive-600">You have rejected the invite.</p>
      } else {
        return null
      }
    }

    case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
    case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
      if (data.status === notificationStatus.accepted) {
        return <p className="text-2xs text-success-500">You have accepted the request.</p>
      } else if (data.status === notificationStatus.rejected) {
        return <p className="text-2xs text-destructive-600">You have rejected the request.</p>
      } else {
        return (
          <div className="flex items-center gap-4">
            <Buttons onClick={handleChangeGroupStatus('accepted', data._id)} className="w-max font-inter" variant="border_primary" size="medium">
              Accept Request
            </Buttons>
            <Buttons onClick={handleChangeGroupStatus('rejected', data._id)} className="w-max font-inter" variant="border_danger" size="medium">
              Reject Request
            </Buttons>
          </div>
        )
      }

    default:
      return null
  }
}
