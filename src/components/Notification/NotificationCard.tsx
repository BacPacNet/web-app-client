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
    commentedBy: likedBy
  }
}

const NotificationCard = ({ data }: Props) => {
  const { mutate: updateIsSeen } = useUpdateIsRead(data.type)

  const router = useRouter()

  const handleUpdateIsRead = (id: string) => {
    const dataToPush = {
      id: id,
    }
    if (data?.isRead) {
      switch (data.type) {
        case notificationRoleAccess.FOLLOW:
          return router.push(`/profile/${data.sender_id?._id}`)
        case notificationRoleAccess.COMMENT:
          return router.push(`/post/${data.userPostId}?isType=Timeline`)
        case notificationRoleAccess.COMMUNITY_COMMENT:
          return router.push(`/post/${data.communityPostId}?isType=Community`)
        // case notificationRoleAccess.GROUP_INVITE:
        //   return router.push(`/groups/${data.communityGroupId?._id}`)
        case notificationRoleAccess.REACTED_TO_POST:
          return router.push(`/post/${data.userPostId}?isType=Timeline`)
        case notificationRoleAccess.REACTED_TO_COMMUNITY_POST:
          return router.push(`/post/${data.communityPostId}?isType=Community`)
        case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
          return
        default:
          break
      }
    }

    return updateIsSeen(dataToPush)
  }

  return (
    <div
      onClick={() => handleUpdateIsRead(data?._id)}
      className={`flex flex-col gap-2  border-b-2 border-neutral-200 px-6 py-4 hover:bg-surface-primary-50  transition-all duration-200 cursor-pointer ${
        data?.isRead ? 'bg-neutral-50' : ''
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center  ">
          <NotificationAvatars data={data} notificationType={data?.type} />
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
