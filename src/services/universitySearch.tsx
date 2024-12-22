import useDebounce from '@/hooks/useDebounce'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import { ServerResponse } from '@/models/common/api-client'

export function useUniversitySearch(searchTerm: string) {
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  return useQuery<any, Error>({
    queryKey: ['universitySearch', debouncedSearchTerm],
    queryFn: () => getUniversitySearch(debouncedSearchTerm),
    enabled: Boolean(debouncedSearchTerm), // Only run if there's a search term
    staleTime: 1000 * 60 * 5, // Optional: Cache data for 5 minutes
    retry: false, // Optional: Prevent retries on failure
  })
}

export async function getUniversitySearch(searchTerm: string): Promise<any[]> {
  if (!searchTerm) return []

  // Fetch university data based on the search term
  const response = await client(`/university/searched?searchTerm=${encodeURIComponent(searchTerm)}`)

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
  totalNotifications: number
}

export async function getFilteredUniversity(page: number, limit: number, searchQuery: string) {
  const response: UserMainNotificationsProps = await client(`/university?page=${page}&limit=${limit}&searchQuery=${searchQuery}`)
  return response
}

export function useGetFilteredUniversity(limit: number, query: string = '') {
  return useInfiniteQuery({
    queryKey: ['university', { query, limit }],
    queryFn: ({ pageParam = 1 }) => getFilteredUniversity(pageParam, limit, query),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })
}
