'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import universityPlaceholder from '@assets/universityBackgroudImage.svg'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import { useRouter } from 'next/navigation'
import { truncateStringTo } from '@/lib/utils'
import { UniversityInfo } from '@/types/University'

const DiscoverUniversityCard = ({ data }: { data: UniversityInfo }) => {
  const [imageSrc, setImageSrc] = useState(data?.campus || universityPlaceholder)
  const [logoSrc, setLogoSrc] = useState(data?.logo || universityLogoPlaceholder)

  const router = useRouter()
  return (
    <div
      onClick={() => router.push(`/discover/${encodeURIComponent(data.name)}`)}
      className="w-[330px]    relative rounded-lg cursor-pointer bg-neutral-200 "
    >
      <Image
        src={imageSrc}
        width={330}
        height={240}
        objectPosition="center"
        alt={'university'}
        className="h-60 w-full object-cover object-top rounded-t-lg bg-neutral-200"
        onError={() => setImageSrc(universityPlaceholder)}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8/B8AAtsA5tSY3jYAAAAASUVORK5CYII="
      />
      <div className="w-full p-3 bg-neutral-200 rounded-b-lg relative  flex items-center gap-4 h-14">
        <Image
          src={logoSrc}
          width={32}
          height={32}
          alt={'logo'}
          className="w-8 h-8 bg-white p-1 object-contain rounded-full"
          onError={() => setLogoSrc(universityLogoPlaceholder)}
        />
        <p className="h-10 flex items-center font-poppins text-sm font-bold "> {truncateStringTo(data?.name, 25)}</p>
      </div>
    </div>
  )
}

export default DiscoverUniversityCard
