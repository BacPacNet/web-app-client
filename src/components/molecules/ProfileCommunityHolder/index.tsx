'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import badge from '@assets/badge.svg'
import Buttons from '@/components/atoms/Buttons'
import communityAdminBadge from '@assets/communityAdminBadge.svg'

type Props = {
  logo: string
  name: string
  isVerified: boolean
  isActive: boolean
  isCommunityAdmin: boolean
}

const ProfileCommunityHolder = ({ logo, name, isVerified, isActive, isCommunityAdmin }: Props) => {
  const [logoSrc, setLogoSrc] = useState(logo)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLogoSrc(logo)
  }, [logo])

  return (
    <div className="relative">
      <div className="flex items-center gap-2 ">
        <div className="w-[37px] h-[37px]">
          <Image
            objectFit="contain"
            src={logoSrc}
            onError={() => setLogoSrc(universityLogoPlaceholder)}
            alt=""
            width={36}
            height={36}
            className="rounded-full shadow-logo h-[36px] object-contain "
          />
        </div>
        <div className="flex items-center gap-1">
          <p className="text-neutral-500  font-medium text-2xs ">{name}</p>
          {isVerified && !isCommunityAdmin && (
            <Image src={badge} width={16} height={16} alt="badge" className=" min-w-[16px] absolute top-[24px] left-[24px]" />
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
