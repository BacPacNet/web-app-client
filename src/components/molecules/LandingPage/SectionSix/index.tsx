import Button from '@/components/atoms/Buttons'
import Link from 'next/link'
import React from 'react'

export default function SectionSix() {
  return (
    <div className="flex flex-col gap-8 text-center mb-4 sm:mb-[112px]  px-4  lg:px-0">
      {/* <div>
        <p className="text-primary-500 text-xs lg:text-sm">BECOME A PART OF YOUR UNIVERSITY</p>
      </div> */}

      <div className="flex flex-col gap-6 text-center ">
        <div>
          <p className="text-md-big sm:text-lg-small font-poppins text-neutral-700 font-bold">
            Create an <span className="text-primary-500">Account</span> to Get Started
          </p>
        </div>
        <div>
          <p className="text-neutral-700  text-2sm font-normal">Search universities worldwide and become part of their online communities </p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Link href="/register">
          <Button>Sign Up</Button>
        </Link>
        <Link href="/about">
          <Button variant="shade">Learn More</Button>
        </Link>
      </div>
    </div>
  )
}
