import { NavLink } from './global'

export const CommunityNavbarLinks: NavLink[] = [
  { label: 'Timeline', href: '/timeline' },
  { label: 'Profile', href: '/:id' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Messages', href: '/messages' },
  { label: 'Connections', href: '/community/:id/connections' },
  { label: 'University Community', href: '/community' },
  { label: 'Chatbot', href: '/chatbot' },
]

export interface FollowingItemProps {
  users_id: {
    firstName: string
    lastName: string
    id: string
  }

  university: string
  study_year: string
  degree: string
  major: string
  occupation: string
  profile_dp: {
    imageUrl: string
  }
  type: string
  userFollowingIDs: string[]
}

export interface FindUsers {
  firstName: string
  lastName: string
  _id: string
  profile: {
    university: string
    study_year: string
    degree: string
    major: string
    occupation: string
    profile_dp: {
      imageUrl: string
    }
  }

  type: string
  userFollowingIDs: string[]
}

export interface notificationInterface {
  _id: string
  sender_id: {
    firstName: string
  }
  receiverId: string
  communityGroupId: {
    _id: string
    title: string
  }
  communityPostId: {
    _id: string
  }
  userPostId: {
    _id: string
    title: string
  }
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export enum PostInputType {
  Community = 'Community',
  Timeline = 'Timeline',
}
