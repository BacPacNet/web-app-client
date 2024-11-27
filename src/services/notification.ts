import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'

import useCookie from '@/hooks/useCookie'
import { useUniStore } from '@/store/store'
import { MessageNotification } from '@/components/molecules/MessageNotification'

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
  type: string
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

export async function getUserNotification(token: string, page: number, limit: number) {
  const response: NotificationsProps = await client(`/notification?page=${page}&limit=${limit}`, {
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

export const useJoinCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const { setUserData } = useUniStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { groupId: string; id: string }) => JoinCommunityGroup(data, cookieValue),

    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['notification'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useUpdateIsSeenCommunityGroupNotification = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { id: string }) => UpdateCommunityGroup(data, cookieValue),

    onSuccess: (response: any) => {
      console.log(response)
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
