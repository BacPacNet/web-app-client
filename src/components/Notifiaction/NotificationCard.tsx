import dummy from '@/assets/avatar.png'
import Image from 'next/image'
import { FaUserPlus, FaUsers } from 'react-icons/fa6'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useJoinCommunityGroup, useUpdateIsRead } from '@/services/notification'
import { useRouter } from 'next/navigation'
import { notificationRoleAccess } from '../organisms/NotificationTabs/NotificationTab'
import { BsStars } from 'react-icons/bs'
import { IoIosChatboxes } from 'react-icons/io'
import Buttons from '../atoms/Buttons'
dayjs.extend(relativeTime)

type Props = {
  data: {
    _id: string
    createdAt: string
    isRead: boolean
    message: string
    receiverId: string
    userPostId?: string
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
  }
}

const NotificationCard = ({ data }: Props) => {
  const { mutate: updateIsSeen } = useUpdateIsRead(data.type)
  const { mutate: joinGroup } = useJoinCommunityGroup()
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
        default:
          break
      }
    }

    return updateIsSeen(dataToPush)
  }

  const handleAcceptInvite = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (data.type == notificationRoleAccess.GROUP_INVITE) {
      if (!data?.communityGroupId?._id || !id) return

      const dataToPush = {
        groupId: data?.communityGroupId?._id,
        id: id,
      }
      return joinGroup(dataToPush)
    }
  }

  const renderIcon = () => {
    switch (data.type) {
      case notificationRoleAccess.FOLLOW:
        return <FaUserPlus size={24} color="#9685FF" />
      case notificationRoleAccess.GROUP_INVITE:
        return <FaUsers size={24} color="#9685FF" />
      case notificationRoleAccess.COMMENT:
        return <IoIosChatboxes size={24} color="#9685FF" />
      case notificationRoleAccess.COMMUNITY_COMMENT:
        return <IoIosChatboxes size={24} color="#9685FF" />
      case notificationRoleAccess.REACTED_TO_POST:
        return <BsStars size={24} color="#9685FF" />
      case notificationRoleAccess.REACTED_TO_COMMUNITY_POST:
        return <BsStars size={24} color="#9685FF" />
      default:
        return null
    }
  }

  const renderMessage = () => {
    const fullName = `${data?.sender_id?.firstName || ''} ${data?.sender_id?.lastName || ''}`.trim()
    switch (data.type) {
      case notificationRoleAccess.FOLLOW:
        return `${fullName} started following you.`
      case notificationRoleAccess.GROUP_INVITE:
        return (
          <>
            You have been invited to join {data?.communityDetails?.name + '’s'}{' '}
            <span
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/community/${data.communityGroupId?.communityId}/${data.communityGroupId?._id}`)
              }}
              className="font-semibold hover:underline cursor-pointer"
            >
              {data?.communityGroupId?.title}
            </span>
            .
          </>
        )
      case notificationRoleAccess.COMMENT:
        return `${fullName} commented on your post: "${data?.message || ''}".`
      case notificationRoleAccess.COMMUNITY_COMMENT:
        return `${fullName} commented in the community ${data?.communityDetails?.name || ''}.`
      case notificationRoleAccess.REACTED_TO_POST:
        return `${fullName} reacted to your post.`
      case notificationRoleAccess.REACTED_TO_COMMUNITY_POST:
        return `${fullName} reacted to a post in ${data?.communityDetails?.name || 'the community'}.`
      default:
        return 'You have a new notification.'
    }
  }

  return (
    <div
      onClick={() => handleUpdateIsRead(data?._id)}
      className={`flex flex-col gap-2  border-b-2 border-neutral-300 p-4 hover:bg-neutral-200  transition-all duration-200 cursor-pointer`}
    >
      <div className="flex justify-between ">
        <div className="flex gap-4 items-center  ">
          <Image
            width={48}
            height={48}
            src={data?.communityGroupId?.communityGroupLogoUrl || data?.sender_id?.profileDp || dummy.src}
            alt="dp"
            objectFit="cover"
            className="w-12 h-12 rounded-full"
          />

          {renderIcon()}
        </div>
        <p>{dayjs(new Date(data?.createdAt).toString()).fromNow()}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm">{renderMessage()}</p>
        {data.type == notificationRoleAccess.GROUP_INVITE && (
          <Buttons onClick={(e) => handleAcceptInvite(data?._id, e)} className="w-max" variant="border_primary" size="extra_small">
            Accept
          </Buttons>
        )}
      </div>
    </div>
  )
}

export default NotificationCard
