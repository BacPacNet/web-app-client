import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'

import useCookie from '@/hooks/useCookie'
import { useUniStore } from '@/store/store'
import { MessageNotification } from '@/components/molecules/MessageNotification'
import { useRouter } from 'next/navigation'
import { notificationRoleAccess } from '@/components/organisms/NotificationTabs/NotificationTab'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'

type Notification = {
  _id: string
  sender_id: {
    _id: string
    firstName: string
    lastName: string
    profileDp?: string
  }
  receiverId: string
  communityGroupId?: string
  communityPostId?: string
  userPostId?: string
  message: string
  type: 'GROUP_INVITE' | 'FOLLOW'
  isRead: boolean
  createdAt: string
}

type NotificationsProps = {
  notifications: Notification[]
  currentPage: number
  totalPages: number
  totalNotifications: number
}

export type MessageNotificationsProps = {
  message: MessageNotification[]
  currentPage: number
  totalPages: number
  totalNotifications: number
}

export interface UserMainNotification {
  _id: string
  createdAt: string
  isRead: boolean
  message: string
  receiverId: string
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

type UserMainNotificationsProps = {
  notifications: UserMainNotification[]
  currentPage: number
  totalPages: number
  totalNotifications: number
}

export async function getUserNotification(token: string, page: number, limit: number) {
  const response: NotificationsProps = await client(`/notification?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}
export async function getUserMainNotification(token: string, page: number, limit: number) {
  const response: UserMainNotificationsProps = await client(`/notification/user?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}
export async function getMessageNotification(token: string, page: number, limit: number) {
  const response: MessageNotificationsProps = await client(`/chat/notification?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export async function JoinCommunityGroup(data: { groupId: string; id: string }, token: string) {
  const response = await client(`/notification/join/`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export async function UpdateCommunityGroup(data: { id: string }, token: string) {
  const response = await client(`/notification`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}
export async function UpdateIsRead(data: { id: string }, token: string) {
  const response = await client(`/notification`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export function useGetNotification(limit: number, toCall: boolean) {
  let finalCookie: any = null

  if (typeof document !== 'undefined') {
    const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('uni_user_token='))
    finalCookie = cookieValue ? cookieValue.split('=')[1] : null
  }

  return useInfiniteQuery({
    queryKey: ['notification'],
    queryFn: ({ pageParam = 1 }) => getUserNotification(finalCookie, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: !!finalCookie && toCall,
  })
}
export function useGetUserNotification(limit: number, toCall: boolean) {
  let finalCookie: any = null

  if (typeof document !== 'undefined') {
    const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('uni_user_token='))
    finalCookie = cookieValue ? cookieValue.split('=')[1] : null
  }

  return useInfiniteQuery({
    queryKey: ['user_notification'],
    queryFn: ({ pageParam = 1 }) => getUserMainNotification(finalCookie, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: !!finalCookie && toCall,
  })
}

export const useJoinCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: (data: { groupId: string; id: string }) => JoinCommunityGroup(data, cookieValue),

    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['user_notification'] })

      router.push(`/community/${response.communityId}/${response._id}`)
    },
    onError: (res: any) => {
      showCustomDangerToast(res.response.data.message)
    },
  })
}

export const useUpdateIsSeenCommunityGroupNotification = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: (data: { id: string }) => UpdateCommunityGroup(data, cookieValue),

    onSuccess: (response: any) => {
      if (response.notification.type == notificationRoleAccess.REACTED_TO_POST) {
        router.push(`/post/${response.notification.userPostId}?isType=Timeline`)
      }
      if (response.notification.type == notificationRoleAccess.REACTED_TO_COMMUNITY_POST) {
        router.push(`/post/${response.notification.communityPostId}?isType=Community`)
      }
      if (response.notification.type == notificationRoleAccess.COMMENT) {
        router.push(`/post/${response.notification.userPostId}?isType=Timeline`)
      }
      if (response.notification.type == notificationRoleAccess.COMMUNITY_COMMENT) {
        router.push(`/post/${response.notification.communityPostId}?isType=Community`)
      }
      if (response.notification.type == notificationRoleAccess.FOLLOW) {
        router.push(`/profile/${response.notification.sender_id}`)
      }
      queryClient.invalidateQueries({ queryKey: ['notification'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
export const useUpdateIsRead = (type: string = '') => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: (data: { id: string }) => UpdateIsRead(data, cookieValue),

    onSuccess: (response: any) => {
      if (type == notificationRoleAccess.REACTED_TO_POST) {
        router.push(`/post/${response.notification.userPostId}?isType=Timeline`)
      }
      if (type == notificationRoleAccess.REACTED_TO_COMMUNITY_POST) {
        router.push(`/post/${response.notification.communityPostId}?isType=Community`)
      }
      if (type == notificationRoleAccess.COMMENT) {
        router.push(`/post/${response.notification.userPostId}?isType=Timeline`)
      }
      if (type == notificationRoleAccess.COMMUNITY_COMMENT) {
        router.push(`/post/${response.notification.communityPostId}?isType=Community`)
      }
      if (response.notification.type == notificationRoleAccess.FOLLOW) {
        router.push(`/profile/${response.notification.sender_id}`)
      }

      queryClient.invalidateQueries({ queryKey: ['user_notification'] })
      queryClient.invalidateQueries({ queryKey: ['notification'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export function useGetMessageNotification(limit: number, toCall: boolean) {
  let finalCookie: any = null

  if (typeof document !== 'undefined') {
    const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('uni_user_token='))
    finalCookie = cookieValue ? cookieValue.split('=')[1] : null
  }

  return useInfiniteQuery({
    queryKey: ['message_notification'],
    queryFn: ({ pageParam = 1 }) => getMessageNotification(finalCookie, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: !!finalCookie && toCall,
  })
}
