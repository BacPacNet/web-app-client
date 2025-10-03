'use client'
import React, { useEffect, useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import universityPlaceholder from '@assets/university_banner.svg'

interface Props {
  imageUrl: string | StaticImageData
}

const CoverImageUploader: React.FC<Props> = ({ imageUrl }) => {
  const [coverSrc, setCoverSrc] = useState(imageUrl || universityPlaceholder.src)

  useEffect(() => {
    setCoverSrc(imageUrl || universityPlaceholder.src)
  }, [imageUrl])
  return (
    <div className="relative h-[164px] w-full overflow-hidden rounded-t-2xl mt-4 group">
      <Image
        src={coverSrc}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        alt="Cover Image"
        className="h-full w-full object-cover object-top"
        onError={() => setCoverSrc(universityPlaceholder.src)}
      />
    </div>
  )
}

export default CoverImageUploader
