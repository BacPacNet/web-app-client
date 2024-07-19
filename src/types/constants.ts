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
