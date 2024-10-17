'use client'
import { UniversityInfo } from '@/types/University'
import ImagePlaceholder from '@assets/unibuzz-orange.png'

import React, { useEffect } from 'react'

export default function UniversityProfile({ searchParams }: any) {
  const university = JSON.parse(searchParams.search) as UniversityInfo

  return (
    <div className="p-28 ">
      <div className="flex gap-16">
        <div className="flex-1">
          <div className="flex items-center gap-9 py-4">
            <div className="flex justify-center items-center p-6 drop-shadow-lg rounded-full bg-white">
              <img
                width={46}
                height={46}
                src={university?.logos?.[0] || (ImagePlaceholder as unknown as string)}
                alt="logo"
                className="max-w-full max-h-40 object-contain"
              />
            </div>

            <p className="text-neutral-900 text-lg font-extrabold">{university?.name}</p>
          </div>
          <p className={`text-neutral-500 text-xs line-clamp-6`}>{university?.topUniInfo?.about}</p>
        </div>
        <div className="flex-1 flex justify-center">
          <img className="rounded-lg max-w-full  object-contain" src={university?.images[0]} alt="university_image" />
        </div>
      </div>
    </div>
  )
}
