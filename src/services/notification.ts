import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import useCookie from '@/hooks/useCookie'
import { useUniStore } from '@/store/store'
import { notificationInterface } from '@/types/constants'

export async function getUserNotification(token: string) {
  const response: notificationInterface[] = await client(`/notification/`, { headers: { Authorization: `Bearer ${token}` } })
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

export function useGetNotification() {
  let finalCookie: any = null

  if (typeof document !== 'undefined') {
    const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('uni_user_token='))
    finalCookie = cookieValue ? cookieValue.split('=')[1] : null
  }

  const state = useQuery({
    queryKey: ['notification'],
    queryFn: () => getUserNotification(finalCookie),
    enabled: !!finalCookie,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export const useJoinCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const { setUserData } = useUniStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { groupId: string; id: string }) => JoinCommunityGroup(data, cookieValue),

    onSuccess: (response: any) => {
      setUserData(response.user)
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
