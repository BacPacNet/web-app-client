import useCookie from '@/hooks/useCookie'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import { useUniStore } from '@/store/store'
import { ProfileConnection } from '@/types/Connections'
import useDebounce from '@/hooks/useDebounce'

export async function getUserData(token: any, id: string) {
  const response: any = await client(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetUserData(type: string) {
  const [cookieValue] = useCookie('uni_user_token')
  const { userData } = useUniStore()
  const state = useQuery({
    queryKey: ['getRefetchUserData'],
    queryFn: () => getUserData(cookieValue, userData.id || ''),
    enabled: !!cookieValue && type != '',
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export async function getAllUsersForConnections(token: string, page: number, limit: number, name: string): Promise<ProfileConnection> {
  return await client(`/users/connections?page=${page}&limit=${limit}&name=${name}`, { headers: { Authorization: `Bearer ${token}` } })
}

export function useUsersProfileForConnections(name: string, limit: number, enabled: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const debouncedSearchTerm = useDebounce(name, 1000)

  return useInfiniteQuery({
    queryKey: ['usersProfileForConnections', debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) => getAllUsersForConnections(cookieValue, pageParam, limit, debouncedSearchTerm),
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
