import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { PostType } from '@/types/constants'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

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
  isComment?: boolean
}

const DynamicImageContainer = ({ images, setImageCarasol, isComment = false }: props) => {
  const imageList = images?.map((imageItem) => imageItem.imageUrl) || []
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setTimeout(() => setKey(key + 1))
  }, [isOpen])

  const imageCount = images?.length

  if (imageCount === 0) {
    return null
  }

  const handleImageClick = (index: number) => {
    setPhotoIndex(index)
    setIsOpen(true)
  }

  const getGridTemplate = () => {
    if (imageCount === 4) return 'grid-cols-2 grid-rows-2'
    if (imageCount === 3) return 'grid-cols-2 grid-rows-2'
    if (imageCount === 2) return 'grid-cols-2'
    return 'grid-cols-1'
  }

  return (
    <>
      {isOpen && (
        <Lightbox
          key={key}
          mainSrc={imageList[photoIndex]}
          nextSrc={imageList[(photoIndex + 1) % imageList.length]}
          prevSrc={imageList[(photoIndex + imageList.length - 1) % imageList.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + imageList.length - 1) % imageList.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % imageList.length)}
        />
      )}

      {images && (
        <div className={`grid gap-2 ${getGridTemplate()} ${isComment ? 'w-6/12 max-h-[500px]' : 'w-full max-w-2xl mx-auto'} mt-4`}>
          {images.slice(0, 4).map((src, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center 
                ${imageCount === 1 ? 'w-full max-h-[500px]' : 'h-48 w-full'}`}
            >
              <Image
                src={src.imageUrl}
                alt={`Image ${index + 1}`}
                width={500}
                height={500}
                className={`w-full h-full cursor-pointer ${imageCount === 1 ? 'object-contain' : 'object-cover'}`}
                onClick={() => handleImageClick(index)}
              />

              {imageCount > 4 && index === 3 && (
                <div className="absolute bg-black bg-opacity-60 w-full h-full top-0 left-0 rounded-xl flex items-center justify-center text-white text-xl font-semibold">
                  +{imageCount - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default DynamicImageContainer
