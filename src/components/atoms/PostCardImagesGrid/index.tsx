import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { FiFile } from 'react-icons/fi'
import { PostType } from '@/types/constants'
import { getMimeTypeFromUrl, imageMimeTypes } from '@/lib/utils'

type Props = {
  images: {
    imageUrl: string
  }[]
  setImageCarasol?: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean
      images: any
      currImageIndex: number | null
    }>
  >
  idx?: number
  type?: PostType.Community | PostType.Timeline
  isComment?: boolean
}

const DynamicImageContainer: React.FC<Props> = ({ images, isComment = false }) => {
  const imageItems = images?.filter((item) => imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl))) || []
  const fileItems = images?.filter((item) => !imageMimeTypes.includes(getMimeTypeFromUrl(item.imageUrl))) || []

  const imageList = imageItems.map((image) => image.imageUrl)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [key, setKey] = useState(0)

  useEffect(() => {
    setTimeout(() => setKey((prev) => prev + 1))
  }, [isOpen])

  const handleImageClick = (index: number) => {
    setPhotoIndex(index)
    setIsOpen(true)
  }

  const getGridTemplate = () => {
    const count = imageItems.length
    if (count === 3) return 'grid-cols-2 gap-2 auto-rows-fr'
    if (count === 4) return 'grid-cols-2 grid-rows-2 gap-2'
    if (count === 2) return 'grid-cols-2 gap-2'
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

      {imageItems.length > 0 && (
        <div className={`grid ${getGridTemplate()} ${isComment ? 'w-6/12 max-h-[500px]' : 'w-full max-w-2xl mx-auto'} mt-4`}>
          {imageItems.slice(0, 4).map((item, index) => {
            const isThreeImageLayout = imageItems.length === 3
            let customClasses = ''

            if (isThreeImageLayout) {
              if (index === 0) customClasses = 'row-span-2 h-full' // Left large image
              if (index === 1 || index === 2) customClasses = 'h-full'
            }

            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center ${
                  isThreeImageLayout ? customClasses : imageItems.length === 1 ? 'w-full max-h-[500px]' : 'h-48 w-full'
                }`}
              >
                <Image
                  src={item.imageUrl}
                  alt={`Image ${index + 1}`}
                  width={500}
                  height={500}
                  className={`w-full h-full cursor-pointer ${imageItems.length === 1 ? 'object-contain' : 'object-cover'}`}
                  onClick={() => handleImageClick(index)}
                />
              </div>
            )
          })}
        </div>
      )}

      {fileItems.length > 0 && (
        <div className="space-y-3 w-full">
          {fileItems.map((item, index) => (
            <a key={index} href={item.imageUrl} target="_blank" rel="noopener noreferrer">
              <div className="border border-neutral-200 rounded-lg bg-white px-3 py-6 flex items-center gap-2 shadow-sm hover:shadow-card cursor-pointer transition duration-300">
                <FiFile className="text-primary flex-none text-md" />
                <p className="text-xs font-normal text-primary line-clamp-1 flex-1">{decodeURI(item.imageUrl.split('/').pop() || 'Unknown File')}</p>
                {/*<a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
                <FiDownload className="text-neutral-500 text-xl" />
              </a>*/}
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  )
}

export default DynamicImageContainer
