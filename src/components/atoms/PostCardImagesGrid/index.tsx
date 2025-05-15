import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { PostType } from '@/types/constants'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { FiDownload, FiFile } from 'react-icons/fi'

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

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

const getMimeTypeFromUrl = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'heic':
      return 'image/heic'
    case 'heif':
      return 'image/heif'
    default:
      return 'other'
  }
}

const DynamicImageContainer = ({ images, isComment = false }: props) => {
  const imageList = images?.map((imageItem) => imageItem.imageUrl) || []
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setTimeout(() => setKey(key + 1))
  }, [isOpen])

  const handleImageClick = (index: number) => {
    setPhotoIndex(index)
    setIsOpen(true)
  }

  const getGridTemplate = () => {
    const imageCount = images?.length
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
          {images.slice(0, 4).map((item, index) => {
            const mimeType = getMimeTypeFromUrl(item.imageUrl)
            const isImage = imageMimeTypes.includes(mimeType)

            if (isImage) {
              return (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center ${
                    images.length === 1 ? 'w-full max-h-[500px]' : 'h-48 w-full'
                  }`}
                >
                  <Image
                    src={item.imageUrl}
                    alt={`Image ${index + 1}`}
                    width={500}
                    height={500}
                    className={`w-full h-full cursor-pointer ${images.length === 1 ? 'object-contain' : 'object-cover'}`}
                    onClick={() => handleImageClick(index)}
                  />

                  {images.length > 4 && index === 3 && (
                    <div className="absolute bg-black bg-opacity-60 w-full h-full top-0 left-0 rounded-xl flex items-center justify-center text-white text-xl font-semibold">
                      +{images.length - 4}
                    </div>
                  )}
                </div>
              )
            }

            // Non-image fallback
            return (
              <div
                key={index}
                className="border border-neutral-200 rounded-lg bg-white p-2 sm:p-4 flex items-center gap-2 shadow-sm hover:shadow-card cursor-pointer duration-300 delay-100"
              >
                <FiFile className="text-primary flex-none text-sm sm:text-lg" />
                <p className="text-2xs sm:text-xs font-normal text-primary  line-clamp-1 ">{decodeURI(item.imageUrl.split('/').pop() as string)}</p>
                <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-primary-600 text-sm underline">
                  <FiDownload className="text-neutral-500 text-sm sm:text-[24px] flex-none" />
                </a>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default DynamicImageContainer
