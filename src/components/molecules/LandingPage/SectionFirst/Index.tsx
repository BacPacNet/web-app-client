import Image from 'next/image'
import React from 'react'
import UniversitySearchBox from '../../UniversitySearchBox'
import bannerImage from '@assets/landing-mobile.svg'

export default function SectionFirst() {
  return (
    <div className="flex flex-col-reverse lg:flex-row gap-16 lg:gap-[150px] items-center justify-between mb-32  md:mb-[192px]">
      <div className="flex flex-col text-center lg:text-left justify-start h-full lg:w-[453px]">
        <p className="text-primary-500 font-semibold text-xs mb-3">YOU&apos;RE ALMOST THERE</p>

        <h2 className="font-poppins text-md sm:text-[32px] text-neutral-700 font-bold sm:font-extrabold tracking-tighter  ">
          Search your university!
        </h2>
        <p className="text-neutral-500 text-xs sm:text-2sm mt-4  ">
          {' '}
          University not listed? Send us feedback and we will add your university to the database, along with extra perks for you
        </p>
        <UniversitySearchBox />
      </div>
      <div>
        <Image width={453} height={471} src={bannerImage} alt={bannerImage} />
      </div>
    </div>
  )
}
