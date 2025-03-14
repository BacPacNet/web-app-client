'use client'
import DiscoverFilterComponent from '@/components/molecules/Discover/DiscoverFilterComponent'
import DiscoverFilterMobileComponent from '@/components/molecules/Discover/DiscoverFilterMobileComponent'
import DiscoverUniversityCard from '@/components/molecules/Discover/DiscoverUniversityCard'
import DiscoverUniversityCardSkeleton from '@/components/molecules/Discover/DiscoverUniversityCardSkeleton'
import useDeviceType from '@/hooks/useDeviceType'
import { useGetFilteredUniversity } from '@/services/universitySearch'
import React, { useEffect, useRef, useState } from 'react'

const DiscoverContainer = () => {
  const [query, setQuery] = useState('')
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } = useGetFilteredUniversity(10, query)
  const { isTablet, isMobile } = useDeviceType()
  const universities = data?.pages.flatMap((page) => page.Universities) || []

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current

        if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }
    }

    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="flex justify-center">
      <div className={`max-width-allowed h-with-navbar flex ${isTablet || isMobile ? 'flex-col' : 'flex-row'}   justify-center gap-4 pt-10`}>
        {isTablet || isMobile ? <DiscoverFilterMobileComponent /> : <DiscoverFilterComponent setQuery={setQuery} />}

        <div
          ref={containerRef}
          className={`grid ${isTablet || isMobile ? 'grid-cols-1 place-items-center' : 'grid-cols-2'}  gap-8 overflow-y-auto custom-scrollbar`}
        >
          {isLoading ? (
            <>
              <DiscoverUniversityCardSkeleton />
              <DiscoverUniversityCardSkeleton />
              <DiscoverUniversityCardSkeleton />
              <DiscoverUniversityCardSkeleton />
              <DiscoverUniversityCardSkeleton />
            </>
          ) : !isLoading && !universities.length ? (
            <div className="w-80 text-center font-bold text-4xl mt-10">No Result</div>
          ) : (
            universities?.map((item) => <DiscoverUniversityCard key={item._id} data={item} />)
          )}
        </div>
      </div>
    </div>
  )
}

export default DiscoverContainer
