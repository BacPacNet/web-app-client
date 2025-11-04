import Image from 'next/image'
import { useEffect, useState } from 'react'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'

type Props = {
  name: string
  logo: string
  handleChange: (communityId: string, logo: string) => void
  communityId: string
}

export const LeftNavGroupsCommunityHolder = ({ name, logo, handleChange, communityId }: Props) => {
  const [logoSrc, setLogoSrc] = useState(logo)

  useEffect(() => {
    setLogoSrc(logo)
  }, [logo])

  return (
    <div className={`flex items-center justify-between overflow-x-hidden  rounded-md pl-2 my-1 `}>
      <div onClick={() => handleChange(communityId, logo)} className={` flex items-center gap-3 py-2 pr-2 cursor-pointer`}>
        <Image
          width={24}
          height={24}
          className="w-[24px] h-[24px] object-contain rounded-full shadow-logo"
          src={logoSrc || ''}
          alt={name}
          onError={() => setLogoSrc(universityLogoPlaceholder)}
        />

        <div className="flex items-center gap-1">
          <p className={`text-2xs font-medium text-neutral-700   `}>{name} </p>
        </div>
      </div>
    </div>
  )
}
