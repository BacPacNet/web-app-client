import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import useCookie from '@/hooks/useCookie'

export async function getUserNotification(token: any) {
  const response = await client(`/notification/`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function JoinCommunityGroup(data: any, token: any) {
  const response = await client(`/notification/join/`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export async function UpdateCommunityGroup(data: any, token: any) {
  const response = await client(`/notification`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export function useGetNotification() {
  const [cookieValue] = useCookie('uni_user_token')
  //   console.log('tt', !!cookieValue)

  const { isLoading, data, error } = useQuery({
    queryKey: ['notification'],
    queryFn: () => getUserNotification(cookieValue),
    enabled: !!cookieValue,
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, error: errorMessage }
}

export const useJoinCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => JoinCommunityGroup(data, cookieValue),

    onSuccess: (response: any) => {
      console.log(response)
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
    mutationFn: (data: any) => UpdateCommunityGroup(data, cookieValue),

    onSuccess: (response: any) => {
      console.log(response)
      queryClient.invalidateQueries({ queryKey: ['notification'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
