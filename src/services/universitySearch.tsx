import useDebounce from '@/hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import { ServerResponse } from '@/models/common/api-client'

interface UniversitySearchResult {
  isLoading: boolean
  data: ServerResponse<any> | []
}

export function useUniversitySearch(searchTerm: string): UniversitySearchResult {
  // Debounce the search term with a 1-second delay
  const debouncedSearchTerm = useDebounce(searchTerm, 1000)
  // console.log(Boolean(debouncedSearchTerm))

  const { isLoading, data } = useQuery({
    enabled: Boolean(debouncedSearchTerm),
    queryKey: ['searchTerm', debouncedSearchTerm],
    queryFn: () => getUniversitySearch({ queryKey: ['searchTerm', debouncedSearchTerm] }),
  })

  return { isLoading, data }
}

export async function getUniversitySearch({ queryKey }: { queryKey: [string, string] }) {
  const [searchTerm] = queryKey
  const response = await client(`university/searched?searchTerm=${searchTerm}`, { customBaseUrl: true })
  return response
}
