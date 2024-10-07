import LoginButtons from '@/components/atoms/LoginButtons'
import React from 'react'

export default function SectionSix() {
  return (
    <div className="flex flex-col gap-3 text-center">
      <div>
        <p className="text-primary-500 text-xs lg:text-sm">BECOME A PART OF YOUR UNIVERSITY</p>
      </div>
      <div>
        <p className="text-md lg:text-xl font-poppins text-neutral-900 font-bold">
          Create an <span className="text-primary-500">Account</span> to Get Started
        </p>
      </div>
      <div>
        <p className="text-neutral-700 text-xs lg:text-[18px] font-normal">
          Search universities worldwide and become part of their online communities{' '}
        </p>
      </div>
      <div className="flex gap-4 justify-center">
        <LoginButtons>Get Started</LoginButtons>
        <LoginButtons variant="shade">Get Started</LoginButtons>
      </div>
    </div>
  )
}
