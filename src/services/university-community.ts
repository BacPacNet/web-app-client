import useCookie from '@/hooks/useCookie'
import { client } from './api-Client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

interface community {
  _id: string
  communityLogoUrl: {
    imageUrl: string
  }
  name: string
  collegeID: string
}
interface CommunityType {
  community: community[]
}

export async function getUserSubscribedCommunityGroups(token: any) {
  const response: CommunityType = await client(`/community`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetUserSubscribedCommunityGroups() {
  const [cookieValue] = useCookie('uni_user_token')
  const state = useQuery({
    queryKey: ['UserSubscribedCommunityGroups'],
    queryFn: () => getUserSubscribedCommunityGroups(cookieValue),
    enabled: !!cookieValue,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}
