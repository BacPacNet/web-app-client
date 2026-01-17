'use client'
import React, { createContext, useContext, useState } from 'react'
import { Community } from '@/types/Community'
import { useGetFilteredSubscribedCommunities } from '@/services/university-community'

interface ApplyFiltersParams {
  communityId: string
  selectedType?: string[]
  selectedFilters?: Record<string, string[]>
  sort?: string
}

interface CommunityFilterContextType {
  filteredCommunityGroups: Community | null
  applyFilters: (params: ApplyFiltersParams) => Promise<void>
  isLoading: boolean
}

const CommunityFilterContext = createContext<CommunityFilterContextType | null>(null)

export const useCommunityFilter = () => {
  const ctx = useContext(CommunityFilterContext)
  if (!ctx) {
    throw new Error('useCommunityFilter must be used inside CommunityFilterProvider')
  }
  return ctx
}

export function CommunityFilterProvider({ children }: { children: React.ReactNode }) {
  const { mutateAsync, isPending } = useGetFilteredSubscribedCommunities('')

  const [filteredCommunityGroups, setFilteredCommunityGroups] = useState<Community | null>(null)

  const applyFilters = async ({ communityId, selectedType = [], selectedFilters = {}, sort = 'userCountDesc' }: ApplyFiltersParams) => {
    if (!communityId) return

    const response = await mutateAsync({
      communityId,
      selectedType,
      selectedFilters,
      sort,
    })

    setFilteredCommunityGroups({
      ...response,
      communityGroups: [...response.communityGroups],
    })
  }

  return (
    <CommunityFilterContext.Provider
      value={{
        filteredCommunityGroups,
        applyFilters,
        isLoading: isPending,
      }}
    >
      {children}
    </CommunityFilterContext.Provider>
  )
}
