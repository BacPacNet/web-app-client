import { FaUserPlus, FaUsers } from 'react-icons/fa'
import { IoIosChatboxes } from 'react-icons/io'

import { notificationRoleAccess } from '@/components/organisms/NotificationTabs/NotificationTab'
import { BiSolidLike } from 'react-icons/bi'
type NotificationIconProps = {
  type: string
}

export const NotificationIcon = ({ type }: NotificationIconProps) => {
  switch (type) {
    case notificationRoleAccess.FOLLOW:
      return <FaUserPlus size={36} color="#9685FF" />
    case notificationRoleAccess.GROUP_INVITE:
    case notificationRoleAccess.PRIVATE_GROUP_REQUEST:
    case notificationRoleAccess.OFFICIAL_GROUP_REQUEST:
    case notificationRoleAccess.REJECTED_OFFICIAL_GROUP_REQUEST:
    case notificationRoleAccess.ACCEPTED_OFFICIAL_GROUP_REQUEST:
    case notificationRoleAccess.ACCEPTED_PRIVATE_GROUP_REQUEST:
    case notificationRoleAccess.REJECTED_PRIVATE_GROUP_REQUEST:
      return <FaUsers size={36} color="#9685FF" />
    case notificationRoleAccess.COMMENT:
    case notificationRoleAccess.COMMUNITY_COMMENT:
      return <IoIosChatboxes size={36} color="#9685FF" />
    case notificationRoleAccess.REACTED_TO_POST:
    case notificationRoleAccess.REACTED_TO_COMMUNITY_POST:
      return <BiSolidLike size={36} color="#9685FF" />
    default:
      return null
  }
}
