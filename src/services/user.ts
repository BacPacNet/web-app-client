import useCookie from '@/hooks/useCookie'
import { useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import { useUniStore } from '@/store/store'

export async function getUserData(token: any, id: string) {
  const response: any = await client(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetUserData(type: string) {
  const [cookieValue] = useCookie('uni_user_token')
  const { userData } = useUniStore()
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ['getRefetchUserData'],
    queryFn: () => getUserData(cookieValue, userData.id),
    enabled: !!cookieValue && type != '',
  })

  let errorMessage = null
  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data
  }

  return { isLoading, data, error: errorMessage, refetch }
}
