import useCookie from '@/hooks/useCookie'
import { AxiosErrorType } from '@/types/constants'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { client } from './api-Client'

export async function deleteCommunityPost(postId: string, token: string) {
  const response = await client(`/communityPost/${postId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export const useDeleteCommunityPost = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => deleteCommunityPost(postId, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] })
      queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
    },
    onError: (res: AxiosErrorType) => {
      console.log(res.response?.data.message, 'res')
    },
  })
}
