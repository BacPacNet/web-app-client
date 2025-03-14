'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import universityLogoPlaceholder from '@assets/unibuzz_rounded.svg'
import { useRouter } from 'next/navigation'
import { truncateStringTo } from '@/lib/utils'

type Props = {
  data: {
    images: string[]
    logos: string[]
    name: string
    pathUrl: string
  }
}
const DiscoverUniversityCard = ({ data }: Props) => {
  const [imageSrc, setImageSrc] = useState(data?.images[0] || universityPlaceholder)
  const [logoSrc, setLogoSrc] = useState(data?.logos[0] || universityLogoPlaceholder)

  const router = useRouter()
  return (
    <div onClick={() => router.push(`/university/${data.pathUrl}`)} className="w-[330px]    relative rounded-lg cursor-pointer">
      <Image
        src={imageSrc}
        width={330}
        height={240}
        objectPosition="center"
        alt={'university'}
        className="h-60 w-full object-cover object-top rounded-t-lg"
        onError={() => setImageSrc(universityPlaceholder)}
      />
      <div className="w-full p-3 bg-neutral-200 rounded-b-lg relative  flex items-center gap-4 h-14">
        <Image
          src={logoSrc}
          width={32}
          height={32}
          alt={'logo'}
          className="w-8 h-8 bg-white p-1  rounded-full"
          onError={() => setLogoSrc(universityLogoPlaceholder)}
        />
        <p className="h-10 flex items-center font-poppins text-sm font-bold "> {truncateStringTo(data?.name, 28)}</p>
      </div>
    </div>
  )
}

export default DiscoverUniversityCard
