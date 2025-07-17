'use client'
import DiscoverFilterComponent from '@/components/molecules/Discover/DiscoverFilterComponent'
import DiscoverFilterMobileComponent from '@/components/molecules/Discover/DiscoverFilterMobileComponent'
import DiscoverUniversityCard from '@/components/molecules/Discover/DiscoverUniversityCard'
import DiscoverUniversityCardSkeleton from '@/components/molecules/Discover/DiscoverUniversityCardSkeleton'
import Paginate from '@/components/molecules/Paginate'
import useDeviceType from '@/hooks/useDeviceType'
import { useGetFilteredUniversity } from '@/services/universitySearch'
import React, { useEffect, useRef, useState } from 'react'
import { IoSearch } from 'react-icons/io5'

const DiscoverContainer = () => {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetFilteredUniversity(page, 10, query, true)
  const { isTablet, isMobile, isDesktop } = useDeviceType()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [data])

  useEffect(() => {
    setPage(1)
  }, [query])

  const handleSearchChange = () => {
    const searchText = searchInputRef.current?.value || ''

    const newData = query ? JSON.parse(query) : {}
    const finalData = JSON.stringify({ ...newData, Search: searchText })

    setQuery(finalData)
  }

  const resetSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = ''
    }
  }

  return (
    <div className="flex justify-between max-width-allowed mx-auto min-h-screen">
      <div className={`w-full flex ${isTablet || isMobile ? 'flex-col' : 'flex-row'} justify-center gap-8 lg:gap-[31px] pt-8`}>
        {isTablet || isMobile ? (
          <DiscoverFilterMobileComponent setQuery={setQuery} />
        ) : (
          <DiscoverFilterComponent query={query} setQuery={setQuery} resetSearchInput={resetSearchInput} />
        )}

        <div className="">
          {isDesktop && (
            <div className="w-full flex items-center relative mb-8 gap-2 border-[1px] border-neutral-300 px-4 py-2 rounded-full ">
              <IoSearch size={20} className=" text-neutral-500" />
              <input
                ref={searchInputRef}
                className="w-full  outline-none "
                placeholder="Search University"
                type="text"
                onChange={handleSearchChange}
              />
            </div>
          )}
          {!isLoading && !data?.Universities?.length && (
            <div className="lg:w-[700px] flex items-center justify-center text-center font-bold text-4xl  font-poppins h-32">No Result Found</div>
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
