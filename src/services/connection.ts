import useCookie from '@/hooks/useCookie'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import useDebounce from '@/hooks/useDebounce'
import { useUniStore } from '@/store/store'
import { FindUsers, FollowingItemProps } from '@/types/constants'

interface FollowingItemPropss {
  profile: FollowingItemProps[]
}

interface userItemsProps {
  user: FindUsers[]
}

export async function getUsersWithProfile(token: string, Name: string) {
  const response: userItemsProps = await client(`/users?name=${Name}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}
export async function getUserFollow(token: string, Name: string) {
  const response: FollowingItemPropss = await client(`/userprofile?name=${Name}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}
export async function getUserFollowers(token: string, Name: string) {
  const response: FollowingItemPropss = await client(`/userprofile/followers?name=${Name}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function toggleFollow(id: string, token: any) {
  const response = await client(`/userprofile?userToFollow=${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetAllUserWithProfileData(Name: string, content: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const debouncedSearchTerm = useDebounce(Name, 1000)
  const { isLoading, data, error, isFetching } = useQuery({
    queryKey: ['getAllUsersWithProfile', debouncedSearchTerm],
    queryFn: () => getUsersWithProfile(cookieValue, debouncedSearchTerm),
    enabled: !!cookieValue && content,
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, isFetching, error: errorMessage }
}

export const useToggleFollow = (type: string) => {
  const [cookieValue] = useCookie('uni_user_token')
  const { setUserfollowing } = useUniStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleFollow(id, cookieValue),

    onSuccess: (response: any) => {
      setUserfollowing(response.followed.following)
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
  const { isLoading, data, error, isFetching } = useQuery({
    queryKey: ['getUserFollow', debouncedSearchTerm],
    queryFn: () => getUserFollow(cookieValue, debouncedSearchTerm),
    enabled: !!cookieValue && content,
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, isFetching, error: errorMessage }
}

export function useGetUserFollowers(Name: string, content: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const debouncedSearchTerm = useDebounce(Name, 1000)
  const { isLoading, data, error, isFetching } = useQuery({
    queryKey: ['getUserFollowers', debouncedSearchTerm],
    queryFn: () => getUserFollowers(cookieValue, debouncedSearchTerm),
    enabled: !!cookieValue && content,
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, isFetching, error: errorMessage }
}
