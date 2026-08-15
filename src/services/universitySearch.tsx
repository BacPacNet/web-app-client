import { showCustomDangerToast, showCustomSuccessToast, showToast } from '@/components/atoms/CustomToasts/CustomToasts'
import useCookie from '@/hooks/useCookie'
import useDebounce from '@/hooks/useDebounce'
import { AxiosErrorType } from '@/types/constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { client } from './api-Client'
import axios from 'axios'

export type HighlightPostType = 'CommunityPost' | 'UserPost'

export type AddUniversityHighlightPostPayload = {
  postId: string
  postType: HighlightPostType
  position: number
}

export type UpdateUniversityHighlightPostPositionsPayload = AddUniversityHighlightPostPayload[]

export function useUniversitySearch(searchTerm: string, page: number, limit: number) {
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  return useQuery<any, Error>({
    queryKey: ['universitySearch', debouncedSearchTerm],
    queryFn: () => getUniversitySearch(debouncedSearchTerm, page, limit),
    // enabled: !!debouncedSearchTerm, // Only run if there's a search term
    retry: false, // Optional: Prevent retries on failure
  })
}

export async function getUniversitySearch(searchTerm: string, page: number, limit: number): Promise<any[]> {
  //   if (!searchTerm) return []

  // Fetch university data based on the search term
  const response = await client(`/university/searched?page=${page}&limit=${limit}&searchTerm=${encodeURIComponent(searchTerm)}`)

  // TypeScript assumes `response` is of type `University[]`
  return response
}

export function useUniversitySearchByName(universityName: string) {
  return useQuery<any, Error>({
    queryKey: ['universityByName'],
    queryFn: () => getUniversityByName(universityName),
    enabled: !!universityName, // Only run if there's a search term
    staleTime: 0, // Optional: Cache data for 5 minutes
    retry: false, // Optional: Prevent retries on failure
  })
}

export async function getUniversityByName(universityName: string): Promise<any[]> {
  if (!universityName) return []

  // Fetch university data based on the search term
  const response = await client(`/university/${universityName}`)

  // TypeScript assumes `response` is of type `University[]`
  return response
}

export function useUniversityById(universityId: string) {
  return useQuery<any, Error>({
    queryKey: ['universityById', universityId],
    queryFn: () => getUniversityById(universityId),
    enabled: !!universityId,
    staleTime: 0,
    retry: false,
  })
}

export async function getUniversityById(universityId: string): Promise<any> {
  if (!universityId) return null

  const response = await client(`/university/id/${universityId}`)
  return response
}

type UserMainNotificationsProps = {
  Universities: any
  currentPage: number
  totalPages: number
  totalUniversities: number
}

export async function getFilteredUniversity(page: number, limit: number, searchQuery: string) {
  const response: UserMainNotificationsProps = await client(`/university?page=${page}&limit=${limit}&searchQuery=${searchQuery}`)
  return response
}

export function useGetFilteredUniversity(page: number, limit: number, query: string = '', isEnable: boolean = false) {
  const debouncedSearchTerm = useDebounce(query, 100)
  const state = useQuery({
    queryKey: ['university', { debouncedSearchTerm, limit, page }],
    queryFn: () => getFilteredUniversity(page, limit, debouncedSearchTerm),
    enabled: Boolean(debouncedSearchTerm) || isEnable,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export async function getPartnerUniversities(): Promise<any[]> {
  const response = await client(`/university/partnered`)

  return response
}

export function useGetPartnerUniversities() {
  return useQuery<any, Error>({
    queryKey: ['partnerUniversities'],
    queryFn: () => getPartnerUniversities(),
    staleTime: 0,
    retry: false,
  })
}

export async function getUniversitiesHighlightedPostd(universityId: string): Promise<any[]> {
  const response = await client(`/university/highlights/${universityId}`)

  return response
}

export function useGetUniversitiesHighlightedPostd(universityId: string) {
  return useQuery<any, Error>({
    queryKey: ['universitiesHighlightedPostd', universityId],
    queryFn: () => getUniversitiesHighlightedPostd(universityId),
    staleTime: 0,
    retry: false,
    enabled: !!universityId,
  })
}

export async function addUniversityHighlightPost(universityId: string, data: AddUniversityHighlightPostPayload, token: string) {
  const response = await client(`/university/highlights/${universityId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  return response
}

export function useAddUniversityHighlightPost(universityId: string, universityName?: string) {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: AddUniversityHighlightPostPayload) => addUniversityHighlightPost(universityId, data, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universitiesHighlightedPostd', universityId] })
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
      showToast("Post has been successfully featured in the university's discovery page.", {
        variant: 'success',
        duration: 5000,
        position: 'bottom-center',
        actions: universityName
          ? [
              {
                label: 'Check Post',
                onClick: () => router.push(`/discover/${encodeURIComponent(universityName)}`),
              },
            ]
          : [],
      })
    },
    onError: (error: AxiosErrorType) => {
      showCustomDangerToast(error.response?.data.message as string)
    },
  })
}

export async function deleteUniversityHighlightPost(universityId: string, postId: string, token: string) {
  const response = await client(`/university/highlights/${universityId}/${postId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export function useDeleteUniversityHighlightPost(universityId: string) {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => deleteUniversityHighlightPost(universityId, postId, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universitiesHighlightedPostd', universityId] })
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
      showCustomSuccessToast('Post removed from promoted posts')
    },
    onError: (error: AxiosErrorType) => {
      showCustomDangerToast(error.response?.data.message as string)
    },
  })
}

export async function updateUniversityHighlightPostPositions(
  universityId: string,
  data: UpdateUniversityHighlightPostPositionsPayload,
  token: string
) {
  const response = await client(`/university/highlights/${universityId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  return response
}

export function useUpdateUniversityHighlightPostPositions(universityId: string) {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUniversityHighlightPostPositionsPayload) => updateUniversityHighlightPostPositions(universityId, data, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universitiesHighlightedPostd', universityId] })
      showCustomSuccessToast('Promoted posts order updated successfully')
    },
    onError: (error: AxiosErrorType) => {
      showCustomDangerToast(error.response?.data.message as string)
    },
  })
}

export type UpdateUniversityProfilePayload = {
  name?: string
  description?: string
  long_description?: string
  short_overview?: string
  shortOverview?: string
  logo?: string
  campus?: string
  email?: string
  phone?: string
  address?: string
  office_hours?: string
  total_students?: string
  web_pages?: string | string[]
  contacts?: {
    email?: string
    phone?: string
    address?: string
    office_hours?: string
  }
}

export async function updateUniversityProfile(universityId: string, data: UpdateUniversityProfilePayload, token: string) {
  const response = await client(`/university/${universityId}/profile`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  return response
}

export function useUpdateUniversityProfile(universityId: string) {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUniversityProfilePayload) => updateUniversityProfile(universityId, data, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universityById', universityId] })
      queryClient.invalidateQueries({ queryKey: ['universityByName'] })
    },
    onError: (error: AxiosErrorType) => {
      showCustomDangerToast(error.response?.data.message as string)
    },
  })
}

export function useUpdateUniversityLongDescription(universityId: string) {
  const mutation = useUpdateUniversityProfile(universityId)

  return {
    ...mutation,
    mutate: (data: UpdateUniversityProfilePayload, options?: Parameters<typeof mutation.mutate>[1]) =>
      mutation.mutate(data, {
        ...options,
        onSuccess: (...args) => {
          showCustomSuccessToast('University overview updated successfully')
          options?.onSuccess?.(...args)
        },
      }),
  }
}
