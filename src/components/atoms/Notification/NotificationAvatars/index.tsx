import Image from 'next/image'
import dummy from '@/assets/avatar.png'
import { NotificationIcon } from '../NotificationIcon'
import { notificationRoleAccess } from '@/components/organisms/NotificationTabs/NotificationTab'

interface User {
  id?: string
  profileDp?: string
}

interface LikedBy {
  totalCount: number
  newFiveUsers: User[]
}

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
    likedBy: LikedBy
    commentedBy: LikedBy
  }

  notificationType: string
}

const NotificationAvatars = ({ data, notificationType }: Props) => {
  const renderUsers = (users: User[] = []) =>
    users?.map((user, index) => (
      <Image
        key={user?.id || user?.profileDp || index}
        width={48}
        height={48}
        src={user?.profileDp || dummy.src}
        alt="dp"
        className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover border-2 border-white -ml-2 ${index === 0 ? 'ml-0' : ''}`}
        style={{ zIndex: index + 1 }}
      />
    ))

  const renderContent = () => {
    if (notificationType == notificationRoleAccess.REACTED_TO_POST) {
      return renderUsers(data?.likedBy?.newFiveUsers)
    } else if (notificationType == notificationRoleAccess.COMMENT) {
      return renderUsers(data?.commentedBy?.newFiveUsers)
    } else if (
      notificationType == notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST ||
      notificationType == notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST ||
      notificationType == notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST ||
      notificationType == notificationRoleAccess.OFFICIAL_GROUP_REQUEST
    ) {
      return (
        <Image
          width={48}
          height={48}
          src={data?.communityGroupId?.communityGroupLogoUrl || dummy.src}
          alt="dp"
          className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
        />
      )
    } else {
      return (
        <Image
          width={48}
          height={48}
          src={data?.sender_id?.profileDp || dummy.src}
          alt="dp"
          className="w-10 sm:w-12 h-10 sm:h-12  rounded-full object-cover"
        />
      )
    }
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center ">
        <div className="mr-2">
          <NotificationIcon type={data?.type} />
        </div>
        {renderContent()}
      </div>
    </div>
  )
}

export default NotificationAvatars
