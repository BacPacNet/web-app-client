import { userProfileType } from '@/store/userProfileSlice/userProfileType'
import { useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import useCookie from '@/hooks/useCookie'

interface CommunityUsersReponse {
  success: boolean
  data: userProfileType[]
}

const fetchCommunityUsers = async (communityId: string, token: string): Promise<any> => {
  const response = await client(`/community/${communityId}/users`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export const useCommunityUsers = (communityId: string) => {
  const [cookieValue] = useCookie('uni_user_token')
  return useQuery<CommunityUsersReponse>({
    queryKey: ['community-users', communityId],
    queryFn: () => fetchCommunityUsers(communityId!, cookieValue),
    enabled: !!communityId && !!cookieValue,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
