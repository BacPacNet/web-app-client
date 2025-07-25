import Button from '@/components/atoms/Buttons'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import image4 from '@assets/image4.svg'
import Buttons from '@/components/atoms/Buttons'

export default function SectionSix() {
  return (
    <div className="flex flex-col gap-8 text-center my-20  px-4  lg:px-0">
      <div className="flex justify-center">
        <Image width={464} height={373} src={image4} alt="Section Six" className="max-w-full h-auto" />
      </div>

      <div className="flex flex-col gap-6 text-center ">
        <div>
          <p className="text-md-big sm:text-lg-small font-poppins text-neutral-700 font-bold">Create an Account</p>
        </div>
        <div>
          <p className="text-neutral-700  lg:text-2sm text-xs font-normal max-w-3xl mx-auto">
            Create your account to unlock access to all features and communities. It only takes a moment to get started and begin connecting with
            others.
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Link href="/register">
          <Buttons size="large" variant="primary">
            Sign Up
          </Buttons>
        </Link>
        <Link href="/about">
          <Buttons size="large" variant="shade">
            Learn More
          </Buttons>
        </Link>
      </div>
    </div>
  )
}
