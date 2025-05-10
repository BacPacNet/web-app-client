import React from 'react'
import Card from '../Card'
import Image from 'next/image'
import onboardingPlaceholder from '@assets/onboading-placeholder.svg'

const OnboardingPlaceholder = () => {
  return (
    <Card className="rounded-lg my-4 p-4">
      <div className="flex flex-col items-center">
        {/* Header illustration */}
        <div className="flex items-center justify-center space-x-6">
          <Image src={onboardingPlaceholder} width={392} height={152} alt="onboardingPlaceholder" />
        </div>

        {/* Instruction text */}
        <div className="mt-10 text-left">
          <h2 className="text-xs md:text-sm font-semibold text-neutral-500 mb-6">Complete the following steps to fully utilize our platform!</h2>
          <ul className="space-y-4 text-left text-gray-600 max-w-xl mx-auto">
            <li className="flex items-start text-neutral-600 text-xs">
              <span className="text-white bg-primary-500 w-5 h-5 flex items-center justify-center rounded-full mr-3 text-2xs flex-none">1</span>
              Add your university community and complete verification.
            </li>
            <li className="flex items-start text-neutral-600 text-xs">
              <span className="text-white bg-primary-500 w-5 h-5 flex items-center justify-center rounded-full mr-3 text-2xs flex-none">2</span>
              Join groups within the university community.
            </li>
            <li className="flex items-start text-neutral-600 text-xs">
              <span className="text-white bg-primary-500 w-5 h-5 flex items-center justify-center rounded-full mr-3 text-2xs flex-none">3</span>
              Follow other students or faculty from your community or our global database.
            </li>
          </ul>
        </div>
      </div>
    </Card>
  )
}

export default OnboardingPlaceholder
