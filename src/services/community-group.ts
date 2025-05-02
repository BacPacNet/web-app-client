import { client } from './api-Client'
import useCookie from '@/hooks/useCookie'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { MESSAGES } from '@/content/constant'

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

    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      queryClient.invalidateQueries({ queryKey: ['communityGroup'] })

      showCustomSuccessToast(response.message)
    },

    onError: (error: any) => {
      showCustomDangerToast(error?.message || MESSAGES.SOMETHING_WENT_WRONG)
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
 * API call to remove user from community group
 * @param communityGroupId - ID of the community group
 * @param userId - ID of the user
 * @param token - Authentication token
 * @returns API response
 */
async function removeUserFromCommunityGroupAPI(communityGroupId: string, userId: string, token: string) {
  return await client(`/communitygroup/${communityGroupId}/user/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

async function deleteCommunityGroupAPI(communityGroupId: string, token: string) {
  return await client(`/communitygroup/${communityGroupId}`, {
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
      queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      showCustomDangerToast(`Left Community Group!`)
    },

    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Something went wrong'
      console.error('Error leaving community group:', errorMessage)
    },
  })
}

/**
 * Custom hook to handle remove user from community group
 * @returns Mutation object from react-query
 */
export const useRemoveUserFromCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ communityGroupId, userId }: { communityGroupId: string; userId: string }) =>
      removeUserFromCommunityGroupAPI(communityGroupId, userId, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityGroup'] })
      showCustomSuccessToast('User removed successfully')
    },

    onError: (error: any) => {
      showCustomSuccessToast(error?.response?.data?.message)
      const errorMessage = error?.response?.data?.message || 'Something went wrong'
      console.error('Error leaving community group:', errorMessage)
    },
  })
}

/**
 * Custom hook to handle delete a community group
 * @returns Mutation object from react-query
 */
export const useDeleteCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (communityGroupId: string) => deleteCommunityGroupAPI(communityGroupId, cookieValue),

    onSuccess: () => {
      showCustomSuccessToast(`Community group deleted`)
      queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
    },

    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Something went wrong'
      console.error('Error deleting community group:', errorMessage)
      showCustomDangerToast(errorMessage)
    },
  })
}

async function ChangeCommunityGroupStatusAPI(data: { status: string }, communityGroupId: string, token: string) {
  return await client(`/communitygroup/status/${communityGroupId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
}

export const useChangeCommunityGroupStatus = (communityGroupId: string) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { status: string; notificationId: string; communityGroupId: string; adminId: string; userId: string }) =>
      ChangeCommunityGroupStatusAPI(data, communityGroupId, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_notification'] })
      showCustomSuccessToast(`status of community group changed`)
    },

    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Something went wrong'
      console.error('Error changing status:', errorMessage)
    },
  })
}

async function acceptRejectPrivateGroupAPI(data: { status: string }, communityGroupId: string, token: string) {
  return await client(`/communitygroup/join-request/${communityGroupId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
}

export const useJoinRequestPrivateGroup = (communityGroupId: string) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { status: string; notificationId: string; userId: string; adminId: string; communityGroupId: string }) =>
      acceptRejectPrivateGroupAPI(data, communityGroupId, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_notification'] })
      //showCustomSuccessToast(`status of Community Group changed`)
    },

    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Something went wrong'
      console.error('Error changing status:', errorMessage)
    },
  })
}
