import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import useCookie from '@/hooks/useCookie'
import { AxiosErrorType } from '@/types/constants'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import { useUniStore } from '@/store/store'

export type CommunityGroupPostForCommunityAdmin = {
  _id: string
  content: string
  likeCount: unknown[]
  commentCount: number
  createdAt?: string
  imageUrl?: { imageUrl: string }[]
  communityName?: string
  communityGroupName?: string
  isPostVerified?: boolean
  user: {
    _id: string
    firstName: string
    lastName: string
  }
  userProfile?: {
    university_name?: string
    study_year?: string
    major?: string
    affiliation?: string
    occupation?: string
    role?: string
    profile_dp?: {
      imageUrl?: string
    }
    isCommunityAdmin?: boolean
    communities?: {
      _id: string
      name: string
      logo: string
      isVerifiedMember: boolean
      isCommunityAdmin?: boolean
    }[]
  }
}

export type CommunityGroupPostsForCommunityAdminResponse = {
  finalPost?: CommunityGroupPostForCommunityAdmin[]
  currentPage?: number
  totalPages?: number
  totalPost?: number
}

const MODERATION_POSTS_PAGE_SIZE = 4

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
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
    },
    onError: (res: AxiosErrorType) => {
      console.log(res.response?.data.message, 'res')
    },
  })
}

export async function deleteCommunityPostForCommunityAdmin(postId: string, token: string) {
  return client(`/communitypost/community-admin/${postId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const useDeleteCommunityPostForCommunityAdmin = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => deleteCommunityPostForCommunityAdmin(postId, cookieValue),
    onSuccess: () => {
      showCustomSuccessToast('Post removed successfully')
      queryClient.invalidateQueries({ queryKey: ['moderationGroupPosts'] })
      queryClient.invalidateQueries({ queryKey: ['officialGroupsStats'] })
      queryClient.invalidateQueries({ queryKey: ['officialGroupsWithPostCount'] })
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showCustomDangerToast(error?.response?.data?.message || 'Something went wrong')
    },
  })
}

export async function getCommunityGroupPostsForCommunityAdmin(
  token: string,
  communityId: string,
  communityGroupId: string,
  page: number = 1,
  limit: number = MODERATION_POSTS_PAGE_SIZE
): Promise<CommunityGroupPostsForCommunityAdminResponse> {
  const response = await client<CommunityGroupPostsForCommunityAdminResponse, never>(
    `/communitypost/community-admin/${communityId}/${communityGroupId}?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  return {
    finalPost: response.finalPost ?? [],
    currentPage: response.currentPage ?? page,
    totalPages: response.totalPages ?? 1,
    totalPost: response.totalPost ?? 0,
  }
}

export function useCommunityGroupPostsForCommunityAdmin(
  communityGroupId: string,
  enabled: boolean = false,
  limit: number = MODERATION_POSTS_PAGE_SIZE
) {
  const [cookieValue] = useCookie('uni_user_token')
  const communityId = useUniStore((state) => state.communityId)

  return useInfiniteQuery({
    queryKey: ['moderationGroupPosts', communityId, communityGroupId, limit],
    queryFn: ({ pageParam = 1 }) => getCommunityGroupPostsForCommunityAdmin(cookieValue, communityId, communityGroupId, pageParam, limit),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.currentPage ?? 1
      const totalPages = lastPage.totalPages ?? 1

      if (currentPage < totalPages) {
        return currentPage + 1
      }

      return undefined
    },
    initialPageParam: 1,
    enabled: !!cookieValue && !!communityId && !!communityGroupId && enabled,
  })
}
