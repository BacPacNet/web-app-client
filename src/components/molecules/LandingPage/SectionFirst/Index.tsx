import Title from '@/components/atoms/Title'
import Image from 'next/image'
import React from 'react'
import UniversitySearchBox from '../../UniversitySearchBox'
import bannerImage from '@assets/landing-mobile.svg'

export default function SectionFirst() {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between mb-10">
      <div
        //  initial="hidden"
        //  animate="visible"
        //  variants={contentVariants}
        className="flex flex-col text-center lg:text-left justify-start h-full lg:w-1/2"
      >
        <p className="text-primary-500 text-xs lg:text-sm mb-4">YOU&apos;RE ALMOST THERE</p>
        <Title className="mb-4">Search your university!</Title>
        <p className="text-neutral-600 text-xs lg:text-sm mb-5">
          University not listed? Send us feedback and we will add your university to the database, along with extra perks for you
        </p>
        <UniversitySearchBox />
      </div>
      <div
      //  initial={{ x: '100vw' }} // Start from the right
      //  animate={{ x: 0 }} // Move to the center
      //  transition={{ type: 'twin', stiffness: 50 }}
      >
        <Image width={650} height={650} src={bannerImage} alt={bannerImage} />
      </div>
    </div>
  )
}
