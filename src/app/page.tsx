import React from 'react'
import Footer from '@/components/Footer/Footer'
import SectionFirst from '@/components/molecules/LandingPage/SectionFirst/Index'
import SectionTwo from '@/components/molecules/LandingPage/SectionTwo'
import SectionThree from '@/components/molecules/LandingPage/SectionThree'
import SectionFour from '@/components/molecules/LandingPage/SectionFour'
import SectionFive from '@/components/molecules/LandingPage/SectionFive'
import SectionSix from '@/components/molecules/LandingPage/SectionSix'

export default function LandingPage() {
  return (
    <div className="bg-white">
      <div className="max-width-allowed mx-auto">
        <SectionFirst />
        <SectionTwo />
        <SectionThree />
        <SectionFour />
        <SectionFive />
        <SectionSix />
      </div>
    </div>
  )
}
