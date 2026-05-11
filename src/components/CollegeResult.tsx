import './CollegeResult.css'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import { UniversityInfo } from '@/types/University'

const CollegeResult = ({ university }: { university: UniversityInfo }) => {
  const [logoSrc, setLogoSrc] = useState(university?.logo || universityLogoPlaceholder)

  useEffect(() => {
    setLogoSrc(university?.logo || universityLogoPlaceholder)
  }, [university, universityLogoPlaceholder])

  return (
    <div className="">
      <div className="py-2 px-4 flex gap-5 items-center w-full justify-start">
        <div className="w-8 h-8 rounded-full flex justify-center align-middle shadow-lg">
          <Image
            className="object-contain rounded-full w-auto h-auto"
            width={32}
            height={32}
            alt=""
            src={logoSrc}
            onError={() => setLogoSrc(universityLogoPlaceholder)}
          />
        </div>
        <p className="w-4/5 line-clamp-1 text-neutral-700 text-left">{university?.name || university?.UniversityName}</p>
        {/*<div className="score w-1/6 flex justify-center align-middle text-black">{university?.score}</div>*/}
      </div>
    </div>
  )
}

export default CollegeResult
