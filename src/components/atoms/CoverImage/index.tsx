import React from 'react'
import Image, { StaticImageData } from 'next/image'
import universityPlaceholder from '@assets/university_banner.png'

interface Props {
  imageUrl: string | StaticImageData
}

const CoverImageUploader: React.FC<Props> = ({ imageUrl }) => {
  return (
    <div className="relative h-[164px] w-full overflow-hidden rounded-t-2xl mt-4 group">
      <Image
        src={imageUrl || universityPlaceholder}
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        alt="Cover Image"
        className="h-full w-full object-cover object-top"
      />
    </div>
  )
}

export default CoverImageUploader
