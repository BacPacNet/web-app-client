import React from 'react'
import Image from 'next/image'
import { PostType } from '@/types/constants'

type props = {
  images: {
    imageUrl: string
  }[]
  setImageCarasol: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean
      images: any
      currImageIndex: number | null
    }>
  >
  idx: number
  type?: PostType.Community | PostType.Timeline
}

const DynamicImageContainer = ({ images, setImageCarasol }: props) => {
  const imageCount = images?.length

  if (imageCount == 0) {
    return <div></div>
  }

  const handleImageClick = (index: number) => {
    setImageCarasol({
      isShow: true,
      images: images,
      currImageIndex: index,
    })
  }
  const getGridTemplate = () => {
    switch (imageCount) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-2'
      case 3:
        return 'grid-cols-2 grid-rows-2'
      case 4:
        return 'grid-cols-3 grid-rows-2'
      default:
        return 'grid-cols-3 grid-rows-2'
    }
  }

  return (
    <div className={`grid gap-2 ${getGridTemplate()} w-full h-80 mx-auto mt-4`}>
      {images?.slice(0, 4).map((src, index) => (
        <div
          key={index}
          className={`relative overflow-hidden flex ${imageCount == 1 && 'h-80'} ${imageCount == 2 && 'h-80'} ${
            imageCount === 3 && index === 2 && 'col-span-2 '
          } ${imageCount === 4 && index === 2 ? 'row-span-2 ' : ''}  ${imageCount >= 4 && index === 2 && 'row-span-2  '} ${
            imageCount >= 4 && index === 3 && 'col-span-2  '
          }  `}
          onClick={() => handleImageClick(index)}
        >
          <Image
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            key={index}
            src={src.imageUrl}
            alt={`Image ${index + 1}`}
            className="rounded-xl"
          />
          {imageCount > 4 && index == 2 && (
            <div className="absolute bg-slate-50 shadow-lg w-40 h-40 -right-10 -bottom-10 rounded-full text-neutral-700 flex items-center justify-center">
              +{imageCount - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default DynamicImageContainer
