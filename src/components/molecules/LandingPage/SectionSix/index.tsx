import Button from '@/components/atoms/Buttons'
import Link from 'next/link'
import React from 'react'

export default function SectionSix() {
  return (
    <div className="flex flex-col gap-3 text-center  px-4 sm:px-24 lg:px-0">
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
        <Link href="/register">
          <Button>Sign Up</Button>
        </Link>
        <Link href="/about">
          <Button variant="shade">Leran More</Button>
        </Link>
      </div>
    </div>
  )
}
