import useCookie from '@/hooks/useCookie'
import { client } from './api-Client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export async function getUserSubscribedCommunityGroups(token: any) {
  const response: any = await client(`/community`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetUserSubscribedCommunityGroups() {
  const [cookieValue] = useCookie('uni_user_token')
  const { isLoading, data, error } = useQuery({
    queryKey: ['UserSubscribedCommunityGroups'],
    queryFn: () => getUserSubscribedCommunityGroups(cookieValue),
    enabled: true,
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, error: errorMessage }
}
