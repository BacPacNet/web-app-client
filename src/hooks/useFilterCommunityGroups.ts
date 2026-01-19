import { useEffect } from 'react'
import { useGetFilteredSubscribedCommunities, useGetSubscribedCommunties } from '@/services/university-community'

interface UseFilterCommunityGroupsParams {
  communityId?: string
  selectedType: string[]
  selectedFilters: Record<string, string[]>
  sort: string
  enabled?: boolean
}

export function useFilterCommunityGroups({ communityId, selectedType, selectedFilters, sort, enabled = true }: UseFilterCommunityGroupsParams) {
  const { mutate: mutateFilterCommunityGroups, data } = useGetFilteredSubscribedCommunities(communityId || '')
  const { data: subscribedCommunities } = useGetSubscribedCommunties()

  const filteredCommunityGroups = subscribedCommunities?.find((community: any) => community._id === communityId)

  const applyFilters = () => {
    if (communityId) {
      const data = { selectedType, selectedFilters, sort }
      mutateFilterCommunityGroups(data)
    }
  }

  useEffect(() => {
    if (enabled && communityId) {
      applyFilters()
    }
  }, [sort, communityId, selectedFilters, selectedType, enabled])

  return {
    applyFilters,
    filteredCommunityGroups: data,
    mutateFilterCommunityGroups,
  }
}
