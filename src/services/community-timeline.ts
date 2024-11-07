import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import useCookie from '@/hooks/useCookie'
import { AxiosErrorType, PostCommentData, PostType, UserPostData } from '@/types/constants'

export async function DeleteUserPost(postId: string, token: string) {
  const response = await client(`/userpost/${postId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function UpdateUserPost(data: UserPostData, postId: string, token: string) {
  const response = await client(`/userpost/${postId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export async function LikeUnilikeUserPost(postId: string, token: string) {
  const response = await client(`/userpost/likeunlike/${postId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function getAllUserPosts(token: string, userId: string) {
  const response: any = await client(`/userpost?userId=${userId}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function getAllTimelinePosts(token: string, page: number, limit: number) {
  const response: any = await client(`/userpost/timeline?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}
export async function getUserPostComments(postId: string, token: string, page: number, limit: number) {
  const response: any = await client(`/userpostcomment/${postId}?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}
export async function getUserPostCommentById(commentId: string, token: string) {
  const response: any = await client(`/userpostcomment/comment/${commentId}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function CreateUserPost(data: UserPostData, token: string) {
  const response = await client(`/userpost/`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export async function CreateUserPostComment(data: PostCommentData, token: string) {
  const response = await client(`/userpostcomment/${data.postID}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}
export async function CreateUserPostCommentReply(data: PostCommentData, token: string) {
  const response = await client(`/userpostcomment/${data.commentId}/replies`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export async function LikeUnlikeUserPostComment(UserPostCommentId: string, token: string) {
  const response = await client(`/userpostcomment/likeUnlike/${UserPostCommentId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

//Query Functions for UserPost, UserPostComment

export const useCreateUserPostComment = (isSinglePost: boolean) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PostCommentData) => CreateUserPostComment(data, cookieValue),

    onSuccess: () => {
      if (isSinglePost) {
        queryClient.invalidateQueries({ queryKey: ['userPosts'] })
        queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['userPostComments'] })
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useCreateUserPostCommentReply = (isSinglePost: boolean, isNested: boolean, type: PostType.Community | PostType.Timeline) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PostCommentData) => CreateUserPostCommentReply(data, cookieValue),

    onSuccess: (data: any) => {
      if (isSinglePost) {
        queryClient.invalidateQueries({ queryKey: ['userPosts'] })
        queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
      }
      if (isNested) {
        if (type == PostType.Timeline) {
          queryClient.invalidateQueries({ queryKey: ['commentById'] })
        }
      } else {
        // queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
        console.log(data)

        queryClient.invalidateQueries({ queryKey: ['userPostComments'] })
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useLikeUnlikeUserPostComment = (isReply: boolean) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userPostCommentId: string) => LikeUnlikeUserPostComment(userPostCommentId, cookieValue),

    onSuccess: () => {
      if (isReply) {
        queryClient.invalidateQueries({ queryKey: ['commentById'] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['userPosts'] })
        queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useDeleteUserPost = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => DeleteUserPost(postId, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] })
      queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
    },
    onError: (res: AxiosErrorType) => {
      console.log(res.response?.data.message, 'res')
    },
  })
}

export const useUpdateUserPost = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postData, postId }: { postData: UserPostData; postId: string }) => UpdateUserPost(postData, postId, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] })
      queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
    },
    onError: (res: AxiosErrorType) => {
      console.log(res.response?.data.message, 'res')
    },
  })
}

export function useGetUserPosts(userId: string) {
  const [cookieValue] = useCookie('uni_user_token')

  return useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => getAllUserPosts(cookieValue, userId),
    enabled: !!userId,
  })
}
// export function useGetUserPostComments(postId: string, showCommentSection: boolean, isTimeline: boolean) {
//   const [cookieValue] = useCookie('uni_user_token')

//   const state = useQuery({
//     queryKey: ['userPostComments'],
//     queryFn: () => getUserPostComments(postId, cookieValue),
//     enabled: showCommentSection && !!postId && isTimeline && !!cookieValue,
//   })

//   let errorMessage = null
//   if (axios.isAxiosError(state.error) && state.error.response) {
//     errorMessage = state.error.response.data
//   }

//   return { ...state, error: errorMessage }
// }

export function useGetUserPostComments(postId: string, showCommentSection: boolean, isTimeline: boolean, limit: number) {
  {
    const [cookieValue] = useCookie('uni_user_token')

    return useInfiniteQuery({
      queryKey: ['userPostComments'],
      queryFn: ({ pageParam = 1 }) => getUserPostComments(postId, cookieValue, pageParam, limit),
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1
        }
        return undefined
      },
      initialPageParam: 1,
      enabled: showCommentSection && !!postId && isTimeline && !!cookieValue,
    })
  }
}

export function useGetCommentById(commentId: string, enabled: boolean, isTimeline: boolean) {
  const [cookieValue] = useCookie('uni_user_token')

  const state = useQuery({
    queryKey: ['commentById'],
    queryFn: () => getUserPostCommentById(commentId, cookieValue),
    enabled: !!cookieValue && enabled && isTimeline,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export const useCreateUserPost = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserPostData) => CreateUserPost(data, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] })
      queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
    },
    onError: (res: AxiosErrorType) => {
      console.log(res.response?.data.message, 'res')
    },
  })
}

export function useGetTimelinePosts(isTimeline: boolean, limit: number) {
  // const [cookieValue] = useCookie('uni_user_token')

  // const state = useQuery({
  //   queryKey: ['timelinePosts'],
  //   queryFn: () => getAllTimelinePosts(cookieValue),
  //   enabled: !!cookieValue && isTimeline,
  // })

  // let errorMessage = null
  // if (axios.isAxiosError(state.error) && state.error.response) {
  //   errorMessage = state.error.response.data
  // }

  // return { ...state, error: errorMessage }

  {
    const [cookieValue] = useCookie('uni_user_token')

    return useInfiniteQuery({
      queryKey: ['timelinePosts'],
      queryFn: ({ pageParam = 1 }) => getAllTimelinePosts(cookieValue, pageParam, limit),
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1
        }
        return undefined
      },
      initialPageParam: 1,
      enabled: !!cookieValue && isTimeline,
    })
  }
}

export const useLikeUnlikeTimelinePost = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => LikeUnilikeUserPost(postId, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] })
      queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
    },
    onError: (res: AxiosErrorType) => {
      console.log(res)
      console.log(res.response?.data.message, 'res')
    },
  })
}
