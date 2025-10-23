'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import badge from '@assets/badge.svg'
import Buttons from '@/components/atoms/Buttons'

type Props = {
  logo: string
  name: string
  isVerified: boolean
}

const ProfileCommunityHolder = ({ logo, name, isVerified }: Props) => {
  const [logoSrc, setLogoSrc] = useState(logo)

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
          {isVerified && <Image width={16} height={16} src={badge} alt={''} />}
        </div>

        {isVerified && (
          <Buttons variant="shade" size="extra_small">
            Active
          </Buttons>
        )}
      </div>
    </div>
  )
}

export default ProfileCommunityHolder
