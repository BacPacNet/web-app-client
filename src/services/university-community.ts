import useCookie from '@/hooks/useCookie'
import { client } from './api-Client'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { Community } from '@/types/Community'

export async function getUserSubscribedCommunities(token: any) {
  const response = await client(`/community`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}
export async function getUserFilteredSubscribedCommunities(communityId: string, token: string, data: any) {
  const response = await client(`/community/filtered/${communityId}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
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
export function useGetFilteredSubscribedCommunities(communityId: string = '') {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => getUserFilteredSubscribedCommunities(communityId, cookieValue, data),
    onSuccess: (response: any) => {
      const communityData: any = queryClient.getQueryData(['useGetSubscribedCommunties'])

      if (communityData) {
        const updatedCommunityData = communityData.map((item: any) => {
          if (item._id === response._id) {
            return {
              ...item,
              communityGroups: response.communityGroups,
            }
          }
          return item
        })

        queryClient.setQueryData(['useGetSubscribedCommunties'], updatedCommunityData)
      }
    },
    onError: (res: any) => {
      console.error(res.response.data.message)
    },
  })
}
