'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import universityPlaceholder from '@assets/universityBackgroudImage.svg'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import partnerUniversityIcon from '@assets/discover/partnerdUni.svg'
import { useRouter } from 'next/navigation'
import { truncateStringTo } from '@/lib/utils'
import { UniversityInfo } from '@/types/University'

const DiscoverUniversityCard = ({ data, isPartnerUniversity = false }: { data: UniversityInfo; isPartnerUniversity: boolean }) => {
  const [imageSrc, setImageSrc] = useState(data?.campus || universityPlaceholder)
  const [logoSrc, setLogoSrc] = useState(data?.logo || universityLogoPlaceholder)

  const router = useRouter()
  // Update logo and image when data changes
  useEffect(() => {
    setImageSrc(data?.campus || universityPlaceholder)
    setLogoSrc(data?.logo || universityLogoPlaceholder)
  }, [data])

  return (
    <div
      onClick={() => router.push(`/discover/${encodeURIComponent(data.name)}`)}
      className={`w-[330px] h-fit self-start relative cursor-pointer transform transition duration-300 hover:scale-105 overflow-hidden ${
        isPartnerUniversity ? 'rounded-lg bg-neutral-200' : 'rounded-lg bg-neutral-200'
      }`}
    >
      {isPartnerUniversity && <div className="absolute inset-0 rounded-lg border-4 border-primary-500 pointer-events-none z-20" />}
      {isPartnerUniversity && (
        <div className="absolute top-0 left-0 right-0 z-10 h-[36px] bg-primary-500 flex items-center gap-3 px-[21px] pointer-events-none">
          <div className="w-[14px] h-[18px]  flex items-center justify-center ">
            <Image src={partnerUniversityIcon} width={14} height={18} alt="partner university" />
          </div>
          <p className="text-white font-poppins text-2xs font-semibold leading-none">Partner University</p>
          <div className="flex-1 border-t border-dashed border-white/30" />
        </div>
      )}
      <Image
        src={imageSrc}
        width={330}
        height={240}
        objectPosition="center"
        alt={'university'}
        className={`h-60 w-full object-cover object-top bg-neutral-200 ${isPartnerUniversity ? '' : 'rounded-t-lg'}`}
        onError={() => setImageSrc(universityPlaceholder)}
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8/B8AAtsA5tSY3jYAAAAASUVORK5CYII="
      />
      <div className={`w-full p-3 bg-neutral-200 relative flex items-center gap-4 h-14 ${isPartnerUniversity ? '' : 'rounded-b-lg'}`}>
        <Image
          src={logoSrc}
          width={62}
          height={62}
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
