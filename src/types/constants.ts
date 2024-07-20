import { NavLink } from './global'
import { AxiosError } from 'axios'

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

export enum PostType {
  Community = 'Community',
  Timeline = 'Timeline',
}

export interface PostInputData {
  content: string
  imageUrl?: Array<{
    imageUrl: string
    publicId: string
  }>
}

export interface UserPostData extends PostInputData {}

export interface CommunityPostData extends PostInputData {
  communityId?: string | number
}

export interface PostCommentData {
  postID: string | undefined
  content: string
  imageUrl?: {
    imageUrl: string
    publicId: string
  }
  adminId?: string | number
}

interface ErrorResponse {
  message: string
  // Add any other properties your API returns in errors
}

export type AxiosErrorType = AxiosError<ErrorResponse>
