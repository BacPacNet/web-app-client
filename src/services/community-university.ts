import { useInfiniteQuery, useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import useCookie from '@/hooks/useCookie'
import { PostType } from '@/types/constants'
import { Community } from '@/types/Community'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { CommunityGroupType } from '@/types/CommuityGroup'

export async function getCommunity(communityId: string) {
  const response = await client(`/community/${communityId}`)
  return response
}

export async function getCommunityPostComments(postId: string, token: string, page: number, limit: number) {
  const response: any = await client(`/communitypostcomment/${postId}?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}
export async function getCommunityPostCommentById(commentId: string, token: string) {
  const response: any = await client(`/communitypostcomment/comment/${commentId}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function UpdateCommunity(communityId: string, data: any) {
  const response = await client(`/community/${communityId}`, { method: 'PUT', data })
  return response
}

export async function joinCommunity(communityId: string, token: string) {
  const response = await client(`/community/${communityId}/join`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}
export async function getCommunityUsers(communityId: string, privacy: string, name: string, token: any) {
  const response: any = await client(`/users/communityUsers/${communityId}?privacy=${privacy}&&name=${name}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export async function getCommunityGroupUsers(communityGroupId: string, name: string, token: any) {
  const response: any = await client(`/users/communityGroupUsers/${communityGroupId}?name=${name}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export async function leaveCommunity(communityId: string, token: any) {
  const response = await client(`/community/${communityId}/leave`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function changeUserGroupRole(data: any, token: any) {
  const response = await client(`/users/user/GroupRole`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}
export async function changeUserCommunityRole(data: any, token: any) {
  const response = await client(`/users/user/CommunityRole`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export async function getAllCommunityGroups(communityId: string, communityGroupId: string, token: any) {
  const response: any = await client(`/communitygroup/${communityId}?${communityGroupId ? `communityGroupId=${communityGroupId}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export async function joinCommunityGroup(communityGroupId: string, token: string) {
  const response = await client(`/communitygroup/togglegroup/${communityGroupId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function CreateCommunityGroup(communityId: string, token: any, data: any) {
  const response = await client(`/communitygroup/${communityId}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export async function UpdateCommunityGroup(data: any, id: string, token: any) {
  const response = await client(`/communitygroup/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export async function LikeUnilikeGroupPost(communityGroupPostId: string, token: any) {
  const response = await client(`/communitypost/likeunlike/${communityGroupPostId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function getAllCommunityGroupPost(communityId: string, communityGroupID: string, token: any, page: number, limit: number) {
  const response: any = await client(`/communitypost/${communityId}/${communityGroupID ? communityGroupID : ''}?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

//posts
export async function getPost(postID: string, isType: string | null, token: string) {
  const response: any = await client(`/communitypost/post/${postID}?isType=${isType}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function CreateGroupPost(data: any, token: string) {
  const response = await client(`/communitypost`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}
export async function CreateGroupPostComment(data: any, token: string) {
  const response = await client(`/communitypostcomment/${data.postID}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}
export async function CreateGroupPostCommentReply(data: any, token: string) {
  const response = await client(`/communitypostcomment/${data.commentId}/replies`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  return response
}

export async function LikeUnilikeGroupPostCommnet(communityGroupPostCommentId: string, token: any) {
  const response = await client(`/communitypostcomment/likeUnlike/${communityGroupPostCommentId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export function useGetCommunity(communityId: string) {
  return useQuery({
    queryKey: ['community', communityId],
    queryFn: () => getCommunity(communityId),
    enabled: !!communityId,
  }) as UseQueryResult<Community>
}

export function useGetCommunityPostComments(postId: string, showCommentSection: boolean, isCommunity: boolean, limit: number) {
  {
    const [cookieValue] = useCookie('uni_user_token')

    return useInfiniteQuery({
      queryKey: ['communityPostComments'],
      queryFn: ({ pageParam = 1 }) => getCommunityPostComments(postId, cookieValue, pageParam, limit),
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1
        }
        return undefined
      },
      initialPageParam: 1,
      enabled: showCommentSection && !!postId && isCommunity && !!cookieValue,
    })
  }
}

export function useGetCommunityCommentById(commentId: string, enabled: boolean, isCommunity: boolean) {
  const [cookieValue] = useCookie('uni_user_token')

  const state = useQuery({
    queryKey: ['communityCommentById'],
    queryFn: () => getCommunityPostCommentById(commentId, cookieValue),
    enabled: !!cookieValue && enabled && isCommunity,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export const useUpdateCommunity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: any) => UpdateCommunity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useJoinCommunity = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (communityId: string) => joinCommunity(communityId, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      queryClient.invalidateQueries({ queryKey: ['community'] })
      showCustomSuccessToast(`Joined Community `)
    },
    onError: (res: any) => {
      console.error(res.response.data.message)
    },
  })
}

export const useLeaveCommunity = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (communityId: string) => leaveCommunity(communityId, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      queryClient.invalidateQueries({ queryKey: ['community'] })
      showCustomDangerToast(`Left Community`)
    },
    onError: (res: any) => {
      console.error(res.response.data.message)
    },
  })
}

export function useGetCommunityGroup(communityId: string, communityGroupId: string = '') {
  const [cookieValue] = useCookie('uni_user_token')

  return useQuery({
    enabled: !!communityId && !!cookieValue && !!communityGroupId,
    queryKey: ['communityGroup', communityId, communityGroupId],
    queryFn: () => getAllCommunityGroups(communityId, communityGroupId, cookieValue),
  }) as UseQueryResult<CommunityGroupType>
}

export function useGetCommunityGroups(communityId: string, communityGroupId: string = '', isJoined: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  return useQuery({
    enabled: isJoined && !!communityId && !!cookieValue,
    queryKey: ['communityGroups', communityId],
    queryFn: () => getAllCommunityGroups(communityId, communityGroupId, cookieValue),
  })
}

//create community
export const useCreateCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ communityId, data }: any) => CreateCommunityGroup(communityId, cookieValue, data),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['communityGroups'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useUpdateCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ communityId, payload }: { communityId: string; payload: any }) => UpdateCommunityGroup(payload, communityId, cookieValue),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['communityGroups'] })
    },
    onError: (res: any) => {
      console.error(res.response.data.message)
    },
  })
}

export function useGetCommunityGroupPost(communityId: string, communityGroupID: string, isCommunity: boolean, limit: number) {
  const [cookieValue] = useCookie('uni_user_token')
  console.log(communityId, 'communityId')
  return useInfiniteQuery({
    queryKey: ['communityGroupsPost', communityId, communityGroupID],
    queryFn: ({ pageParam = 1 }) => getAllCommunityGroupPost(communityId, communityGroupID, cookieValue, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: isCommunity && !!cookieValue,
  })
}

export const useLikeUnilikeGroupPost = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (communityGroupPostId: any) => LikeUnilikeGroupPost(communityGroupPostId, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })

      queryClient.invalidateQueries({ queryKey: ['userPosts'] })
      queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

//post

export const useCreateGroupPost = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => CreateGroupPost(data, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useCreateGroupPostComment = (isSinglePost: boolean) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => CreateGroupPostComment(data, cookieValue),

    onSuccess: () => {
      if (isSinglePost) {
        queryClient.invalidateQueries({ queryKey: ['getPost'] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['communityPostComments'] })
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
export const useCreateGroupPostCommentReply = (isSinglePost: boolean, isNested: boolean, type: PostType.Community | PostType.Timeline) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => CreateGroupPostCommentReply(data, cookieValue),

    onSuccess: () => {
      if (isSinglePost) {
        queryClient.invalidateQueries({ queryKey: ['getPost'] })
      }
      if (isNested) {
        if (type == PostType.Community) {
          queryClient.invalidateQueries({ queryKey: ['communityCommentById'] })
        }
      } else {
        queryClient.invalidateQueries({ queryKey: ['communityPostComments'] })
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useLikeUnlikeGroupPostComment = (isReply: boolean) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (communityGroupPostCommentId: any) => LikeUnilikeGroupPostCommnet(communityGroupPostCommentId, cookieValue),

    onSuccess: () => {
      if (isReply) {
        queryClient.invalidateQueries({ queryKey: ['communityCommentById'] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export function useGetCommunityUsers(communityId: string, isopen: boolean, privacy: string, name: string) {
  const [cookieValue] = useCookie('uni_user_token')
  const state = useQuery({
    enabled: isopen && !!communityId,
    queryKey: ['communityUsers', communityId, privacy, name],
    queryFn: () => getCommunityUsers(communityId, privacy, name, cookieValue),
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export function useGetCommunityGroupUsers(communityGroupId: string, isopen: boolean, name: string, isGroup: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const state = useQuery({
    enabled: isopen && isGroup,
    queryKey: ['communityGroupUsers', communityGroupId, name],
    queryFn: () => getCommunityGroupUsers(communityGroupId, name, cookieValue),
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export const useUserGroupRole = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => changeUserGroupRole(data, cookieValue),

    onSuccess: (response: any) => {
      console.log(response)

      queryClient.invalidateQueries({ queryKey: ['communityGroupUsers'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useUserCommunityRole = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => changeUserCommunityRole(data, cookieValue),

    onSuccess: (response: any) => {
      console.log(response)

      queryClient.invalidateQueries({ queryKey: ['communityGroupUsers'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export function useGetPost(postId: string, isType: string | null = 'userPost') {
  const [cookieValue] = useCookie('uni_user_token')

  return useQuery({
    queryKey: ['getPost', postId],
    queryFn: () => getPost(postId, isType, cookieValue),
    enabled: !!postId && !!cookieValue,
  })
}
