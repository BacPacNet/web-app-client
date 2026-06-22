import { showCustomDangerToast, showToast } from '@/components/atoms/CustomToasts/CustomToasts'
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
