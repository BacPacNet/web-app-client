import useCookie from '@/hooks/useCookie'
import { useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'

export async function getUserProfileData(token: any) {
  const response: any = await client(`/userprofile/me`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetUserProfileData(type: string) {
  const [cookieValue] = useCookie('uni_user_token')

  const state = useQuery({
    queryKey: ['getRefetchUserProfileData'],
    queryFn: () => getUserProfileData(cookieValue),
    enabled: !!cookieValue && type !== '',
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}
