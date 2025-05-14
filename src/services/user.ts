import useCookie from '@/hooks/useCookie'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import { useUniStore } from '@/store/store'
import { ProfileConnection } from '@/types/Connections'
import useDebounce from '@/hooks/useDebounce'
import { IUserProfileResponse } from '@/types/User'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'

export async function getUserData(token: any, id: string) {
  const response: IUserProfileResponse = await client(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
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

export async function getAllUsersForConnections(
  token: string,
  page: number,
  limit: number,
  name: string,
  universityName: string,
  studyYear: string[],
  major: string[],
  occupation: string[],
  affiliation: string[]
): Promise<ProfileConnection> {
  const params = new URLSearchParams()

  params.append('page', String(page))
  params.append('limit', String(limit))
  if (name) params.append('name', name)
  if (universityName) params.append('universityName', universityName)
  if (studyYear?.length) params.append('studyYear', studyYear.join(','))
  if (major?.length) params.append('major', major.join(','))
  if (occupation?.length) params.append('occupation', occupation.join(','))
  if (affiliation?.length) params.append('affiliation', affiliation.join(','))

  return await client(`/users/connections?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function useUsersProfileForConnections(
  name: string,
  limit: number,
  enabled: boolean,
  universityName: string = '',
  studyYear?: string[],
  major?: string[],
  occupation?: string[],
  affiliation?: string[]
) {
  const [cookieValue] = useCookie('uni_user_token')
  const debouncedSearchTerm = useDebounce(name, 1000)

  return useInfiniteQuery({
    queryKey: ['usersProfileForConnections', debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) =>
      getAllUsersForConnections(
        cookieValue,
        pageParam,
        limit,
        debouncedSearchTerm,
        universityName,
        studyYear || [],
        major || [],
        occupation || [],
        affiliation || []
      ),
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
      showCustomDangerToast(res.response.data.message)
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
      showCustomDangerToast(res.response.data.message)
    },
  })
}
export const useDeActivateUserAccount = () => {
  const [cookieValue] = useCookie('uni_user_token')
  return useMutation({
    mutationFn: (data: any) => deActivateUserAccount(data, cookieValue),

    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
      showCustomDangerToast(res.response.data.message)
    },
  })
}
export const useChangeUserPassword = () => {
  const [cookieValue] = useCookie('uni_user_token')
  return useMutation({
    mutationFn: (data: any) => changeUserPassword(data, cookieValue),
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
      showCustomDangerToast(res.response.data.message)
    },
  })
}
