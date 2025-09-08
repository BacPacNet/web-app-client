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
    commentedBy: CommentedBy
  }

  notificationType: string
  handleRedirectPostComment: (value: any) => void
  handleRedirectCommunityComment: (value: any) => void
}

const NotificationAvatars = ({ data, notificationType, handleRedirectPostComment, handleRedirectCommunityComment }: Props) => {
  const handlePostRedirect = (e: React.MouseEvent, user: any) => {
    e.stopPropagation()
    handleRedirectPostComment(user)
  }
  const handleCommunityPostRedirect = (e: React.MouseEvent, user: any) => {
    e.stopPropagation()
    handleRedirectCommunityComment(user)
  }
  const renderUsers = (users: any[] = []) =>
    users?.map((user, index) => (
      <Image
        key={user?.id || user?.profileDp || index}
        width={48}
        height={48}
        src={user?.profileDp || dummy.src}
        alt="dp"
        className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover border-2 border-white -ml-2 ${index === 0 ? 'ml-0' : ''}`}
        style={{ zIndex: index + 1 }}
        onClick={(e) => handlePostRedirect(e, user)}
      />
    ))
  const renderCommunityUsers = (users: any[] = []) =>
    users?.map((user, index) => (
      <Image
        key={user?.id || user?.profileDp || index}
        width={48}
        height={48}
        src={user?.profileDp || dummy.src}
        alt="dp"
        className={`w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover border-2 border-white -ml-2 ${index === 0 ? 'ml-0' : ''}`}
        style={{ zIndex: index + 1 }}
        onClick={(e) => handleCommunityPostRedirect(e, user)}
      />
    ))

  const renderContent = () => {
    if (notificationType == notificationRoleAccess.REACTED_TO_POST || notificationType == notificationRoleAccess.REACTED_TO_COMMUNITY_POST) {
      return renderUsers(data?.likedBy?.newFiveUsers)
    } else if (notificationType == notificationRoleAccess.COMMENT) {
      return renderUsers(data?.commentedBy?.newFiveUsers)
    } else if (notificationType == notificationRoleAccess.COMMUNITY_COMMENT) {
      return renderCommunityUsers(data?.commentedBy?.newFiveUsers)
    } else if (
      notificationType == notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST ||
      notificationType == notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST ||
      notificationType == notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST ||
      notificationType == notificationRoleAccess.OFFICIAL_GROUP_REQUEST ||
      notificationType == notificationRoleAccess.community_post_live_request_notification
    ) {
      return (
        <Image
          width={48}
          height={48}
          src={data?.communityGroupId?.communityGroupLogoUrl || dummy.src}
          alt="dp"
          className="w-10 sm:w-10 h-10 sm:h-10 rounded-full object-cover"
        />
      )
    } else {
      return (
        <Image
          width={48}
          height={48}
          src={data?.sender_id?.profileDp || dummy.src}
          alt="dp"
          className="w-10 sm:w-10 h-10 sm:h-10  rounded-full object-cover"
        />
      )
    }
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center ">
        <div className="mr-4">
          <NotificationIcon type={data?.type} />
        </div>
        {renderContent()}
      </div>
    </div>
  )
}

export default NotificationAvatars
