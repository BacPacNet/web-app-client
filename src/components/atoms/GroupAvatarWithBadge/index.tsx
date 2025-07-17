import Image from 'next/image'
import React from 'react'
import { IoIosPeople } from 'react-icons/io'

interface Props {
  groupLogoUrl: string
  isOfficial: boolean
  badgeLogoUrl?: string
}

const GroupAvatarWithBadge: React.FC<Props> = ({ groupLogoUrl, isOfficial, badgeLogoUrl }) => {
  return (
    <div
      className={`relative z-1 flex items-center justify-center  rounded-full w-11 h-11 lg:w-14 lg:h-14 overflow-visible ${
        isOfficial ? 'border-2 border-primary-500' : ''
      }`}
    >
      {groupLogoUrl ? (
        <Image
          src={groupLogoUrl}
          alt="Group Logo"
          width={40}
          height={40}
          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover object-center"
        />
      ) : (
        <IoIosPeople className="w-12 h-12 rounded-full text-primary shadow-logo bg-white  " />
      )}

      {isOfficial && badgeLogoUrl && (
        <div className="absolute bg-white -bottom-2 w-5 h-5 border-2 border-primary-500 rounded-full flex justify-center items-center">
          <Image src={badgeLogoUrl} alt="Badge" width={12} height={12} className="rounded-full object-contain" />
        </div>
      )}
    </div>
  )
}

export default GroupAvatarWithBadge
