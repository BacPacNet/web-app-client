'use client'
import './Footer.css'

import React from 'react'
import { usePathname } from 'next/navigation'
import FooterLinks from '../molecules/FooterLinks'

interface FooterProps {
  minimal?: boolean
}

const Footer: React.FC<FooterProps> = ({ minimal = false }) => {
  const pathname = usePathname()

  if (pathname.includes('/login') || pathname.includes('/forget-password') || pathname.includes('/register')) {
    return null
  }

  return (
    <div className="w-full mx-auto relative flex flex-col center-v py-2 lg:py-3  bg-surface-primary-50">
      <div className="max-width-allowed mx-auto w-full text-gray-dark text-sm lg:text-lg">
        <div className={`w-full flex items-center ${minimal ? 'justify-center' : 'flex-col-reverse lg:flex-row justify-center md:justify-between'} my-4 gap-4 text-sm`}>
          <div className="flex gap-4 items-start">
            <p className="text-neutral-500 text-xs font-normal">Copyright © 2024, Unibuzz Networks</p>
          </div>
          {!minimal && <FooterLinks />}
        </div>
      </div>
    </div>
  )
}

export default Footer
