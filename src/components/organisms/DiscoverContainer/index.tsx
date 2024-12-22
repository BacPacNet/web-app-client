'use client'
import DiscoverFilterComponent from '@/components/molecules/Discover/DiscoverFilterComponent'
import DiscoverUniversityCard from '@/components/molecules/Discover/DiscoverUniversityCard'
import DiscoverUniversityCardSkeleton from '@/components/molecules/Discover/DiscoverUniversityCardSkeleton'
import { useGetFilteredUniversity } from '@/services/universitySearch'
import React, { useEffect, useRef, useState } from 'react'

const DiscoverContainer = () => {
  const [query, setQuery] = useState('')
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } = useGetFilteredUniversity(5, query)

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
    <div className="w-full h-with-navbar flex justify-center gap-4 pt-10">
      <DiscoverFilterComponent setQuery={setQuery} />

      <div ref={containerRef} className="grid grid-cols-2 max-md:grid-cols-1 gap-2 overflow-y-auto custom-scrollbar">
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
  )
}

export default DiscoverContainer
