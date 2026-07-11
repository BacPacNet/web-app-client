import useCookie from '@/hooks/useCookie'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'

export type BulkUpdateStudentProfileByCommunityAdminPayload = {
  userIds: string[]
  study_year?: string
  year?: string
  major?: string
}

export type BulkUpdateFacultyProfileByCommunityAdminPayload = {
  userIds: string[]
  occupation?: string
  affiliation?: string
}

export async function getUserProfileData(token: any) {
  const response: any = await client(`/userprofile/me`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetUserProfileData(type: string) {
  const [cookieValue] = useCookie('uni_user_token')

  const state = useQuery({
    queryKey: ['getRefetchUserProfileData'],
    queryFn: () => getUserProfileData(cookieValue),
    enabled: !!cookieValue && type !== '',
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}
export async function getUserProfileVerifiedUniversityEmailData(token: any) {
  const response: any = await client(`/userprofile/verifiedUniversityEmails`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetUserProfileVerifiedUniversityEmailData() {
  const [cookieValue] = useCookie('uni_user_token')

  const state = useQuery({
    queryKey: ['verifiedUniversityEmails'],
    queryFn: () => getUserProfileVerifiedUniversityEmailData(cookieValue),
    enabled: !!cookieValue,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

const blockUser = async (userToBlock: any, token: string) => {
  const res = await client(`/userprofile/block?userToBlock=${userToBlock}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  return res
}
export const useBlockUser = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userToBlock: any) => blockUser(userToBlock, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getRefetchUserData'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
      showCustomDangerToast(res.response.data.message)
    },
  })
}

export async function getUserBlockedList(token: any) {
  const response: any = await client(`/userprofile/blocked_users`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export function useGetUserBlockedList() {
  const [cookieValue] = useCookie('uni_user_token')

  const state = useQuery({
    queryKey: ['getUserBlockedList'],
    queryFn: () => getUserBlockedList(cookieValue),
    enabled: !!cookieValue,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export async function bulkUpdateStudentProfileByCommunityAdmin(token: string, data: BulkUpdateStudentProfileByCommunityAdminPayload) {
  const response = await client(`/userprofile/community-admin/student-profile`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  return response
}

export function useBulkUpdateStudentProfileByCommunityAdmin() {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BulkUpdateStudentProfileByCommunityAdminPayload) => bulkUpdateStudentProfileByCommunityAdmin(cookieValue, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsersForConnections'] })
      showCustomSuccessToast('Student profiles updated successfully')
    },
    onError: (res: any) => {
      showCustomDangerToast(res.response?.data?.message || 'Failed to update student profiles')
    },
  })
}

export async function bulkUpdateFacultyProfileByCommunityAdmin(token: string, data: BulkUpdateFacultyProfileByCommunityAdminPayload) {
  const response = await client(`/userprofile/community-admin/faculty-profile`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  return response
}

export function useBulkUpdateFacultyProfileByCommunityAdmin() {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BulkUpdateFacultyProfileByCommunityAdminPayload) => bulkUpdateFacultyProfileByCommunityAdmin(cookieValue, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsersForConnections'] })
      showCustomSuccessToast('Faculty profiles updated successfully')
    },
    onError: (res: any) => {
      showCustomDangerToast(res.response?.data?.message || 'Failed to update faculty profiles')
    },
  })
}
