import useCookie from '@/hooks/useCookie'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import { useUniStore } from '@/store/store'
import { ProfileConnection } from '@/types/Connections'
import useDebounce from '@/hooks/useDebounce'

export async function getUserData(token: any, id: string) {
  const response: any = await client(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

const changeUserName = async (data: any, token: string) => {
  const res = await client(`/users/changeUserName`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return res
}
const changeUserEmail = async (data: any, token: string) => {
  const res = await client(`/users/changeUserEmail`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return res
}
const changeUserPassword = async (data: any, token: string) => {
  const res = await client(`/users/changeUserPassword`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return res
}
const deActivateUserAccount = async (data: any, token: string) => {
  const res = await client(`/users/deActivateUserAccount`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return res
}

export function useGetUserData(userId: string) {
  const [cookieValue] = useCookie('uni_user_token')
  return useQuery({
    queryKey: ['getRefetchUserData', userId],
    queryFn: () => getUserData(cookieValue, userId),
    enabled: !!cookieValue && !!userId,
  })
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

export const useChangeUserName = () => {
  const setUserData = useUniStore((state) => state.setUserData)
  const [cookieValue] = useCookie('uni_user_token')
  return useMutation({
    mutationFn: (data: any) => changeUserName(data, cookieValue),
    onSuccess: (response: any) => {
      setUserData(response)
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
export const useChangeUserEmail = () => {
  const setUserData = useUniStore((state) => state.setUserData)
  const [cookieValue] = useCookie('uni_user_token')
  return useMutation({
    mutationFn: (data: any) => changeUserEmail(data, cookieValue),
    onSuccess: (response: any) => {
      setUserData(response)
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
export const useDeActivateUserAccount = () => {
  const [cookieValue] = useCookie('uni_user_token')
  return useMutation({
    mutationFn: (data: any) => deActivateUserAccount(data, cookieValue),

    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
export const useChangeUserPassword = () => {
  const [cookieValue] = useCookie('uni_user_token')
  return useMutation({
    mutationFn: (data: any) => changeUserPassword(data, cookieValue),
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
