'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

type Props = {
  images: {
    imageUrl: string
  }[]
}

const UserMessageImageGrid: React.FC<Props> = ({ images }) => {
  const imageList = images.map((imageItem) => imageItem.imageUrl)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const gridColsClass = images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
  const imageFitClass = images.length === 1 ? 'object-contain' : 'object-cover'

  const handleImageClick = (index: number) => {
    setPhotoIndex(index)
    setIsOpen(true)
  }

  return (
    <>
      {isOpen && (
        <Lightbox
          mainSrc={imageList[photoIndex]}
          nextSrc={imageList[(photoIndex + 1) % imageList.length]}
          prevSrc={imageList[(photoIndex + imageList.length - 1) % imageList.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + imageList.length - 1) % imageList.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % imageList.length)}
        />
      )}

      <div className={`grid ${gridColsClass} gap-2 p-2`}>
        {images.length === 3 ? (
          <>
            <div
              className="relative row-span-2 w-full h-full min-h-[290px] bg-neutral-300 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => handleImageClick(0)}
            >
              <Image fill className={`rounded-lg ${imageFitClass}`} src={images[0].imageUrl} alt={`university_image_0`} />
            </div>
            <div
              className="relative w-full h-[140px] sm:h-[160px] bg-neutral-300 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => handleImageClick(1)}
            >
              <Image fill className="rounded-lg object-cover" src={images[1].imageUrl} alt={`university_image_1`} />
            </div>
            <div
              className="relative w-full h-[140px] sm:h-[160px] bg-neutral-300 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => handleImageClick(2)}
            >
              <Image fill className="rounded-lg object-cover" src={images[2].imageUrl} alt={`university_image_2`} />
            </div>
          </>
        ) : (
          images.map((src, index) => (
            <div
              key={index}
              className="relative w-full h-[250px] sm:h-[290px] bg-neutral-300 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <Image fill className={`rounded-lg ${imageFitClass}`} src={src.imageUrl} alt={`university_image_${index}`} />
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default UserMessageImageGrid
