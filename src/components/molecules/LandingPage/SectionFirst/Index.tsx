'use client'
import Image from 'next/image'
import React from 'react'
import heroImage from '@assets/hero.svg'
import Buttons from '@/components/atoms/Buttons'
import UniversitySearchBox from '../../UniversitySearchBox'
import { useRouter } from 'next/navigation'
export default function SectionFirst() {
  const router = useRouter()
  return (
    <section className="flex flex-col items-center justify-center text-center lg:py-16 py-8 w-full">
      <h1 className="font-poppins font-bold text-2xl sm:text-4xl md:text-5xl text-neutral-800 mb-4 !leading-tight">
        One Stop Academic
        <br />
        and Student Community Platform
      </h1>
      <p className="text-neutral-500 text-xs lg:text-sm max-w-3xl mb-8">
        Join Unibuzz to bridge the gap between students and universities, discover opportunities, collaborate with peers, and make your academic
        journey engaging and productive.
      </p>
      <div className="flex gap-4 mb-8">
        <Buttons onClick={() => router.push('/login')} variant="primary" size="large">
          Get Started
        </Buttons>
        <Buttons onClick={() => router.push('/about')} variant="shade" size="large">
          Learn More
        </Buttons>
      </div>
      <div className="relative w-full max-w-3xl mb-12">
        <UniversitySearchBox />
      </div>
      <div className="w-full flex justify-center">
        <Image src={heroImage} alt="Landing Banner" width={700} height={500} className="w-full max-w-3xl h-auto" />
      </div>
    </section>
  )
}
