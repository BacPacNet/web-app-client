import useCookie from '@/hooks/useCookie'
import { client } from './api-Client'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { Community } from '@/types/Community'

export async function getUserSubscribedCommunities(token: any) {
  const response = await client(`/community`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetSubscribedCommunties() {
  const [cookieValue] = useCookie('uni_user_token')
  return useQuery({
    queryKey: ['useGetSubscribedCommunties'],
    queryFn: () => getUserSubscribedCommunities(cookieValue),
    enabled: !!cookieValue,
  }) as UseQueryResult<Community[]>
}
