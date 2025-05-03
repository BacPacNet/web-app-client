import { notificationRoleAccess } from '@/components/organisms/NotificationTabs/NotificationTab'
import { useRouter } from 'next/navigation'

type NotificationMessageProps = {
  data: any
}

export const NotificationMessage = ({ data }: NotificationMessageProps) => {
  const router = useRouter()
  const fullName = `${data?.sender_id?.firstName || ''} ${data?.sender_id?.lastName || ''}`.trim()

  switch (data.type) {
    case notificationRoleAccess.FOLLOW:
      return <span className="text-xs font-inter">{fullName} started following you.</span>

    case notificationRoleAccess.GROUP_INVITE:
      return (
        <>
          <p className="text-xs">
            You have been invited to join{' '}
            <span
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/community/${data.communityGroupId?.communityId}/${data.communityGroupId?._id}`)
              }}
              className="font-semibold hover:underline cursor-pointer font-inter"
            >
              {data?.communityGroupId?.title}
            </span>{' '}
            in {data?.communityDetails?.name}.
          </p>
        </>
      )

    case notificationRoleAccess.COMMENT: {
      const firstCommenterName = data?.commentedBy?.newFiveUsers?.length ? data.commentedBy.newFiveUsers[0]?.name || 'Someone' : 'Someone'

      if (data?.commentedBy?.totalCount > 1) {
        return (
          <span className="text-xs font-inter">
            <b>{firstCommenterName}</b> and {data?.commentedBy?.totalCount - 1} others commented on your post
          </span>
        )
      } else {
        return <span className="text-xs font-inter">{firstCommenterName} commented on your post.</span>
      }
    }

    case notificationRoleAccess.COMMUNITY_COMMENT:
      return (
        <span className="text-xs font-inter">
          {fullName} commented in the community {data?.communityDetails?.name || ''}.
        </span>
      )

    case notificationRoleAccess.REACTED_TO_POST: {
      const firstLikerName = data?.likedBy?.newFiveUsers?.length ? data.likedBy.newFiveUsers[0]?.name || 'Someone' : 'Someone'

      if (data?.likedBy?.totalCount > 1) {
        return (
          <span className="text-xs font-inter">
            <b>{firstLikerName}</b> and <b>{data?.likedBy?.totalCount - 1} others</b> liked your post
          </span>
        )
      } else {
        return <span className="text-xs font-inter">{firstLikerName} liked your post.</span>
      }
    }

    case notificationRoleAccess.REACTED_TO_COMMUNITY_POST:
      return (
        <span className="text-xs font-inter">
          {fullName} reacted to a post in {data?.communityDetails?.name || 'the community'}.
        </span>
      )

    case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
      return (
        <span className="text-xs font-inter">
          <b>{data?.communityGroupId?.title}</b> in {data?.communityDetails?.name} has sent a request to become an official group.
        </span>
      )

    case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
      return (
        <span className="text-xs font-inter">
          <b>{fullName}</b> has sent a request to join <b>{data?.communityGroupId?.title}</b> in {data?.communityDetails?.name}
        </span>
      )
    case notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST:
      return (
        <span className="text-xs font-inter">
          Your request to make <b>{data?.communityGroupId?.title}</b> in {data?.communityDetails?.name} official has been rejected.
        </span>
      )
    case notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST:
      return (
        <span className="text-xs font-inter">
          Your request to make <b>{data?.communityGroupId?.title}</b> in {data?.communityDetails?.name} official has been accepted.
        </span>
      )

    case notificationRoleAccess.REJECTED_PRIVATE_GROUP_REQUEST:
      return (
        <span className="text-xs font-inter">
          Your request to join <b>{data?.communityGroupId?.title}</b> in {data?.communityDetails?.name} has been rejected.
          {/* <b>{fullName}</b> has sent a request to join <b>{data?.communityGroupId?.title}</b> in {data?.communityDetails?.name} */}
        </span>
      )
    case notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST:
      return (
        <span className="text-xs font-inter">
          Your request to join <b>{data?.communityGroupId?.title}</b> in {data?.communityDetails?.name} has been accepted.
        </span>
      )

    default:
      return <span className="text-xs font-inter">You have a new notification.</span>
  }
}
