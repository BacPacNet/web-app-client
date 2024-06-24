import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import useCookie from '@/hooks/useCookie'
import { useUniStore } from '@/store/store'

export async function getCommunity(communityId: string) {
  const response = await client(`/community/${communityId}`)
  return response
}
export async function UpdateCommunity(communityId: string, data: any) {
  // return console.log(communityId)

  const response = await client(`/community/${communityId}`, { method: 'PUT', data })
  return response
}

export async function JoinCommunity(communityId: string, token: any) {
  const response = await client(`/users/${communityId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function LeaveCommunity(communityId: string, token: any) {
  const response = await client(`/users/leave/${communityId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function getAllCommunityGroups(communityId: string, token: any) {
  const response: any = await client(`/communitygroup/${communityId}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function JoinCommunityGroup(communityGroupId: string, token: any) {
  const response = await client(`/communitygroup/togglegroup/${communityGroupId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
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

export async function getAllCommunityGroupPost(communityId: string, token: any) {
  const response: any = await client(`/communitypost/${communityId}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

//posts
export async function CreateGroupPost(data: any, token: any) {
  const response = await client(`/communitypost`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}
export async function CreateGroupPostComment(data: any, token: any) {
  const response = await client(`/communitypostcomment/${data.postID}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export function useGetCommunity(communityId: string) {
  const { isLoading, data, error } = useQuery({
    queryKey: ['community', communityId],
    queryFn: () => getCommunity(communityId),
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, error: errorMessage }
}

export const useUpdateCommunity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: any) => UpdateCommunity(id, data),
    onSuccess: (response: any) => {
      console.log(response, 'response')
      queryClient.invalidateQueries({ queryKey: ['community'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useJoinCommunity = () => {
  // const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  const { setUserData } = useUniStore()
  const [cookieValue] = useCookie('uni_user_token')
  //   console.log(cookieValue)

  return useMutation({
    mutationFn: (communityId: any) => JoinCommunity(communityId, cookieValue),
    onSuccess: (response: any) => {
      console.log(response, 'response')

      setUserData(response.user)
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useLeaveCommunity = () => {
  // const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  const [cookieValue] = useCookie('uni_user_token')
  const { setUserData } = useUniStore()
  //   console.log(cookieValue)

  return useMutation({
    mutationFn: (communityId: any) => LeaveCommunity(communityId, cookieValue),
    onSuccess: (response: any) => {
      console.log(response, 'response')
      setUserData(response.user)
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

//Community Groups

export function useGetCommunityGroups(communityId: string, isJoined: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const { isLoading, data, error } = useQuery({
    enabled: isJoined,
    queryKey: ['communityGroups', communityId],
    queryFn: () => getAllCommunityGroups(communityId, cookieValue),
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, error: errorMessage }
}

export const useJoinCommunityGroup = () => {
  // const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  const { setUserData } = useUniStore()
  const [cookieValue] = useCookie('uni_user_token')
  // console.log('aasd')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (communityGroupId: any) => JoinCommunityGroup(communityGroupId, cookieValue),

    onSuccess: (response: any) => {
      // console.log(response, 'response')
      setUserData(response.user)
      queryClient.invalidateQueries({ queryKey: ['communityGroups'] })
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useUpdateCommunityGroup = () => {
  // const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  // const { setUserData } = useUniStore()
  const [cookieValue] = useCookie('uni_user_token')
  // console.log('aasd')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ dataToPush, id }: { dataToPush: any; id: any }) => UpdateCommunityGroup(dataToPush, id, cookieValue),

    onSuccess: (response: any) => {
      console.log(response, 'response')

      queryClient.invalidateQueries({ queryKey: ['communityGroups'] })
      // queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      // setTimeout(() => {
      //   // queryClient.invalidateQueries({ queryKey: ['communityGroups'] })
      //   queryClient.clear()
      //   queryClient.refetchQueries({ queryKey: ['communityGroups'] })
      // }, 2000)
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export function useGetCommunityGroupPost(communityId: string, isJoined: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  // console.log('query', isJoined)

  const { isLoading, data, error } = useQuery({
    queryKey: ['communityGroupsPost', communityId],
    queryFn: () => getAllCommunityGroupPost(communityId, cookieValue),
    enabled: isJoined,
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, error: errorMessage }
}

export const useLikeUnilikeGroupPost = () => {
  // const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  // const { setUserData } = useUniStore()
  const [cookieValue] = useCookie('uni_user_token')
  // console.log('aasd')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (communityGroupPostId: any) => LikeUnilikeGroupPost(communityGroupPostId, cookieValue),

    onSuccess: () => {
      // console.log(response, 'response')
      // setUserData(response.user)
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

//post

export const useCreateGroupPost = () => {
  // const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  // const { setUserData } = useUniStore()
  const [cookieValue] = useCookie('uni_user_token')
  // console.log('aasd')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => CreateGroupPost(data, cookieValue),

    onSuccess: () => {
      // console.log(response, 'response')
      // setUserData(response.user)
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useCreateGroupPostComment = () => {
  // const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  // const { setUserData } = useUniStore()
  const [cookieValue] = useCookie('uni_user_token')
  // console.log('aasd')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => CreateGroupPostComment(data, cookieValue),

    onSuccess: () => {
      // console.log(response, 'response')
      // setUserData(response.user)
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
