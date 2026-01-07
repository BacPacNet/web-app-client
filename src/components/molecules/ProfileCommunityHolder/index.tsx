'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import badge from '@assets/badge.svg'
import Buttons from '@/components/atoms/Buttons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import communityAdminBadge from '@assets/communityAdminBadge.svg'

export enum AlignType {
  Center = 'center',
  Start = 'start',
  End = 'end',
}
type Props = {
  logo: string
  name: string
  isVerified: boolean
  isActive: boolean
  isCommunityAdmin: boolean
  align?: AlignType
}

const ProfileCommunityHolder = ({ logo, name, isVerified, isActive, isCommunityAdmin, align = AlignType.End }: Props) => {
  const [logoSrc, setLogoSrc] = useState(logo)
  const [isLogoPopoverOpen, setIsLogoPopoverOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLogoSrc(logo)
  }, [logo])

  return (
    <div className="relative">
      <div className="flex items-center gap-2 ">
        <Popover open={isLogoPopoverOpen} onOpenChange={setIsLogoPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="relative" onMouseEnter={() => setIsLogoPopoverOpen(true)} onMouseLeave={() => setIsLogoPopoverOpen(false)}>
              <Image
                width={32}
                height={32}
                className="w-[32px] h-[32px] object-contain rounded-full shadow-logo"
                src={logoSrc || ''}
                alt={'logo'}
                onError={() => setLogoSrc(universityLogoPlaceholder)}
              />
              {isVerified && !isCommunityAdmin && (
                <Image src={badge} width={16} height={16} alt="badge" className=" min-w-[16px] absolute top-5 left-[21px]" />
              )}
              {isCommunityAdmin && (
                <Image
                  src={communityAdminBadge}
                  width={16}
                  height={16}
                  alt="badge"
                  className="bg-white rounded-full min-w-[16px] absolute top-5 left-[21px]"
                />
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent align="end" className="relative w-max  left-6 top-2  py-2 px-4 border-none shadow-lg bg-white shadow-gray-light">
            <p className=" w-full text-neutral-700 text-2xs">
              {(isCommunityAdmin && isVerified) || (isCommunityAdmin && !isVerified) ? 'Admin of ' : isVerified ? 'Verified for ' : 'Joined '}
              <span className="font-bold">{name}</span>
            </p>
          </PopoverContent>
        </Popover>
        <div className="flex items-center gap-1">
          <p className="text-neutral-500  font-medium text-2xs ">{name}</p>
        </div>

        {isActive && (
          <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <Buttons variant="shade" size="extra_small">
              Active
            </Buttons>

            {isOpen && (
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[215px] h-max bg-white z-50 py-2 px-4 rounded-lg shadow-md">
                <p className="w-full text-neutral-700 text-2xs font-medium">Your profile is currently associated with this university.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileCommunityHolder
