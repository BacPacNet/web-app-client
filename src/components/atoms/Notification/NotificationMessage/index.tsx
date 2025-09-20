import { notificationRoleAccess } from '@/components/organisms/NotificationTabs/NotificationTab'
import { notificationStatus } from '@/services/notification'
import { useRouter } from 'next/navigation'

type NotificationMessageProps = {
  data: any
}

export const NotificationMessage = ({ data }: NotificationMessageProps) => {
  const router = useRouter()
  const fullName = `${data?.sender_id?.firstName || ''} ${data?.sender_id?.lastName || ''}`.trim()

  switch (data.type) {
    case notificationRoleAccess.FOLLOW:
      return (
        <span className="text-xs font-inter">
          <b>{fullName}</b> started following you.
        </span>
      )

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

      if (data?.userPost?.totalComments > 1) {
        return (
          <span className="text-xs font-inter">
            <b>{firstCommenterName}</b> and {data?.userPost?.totalComments - 1} others commented on your post
          </span>
        )
      } else {
        return (
          <span className="text-xs font-inter">
            <b>{firstCommenterName}</b> commented on your post.
          </span>
        )
      }
    }

    case notificationRoleAccess.REPLIED_TO_COMMENT: {
      const firstCommenterName = data?.repliedBy?.newFiveUsers?.length ? data.repliedBy.newFiveUsers[0]?.name || 'Someone' : 'Someone'

      if (data?.parentCommentReplies[0]?.totalReplies > 1) {
        return (
          <span className="text-xs font-inter">
            <b>{firstCommenterName}</b> and {data?.parentCommentReplies[0]?.totalReplies - 1} others replied to your comment
          </span>
        )
      } else {
        return (
          <span className="text-xs font-inter">
            <b>{firstCommenterName}</b> replied to your comment.
          </span>
        )
      }
    }

    case notificationRoleAccess.COMMUNITY_COMMENT: {
      const firstCommenterName = data?.commentedBy?.newFiveUsers?.length ? data.commentedBy.newFiveUsers[0]?.name || 'Someone' : 'Someone'
      if (data?.communityPost?.totalComments > 1) {
        return (
          <span className="text-xs font-inter">
            <b>{firstCommenterName}</b> and {data?.communityPost?.totalComments - 1} others commented on your community post
          </span>
        )
      } else {
        return (
          <span className="text-xs font-inter">
            <b>{firstCommenterName}</b> {data?.message}
          </span>
        )
      }
    }

    case notificationRoleAccess.REPLIED_TO_COMMUNITY_COMMENT: {
      const firstCommenterName = data?.repliedBy?.newFiveUsers?.length ? data.repliedBy.newFiveUsers[0]?.name || 'Someone' : 'Someone'

      if (data?.communityParentCommentReplies[0]?.totalReplies > 1) {
        return (
          <span className="text-xs font-inter">
            <b>{firstCommenterName}</b> and {data?.communityParentCommentReplies[0]?.totalReplies - 1} others replied to your comment
          </span>
        )
      } else {
        return (
          <span className="text-xs font-inter">
            <b>{firstCommenterName}</b> replied to your comment.
          </span>
        )
      }
    }

    case notificationRoleAccess.REACTED_TO_POST: {
      const firstLikerName = data?.likedBy?.newFiveUsers?.length ? data.likedBy.newFiveUsers[0]?.name || 'Someone' : 'Someone'

      if (data?.userPost?.likeCount > 1) {
        return (
          <span className="text-xs font-inter">
            <b>{firstLikerName}</b> and <b>{data?.userPost?.likeCount - 1} others</b> liked your post
          </span>
        )
      } else {
        return (
          <span className="text-xs font-inter">
            <b>{firstLikerName}</b> liked your post.
          </span>
        )
      }
    }

    case notificationRoleAccess.REACTED_TO_COMMUNITY_POST: {
      const firstLikerName = data?.likedBy?.newFiveUsers?.length ? data.likedBy.newFiveUsers[0]?.name || 'Someone' : 'Someone'

      if (data?.communityPost?.likeCount > 1) {
        return (
          <span className="text-xs font-inter">
            <b>{firstLikerName}</b> and <b>{data?.communityPost?.likeCount - 1} others</b> liked your community post
          </span>
        )
      } else {
        return (
          <span className="text-xs font-inter">
            <b>{firstLikerName}</b> liked your community post.
          </span>
        )
      }
    }

    case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
      return (
        <span className="text-xs font-inter">
          <b>{data?.message}</b> has sent a request to become an official group.
          {data?.status == notificationStatus.default && (
            <span className="text-neutral-500 mt-2 font-inter text-2xs">
              <br />
              You will be automatically added to the group if you accept.
            </span>
          )}
        </span>
      )
    case notificationRoleAccess.community_post_live_request_notification:
      return (
        <span className="text-xs font-inter">
          You have a pending post request in <b>{data?.communityGroupId?.title}</b> at {data?.communityDetails?.name}.
        </span>
      )
    case notificationRoleAccess.community_post_accepted_notification:
      return (
        <span className="text-xs font-inter">
          Your post in <b>{data?.communityGroupId?.title}</b> at {data?.communityDetails?.name} has been approved.
          <span className="text-[#15803D] mt-2 font-inter text-2xs">
            <br />
            Your post is now visible to other members in the group.
          </span>
        </span>
      )
    case notificationRoleAccess.community_post_rejected_notification:
      return (
        <span className="text-xs font-inter">
          Your post in <b>{data?.communityGroupId?.title}</b> at {data?.communityDetails?.name} has been rejected.
          <span className="text-[#EF4444] mt-2 font-inter text-2xs">
            <br />
            The post has been rejected by the group admin. It will not be visible to other members.
          </span>
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
          {data?.message}{' '}
          <span className="text-[#EF4444] mt-2 font-inter text-2xs">
            <br />
            Your group has been deleted.
          </span>
        </span>
      )
    case notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST:
      return (
        <span className="text-xs font-inter">
          {data?.message}{' '}
          <span className="text-[#15803D] mt-2 font-inter text-2xs">
            <br />
            Your group is now visible to other members in the community.
          </span>
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
    case notificationRoleAccess.DELETED_COMMUNITY_GROUP:
      return <span className="text-xs font-inter">{data.message}.</span>

    default:
      return <span className="text-xs font-inter">You have a new notification.</span>
  }
}
