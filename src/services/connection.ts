import useCookie from '@/hooks/useCookie'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import useDebounce from '@/hooks/useDebounce'
import { useUniStore } from '@/store/store'

export async function getUsersWithProfile(token: any, Name: string) {
  const response: any = await client(`/users?name=${Name}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}
export async function getUserFollow(token: any, Name: string) {
  const response: any = await client(`/userprofile?name=${Name}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}
// export async function getUserFollowing(token: any, Name: string) {
//   const response: any = await client(`/follow/following?name=${Name}`, { headers: { Authorization: `Bearer ${token}` } })
//   return response
// }
// export async function getUserFollowers(token: any, Name: string) {
//   const response: any = await client(`/follow/followers?name=${Name}`, { headers: { Authorization: `Bearer ${token}` } })
//   return response
// }

export async function toggleFollow(id: string, token: any) {
  const response = await client(`/userprofile?userToFollow=${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetAllUserWithProfileData(Name: string, content: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const debouncedSearchTerm = useDebounce(Name, 1000)
  const { isLoading, data, error } = useQuery({
    queryKey: ['getAllUsersWithProfile', debouncedSearchTerm],
    queryFn: () => getUsersWithProfile(cookieValue, debouncedSearchTerm),
    enabled: !!cookieValue && content,
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, error: errorMessage }
}

// export function useGetUserFollowing(Name: string, content: boolean) {
//   const [cookieValue] = useCookie('uni_user_token')
//   const debouncedSearchTerm = useDebounce(Name, 1000)
//   const { isLoading, data, error } = useQuery({
//     queryKey: ['getUserFollowing', debouncedSearchTerm],
//     queryFn: () => getUserFollowing(cookieValue, debouncedSearchTerm),
//     enabled: !!cookieValue && content,
//   })

//   let errorMessage = null
//   if (axios.isAxiosError(error) && error.response) {
//     errorMessage = error.response.data
//   }

//   return { isLoading, data, error: errorMessage }
// }

// export function useGetUserFollowers(Name: string, content: boolean) {
//   const [cookieValue] = useCookie('uni_user_token')
//   const debouncedSearchTerm = useDebounce(Name, 1000)
//   const { isLoading, data, error } = useQuery({
//     queryKey: ['getUserFollowers', debouncedSearchTerm],
//     queryFn: () => getUserFollowers(cookieValue, debouncedSearchTerm),
//     enabled: !!cookieValue && content,
//   })

//   let errorMessage = null
//   if (axios.isAxiosError(error) && error.response) {
//     errorMessage = error.response.data
//   }

//   return { isLoading, data, error: errorMessage }
// }

export const useToggleFollow = (type: string) => {
  const [cookieValue] = useCookie('uni_user_token')
  const { setUserfollowing } = useUniStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleFollow(id, cookieValue),

    onSuccess: (response: any) => {
      console.log(response)
      setUserfollowing(response.followed.following)
      console.log(type)
      if (type == 'Following') {
        queryClient.invalidateQueries({ queryKey: ['getUserFollow'] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['getAllUsersWithProfile'] })
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export function useGetUserFollow(Name: string, content: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const debouncedSearchTerm = useDebounce(Name, 1000)
  const { isLoading, data, error } = useQuery({
    queryKey: ['getUserFollow', debouncedSearchTerm],
    queryFn: () => getUserFollow(cookieValue, debouncedSearchTerm),
    enabled: !!cookieValue && content,
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, error: errorMessage }
}
