'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import badge from '@assets/badge.svg'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'

type Props = {
  logo: string
  name: string
  isVerified: boolean
}

const PostCommunityHolder = ({ logo, name, isVerified }: Props) => {
  const [logoSrc, setLogoSrc] = useState(logo)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLogoSrc(logo)
  }, [logo])

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Image
              width={32}
              height={32}
              className="w-[32px] h-[32px] object-contain rounded-full shadow-logo"
              src={logoSrc || ''}
              alt={'logo'}
              onError={() => setLogoSrc(universityLogoPlaceholder)}
            />
            {isVerified && <Image src={badge} width={16} height={16} alt="badge" className=" min-w-[16px] absolute top-5 left-[21px]" />}
          </div>
        </PopoverTrigger>
        <PopoverContent align="end" className="relative w-max  left-6 top-2  py-2 px-4 border-none shadow-lg bg-white shadow-gray-light">
          <p className=" w-full text-neutral-700 text-2xs">
            {isVerified ? 'Verified for ' : 'Joined '}
            <span className="font-bold">{name}</span>
          </p>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default PostCommunityHolder
