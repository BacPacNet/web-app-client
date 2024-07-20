import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import useCookie from '@/hooks/useCookie'
import { AxiosErrorType, PostCommentData, UserPostData } from '@/types/constants'

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

export async function getAllUserPosts(token: string) {
  const response: any = await client('/userpost/', { headers: { Authorization: `Bearer ${token}` } })
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

export async function LikeUnlikeUserPostComment(UserPostCommentId: string, token: string) {
  const response = await client(`/userpostcomment/likeUnlike/${UserPostCommentId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

//Query Functions for UserPost, UserPostComment

export const useCreateUserPostComment = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PostCommentData) => CreateUserPostComment(data, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useLikeUnlikeUserPostComment = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userPostCommentId: string) => LikeUnlikeUserPostComment(userPostCommentId, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] })
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
    },
    onError: (res: AxiosErrorType) => {
      console.log(res.response?.data.message, 'res')
    },
  })
}

export function useGetUserPosts() {
  const [cookieValue] = useCookie('uni_user_token')

  const { isLoading, data, error } = useQuery({
    queryKey: ['userPosts'],
    queryFn: () => getAllUserPosts(cookieValue),
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, error: errorMessage }
}

export const useCreateUserPost = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UserPostData) => CreateUserPost(data, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] })
    },
    onError: (res: AxiosErrorType) => {
      console.log(res.response?.data.message, 'res')
    },
  })
}

export const useLikeUnlikeTimelinePost = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (postId: string) => LikeUnilikeUserPost(postId, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] })
    },
    onError: (res: AxiosErrorType) => {
      console.log(res)
      console.log(res.response?.data.message, 'res')
    },
  })
}
