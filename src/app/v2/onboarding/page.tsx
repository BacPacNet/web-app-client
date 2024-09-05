'use client'

import LogoNavbar from '@/components/atoms/LogoNavbar'
import OnboardingSlider from '@/components/atoms/OnboardingSlider'
import useDeviceType from '@/hooks/useDeviceType'

const Onboarding = () => {
  return (
    <div className="h-screen">
      <div className="flex flex-col h-screen">
        <LogoNavbar />
        <OnboardingSlider />
      </div>
    </div>
  )
}

export default Onboarding
