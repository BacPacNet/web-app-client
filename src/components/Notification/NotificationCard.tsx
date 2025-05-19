import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { notificationStatus, useUpdateIsRead } from '@/services/notification'
import { useRouter } from 'next/navigation'
import { notificationRoleAccess } from '../organisms/NotificationTabs/NotificationTab'
import 'dayjs/locale/en'
import { NotificationMessage } from '../atoms/Notification/NotificationMessage'
import { NotificationActions } from '../atoms/Notification/NotificationActions'
import NotificationAvatars from '../atoms/Notification/NotificationAvatars'
dayjs.extend(relativeTime)

dayjs.locale('en-short', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: '1s',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
})

interface likedBy {
  totalCount: number
  newFiveUsers: any[]
}

interface CommentedUser {
  _id: string
  communityPostCommentId?: string
  postCommentId?: string
}

interface CommentedBy {
  totalCount: number
  newFiveUsers: CommentedUser[]
}

type Props = {
  data: {
    _id: string
    createdAt: string
    isRead: boolean
    message: string
    receiverId: string
    userPostId?: string
    status: notificationStatus
    sender_id: {
      _id: string
      firstName: string
      lastName: string
      profileDp?: string
    }
    communityGroupId?: {
      _id: string
      title: string
      communityId: string
      communityGroupLogoUrl: string
    }
    communityDetails?: {
      name: string
    }
    communityPostId?: {
      _id?: string
    }
    type: string
    likedBy: likedBy
    commentedBy: CommentedBy
  }
}

const NotificationCard = ({ data }: Props) => {
  const { mutateAsync: updateIsSeen } = useUpdateIsRead(data.type)

  const router = useRouter()

  const handleUpdateIsRead = async (e: any, id: string) => {
    e.stopPropagation()

    const dataToPush = { id }

    if (!data?.isRead) {
      await updateIsSeen(dataToPush)
    }

    switch (data?.type) {
      case notificationRoleAccess.FOLLOW:
        return router.push(`/profile/${data.sender_id?._id}`)
      case notificationRoleAccess.COMMENT:
        return router.push(`/post/${data.userPostId}?isType=Timeline&commentId=${data?.commentedBy.newFiveUsers[0].postCommentId}`)
      case notificationRoleAccess.COMMUNITY_COMMENT:
        return router.push(`/post/${data.communityPostId}?isType=Community&commentId=${data?.commentedBy.newFiveUsers[0].communityPostCommentId}`)
      case notificationRoleAccess.REACTED_TO_POST:
        return router.push(`/post/${data.userPostId}?isType=Timeline`)
      case notificationRoleAccess.REACTED_TO_COMMUNITY_POST:
        return router.push(`/post/${data.communityPostId}?isType=Community`)
      case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
      case notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST:
      case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.GROUP_INVITE:
      case notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST:
      case notificationRoleAccess.REJECTED_PRIVATE_GROUP_REQUEST:
        return router.push(`/community/${data.communityGroupId?.communityId}/${data.communityGroupId?._id}`)
      default:
        break
    }
  }

  const handleRedirectCommunityComment = (user: any) => {
    return router.push(`/post/${data.communityPostId}?isType=Community&commentId=${user?.communityPostCommentId}`)
  }

  const handleRedirectPostComment = (user: any) => {
    return router.push(`/post/${data.userPostId}?isType=Timeline&commentId=${user?.postCommentId}`)
  }

  return (
    <div
      onClick={(e) => handleUpdateIsRead(e, data?._id)}
      className={`flex flex-col gap-2  border-b-2 border-neutral-200 mx-1 px-6 py-4 hover:bg-neutral-100 bg-neutral-100  transition-all duration-200 cursor-pointer ${
        data?.isRead ? 'bg-white' : 'bg-surface-primary-50'
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center  ">
          <NotificationAvatars
            handleRedirectCommunityComment={handleRedirectCommunityComment}
            handleRedirectPostComment={handleRedirectPostComment}
            data={data}
            notificationType={data?.type}
          />
        </div>

        <p className="text-2xs text-neutral-500  ">
          {dayjs(data?.createdAt)
            .locale('en-short')
            .fromNow()}
        </p>
      </div>
      <div className="flex flex-col gap-4 ">
        <NotificationMessage data={data} />
        <NotificationActions data={data} />
      </div>
    </div>
  )
}

export default NotificationCard
