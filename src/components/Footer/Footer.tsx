'use client'
import './Footer.css'

import React from 'react'
import { usePathname } from 'next/navigation'
import FooterLinks from '../molecules/FooterLinks'

const Footer: React.FC = () => {
  const pathname = usePathname()

  if (pathname.includes('/login') || pathname.includes('/forget-password') || pathname.includes('/register')) {
    return null
  }

  return (
    <div className="w-full mx-auto relative flex flex-col center-v py-2 lg:py-3  bg-surface-primary-50">
      <div className="max-width-allowed w-full text-gray-dark text-sm lg:text-lg">
        <div className="w-full flex flex-col-reverse lg:flex-row items-center justify-center md:justify-between my-4 gap-4 text-sm">
          <div className="flex gap-4 items-start">
            <p className="text-neutral-500 text-xs font-normal">Copyright © 2024, Unibuzz Networks</p>
          </div>
          <FooterLinks />
        </div>
      </div>
    </div>
  )
}

export default Footer
