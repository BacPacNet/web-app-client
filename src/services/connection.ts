import useCookie from '@/hooks/useCookie'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import useDebounce from '@/hooks/useDebounce'
import { useUniStore } from '@/store/store'
import { FindUsers, FollowingItemProps } from '@/types/constants'
import { ProfileConnection } from '@/types/Connections'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'

interface userItemsProps {
  user: FindUsers[]
}

export async function getUsersWithProfile(token: string, Name: string) {
  const response: userItemsProps = await client(`/users?name=${Name}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}
export async function getUserFollowing(token: string, page: number, limit: number, name: string, userId: string) {
  const response: ProfileConnection = await client(`/userprofile/following?page=${page}&limit=${limit}&name=${name}&userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}
export async function getUserFollowers(token: string, page: number, limit: number, name: string, userId: string) {
  const response: ProfileConnection = await client(`/userprofile/followers?page=${page}&limit=${limit}&name=${name}&userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export async function getUserMututal(token: string, page: number, limit: number, name: string, userId: string) {
  const response: ProfileConnection = await client(`/userprofile/mutuals?page=${page}&limit=${limit}&name=${name}&userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export async function toggleFollow(id: string, token: any) {
  const response = await client(`/userprofile?userToFollow=${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetAllUserWithProfileData(Name: string, content: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const debouncedSearchTerm = useDebounce(Name, 1000)
  const state = useQuery({
    queryKey: ['getAllUsersWithProfile', debouncedSearchTerm],
    queryFn: () => getUsersWithProfile(cookieValue, debouncedSearchTerm),
    enabled: !!cookieValue && content,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export const useToggleFollow = (type: string) => {
  const [cookieValue] = useCookie('uni_user_token')
  const { setUserfollowing } = useUniStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleFollow(id, cookieValue),

    onSuccess: (response: any) => {
      //   setUserfollowing(response.following)
      queryClient.invalidateQueries({ queryKey: ['getRefetchUserData'] })
      if (type == 'FIND_PEOPLE') {
        queryClient.invalidateQueries({ queryKey: ['usersProfileForConnections'] })
      }
      if (type == 'FOLLOWER') {
        queryClient.invalidateQueries({ queryKey: ['getUserFollower'] })
      } else {
        queryClient.invalidateQueries({ queryKey: ['getAllUsersWithProfile'] })
      }
    },
    onError: (res: any) => {
      console.error(res.response.data.message, 'res')
      showCustomDangerToast(res.response.data.message)
    },
  })
}

export function useGetUserMutuals(name: string, userId: string, limit: number, enabled: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const debouncedSearchTerm = useDebounce(name, 1000)

  return useInfiniteQuery({
    queryKey: ['getUserMutuals', debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) => getUserMututal(cookieValue, pageParam, limit, debouncedSearchTerm, userId),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: !!cookieValue && enabled,
  })
}

export function useGetUserFollowing(name: string, userId: string, limit: number, enabled: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const debouncedSearchTerm = useDebounce(name, 1000)

  return useInfiniteQuery({
    queryKey: ['getUserFollowing', debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) => getUserFollowing(cookieValue, pageParam, limit, debouncedSearchTerm, userId),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: !!cookieValue && enabled,
  })
}

export function useGetUserFollowers(name: string, userId: string, limit: number, enabled: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const debouncedSearchTerm = useDebounce(name, 1000)

  return useInfiniteQuery({
    queryKey: ['getUserFollower', debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) => getUserFollowers(cookieValue, pageParam, limit, debouncedSearchTerm, userId),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: !!cookieValue && enabled,
  })
}
