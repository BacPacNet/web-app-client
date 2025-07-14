import React from 'react'

const DiscoverUniversityCardSkeleton = () => {
  return (
    <div className="w-[330px] h-[240px] max-xl:w-80 max-lg:w-60 max-md:w-80    relative rounded-lg">
      <div className="h-[200px] w-full object-cover object-top rounded-t-2xl animate-pulse bg-neutral-300"></div>

      <div className="w-full p-2  rounded-b-2xl relative  flex items-center gap-4 border border-neutral-200">
        <div className="w-10 h-10 bg-neutral-200 p-1  rounded-full animate-pulse" />
        <p className="h-4 w-32 flex bg-neutral-200 items-center animate-pulse"> </p>
      </div>
    </div>
  )
}

export default DiscoverUniversityCardSkeleton
