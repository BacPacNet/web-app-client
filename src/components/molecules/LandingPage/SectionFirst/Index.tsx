import Image from 'next/image'
import React from 'react'
import bannerImage from '@assets/landing-banner.svg'
import Buttons from '@/components/atoms/Buttons'
import UniversitySearchBox from '../../UniversitySearchBox'

export default function SectionFirst() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-16 w-full">
      <h1 className="font-poppins font-extrabold text-2xl sm:text-4xl md:text-5xl text-neutral-800 mb-4">
        One Stop Academic
        <br />
        and Social Networking Platform
      </h1>
      <p className="text-neutral-500 text-base lg:text-sm max-w-3xl mb-8">
        Our platform bridges the gap between students and universities, making your academic journey more enriching and engaging.
      </p>
      <div className="flex gap-4 mb-8">
        <Buttons variant="primary" size="large">
          Get Started
        </Buttons>
        <Buttons variant="shade" size="large">
          Learn More
        </Buttons>
      </div>
      <div className="relative w-full max-w-xs lg:max-w-3xl mb-12">
        <UniversitySearchBox />
      </div>
      <div className="w-full flex justify-center">
        <Image src={bannerImage} alt="Landing Banner" width={700} height={500} className="w-full max-w-3xl h-auto" />
      </div>
    </section>
  )
}
