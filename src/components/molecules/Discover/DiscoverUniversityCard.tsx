'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import universityLogoPlaceholder from '@assets/unibuzz_rounded.svg'
import { useRouter } from 'next/navigation'

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
    <div
      onClick={() => router.push(`/university/${data.pathUrl}`)}
      className="w-96 max-xl:w-80 max-lg:w-60 max-md:w-80    relative rounded-2xl cursor-pointer"
    >
      <Image
        src={imageSrc}
        width={400}
        height={400}
        objectPosition="center"
        alt={'university'}
        className="h-60 w-full object-cover object-top rounded-t-2xl"
        onError={() => setImageSrc(universityPlaceholder)}
      />
      <div className="w-full p-4 bg-neutral-200 rounded-b-2xl relative  flex items-center gap-4">
        <Image
          src={logoSrc}
          width={30}
          height={30}
          alt={'logo'}
          className="w-10 h-10 bg-white p-1  rounded-full"
          onError={() => setLogoSrc(universityLogoPlaceholder)}
        />
        <p className="h-10 flex items-center"> {data?.name}</p>
      </div>
    </div>
  )
}

export default DiscoverUniversityCard
