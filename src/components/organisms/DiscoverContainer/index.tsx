'use client'
import DiscoverFilterComponent from '@/components/molecules/Discover/DiscoverFilterComponent'
import DiscoverFilterMobileComponent from '@/components/molecules/Discover/DiscoverFilterMobileComponent'
import DiscoverUniversityCard from '@/components/molecules/Discover/DiscoverUniversityCard'
import DiscoverUniversityCardSkeleton from '@/components/molecules/Discover/DiscoverUniversityCardSkeleton'
import Paginate from '@/components/molecules/Paginate'
import useDeviceType from '@/hooks/useDeviceType'
import { useGetFilteredUniversity } from '@/services/universitySearch'
import React, { useEffect, useRef, useState } from 'react'

const DiscoverContainer = () => {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetFilteredUniversity(page, 10, query)
  const { isTablet, isMobile } = useDeviceType()

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [data])

  useEffect(() => {
    setPage(1)
  }, [query])

  return (
    <div className="flex justify-center w-full ">
      <div
        className={`max-width-allowed  lg:h-with-navbar flex ${
          isTablet || isMobile ? 'flex-col' : 'flex-row'
        }   justify-between gap-[64px] lg:gap-8 pt-10`}
      >
        {isTablet || isMobile ? <DiscoverFilterMobileComponent setQuery={setQuery} /> : <DiscoverFilterComponent setQuery={setQuery} />}

        <div>
          {!isLoading && !data?.Universities?.length && (
            <div className="lg:w-[600px] flex items-center justify-center text-center font-bold text-4xl  font-poppins h-32">No Result Found</div>
          )}
          <div ref={containerRef} className={`grid ${isTablet || isMobile ? 'grid-cols-1 place-items-center' : 'lg:grid-cols-2'}  gap-8 `}>
            {isLoading ? (
              <>
                <DiscoverUniversityCardSkeleton />
                <DiscoverUniversityCardSkeleton />
                <DiscoverUniversityCardSkeleton />
                <DiscoverUniversityCardSkeleton />
                <DiscoverUniversityCardSkeleton />
                <DiscoverUniversityCardSkeleton />
                <DiscoverUniversityCardSkeleton />
                <DiscoverUniversityCardSkeleton />
                <DiscoverUniversityCardSkeleton />
                <DiscoverUniversityCardSkeleton />
              </>
            ) : (
              data?.Universities?.map((item: any) => <DiscoverUniversityCard key={item._id} data={item} />)
            )}
          </div>
          <div className="flex items-center justify-center mt-[72px] pb-10">
            {!isLoading && (
              <Paginate onPageChange={(page) => setPage(page)} currentPage={data?.currentPage || 1} totalPages={data?.totalPages || 0} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscoverContainer
