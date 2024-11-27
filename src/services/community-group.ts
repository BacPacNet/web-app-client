import { useUniStore } from '@/store/store'
import { client } from './api-Client'
import useCookie from '@/hooks/useCookie'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * API call to join a community group
 * @param communityGroupId - ID of the community group
 * @param token - Authentication token
 * @returns API response
 */
async function joinCommunityGroupAPI(communityGroupId: string, token: string) {
  return await client(`/communitygroup/${communityGroupId}/join`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })
}

/**
 * Custom hook to handle joining a community group
 * @returns Mutation object from react-query
 */
export const useJoinCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (communityGroupId: string) => joinCommunityGroupAPI(communityGroupId, cookieValue),

    onSuccess: () => {
      // Invalidate relevant query caches
      queryClient.invalidateQueries({ queryKey: ['communityGroup'] })
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
    },

    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Something went wrong'
      console.error('Error joining community group:', errorMessage)
    },
  })
}

/**
 * API call to leave a community group
 * @param communityGroupId - ID of the community group
 * @param token - Authentication token
 * @returns API response
 */
async function leaveCommunityGroupAPI(communityGroupId: string, token: string) {
  return await client(`/communitygroup/${communityGroupId}/leave`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

/**
 * Custom hook to handle leaving a community group
 * @returns Mutation object from react-query
 */
export const useLeaveCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (communityGroupId: string) => leaveCommunityGroupAPI(communityGroupId, cookieValue),

    onSuccess: () => {
      // Invalidate relevant query caches
      queryClient.invalidateQueries({ queryKey: ['communityGroup'] })
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
    },

    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Something went wrong'
      console.error('Error leaving community group:', errorMessage)
    },
  })
}
