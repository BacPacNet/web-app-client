import useCookie from '@/hooks/useCookie'
import { useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'

export async function getUserProfileData(token: any) {
  const response: any = await client(`/userprofile/me`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetUserProfileData() {
  const [cookieValue] = useCookie('uni_user_token')

  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['getRefetchUserProfileData'],
    queryFn: () => getUserProfileData(cookieValue),
    enabled: !!cookieValue,
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, error: errorMessage, refetch }
}
