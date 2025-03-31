import useDebounce from '@/hooks/useDebounce'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import { ServerResponse } from '@/models/common/api-client'
import axios from 'axios'

export function useUniversitySearch(searchTerm: string, page: number, limit: number) {
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  return useQuery<any, Error>({
    queryKey: ['universitySearch', debouncedSearchTerm],
    queryFn: () => getUniversitySearch(debouncedSearchTerm, page, limit),
    enabled: true,
    retry: false, // Optional: Prevent retries on failure
  })
}

export async function getUniversitySearch(searchTerm: string, page: number, limit: number): Promise<any[]> {
  if (!searchTerm) return []

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
