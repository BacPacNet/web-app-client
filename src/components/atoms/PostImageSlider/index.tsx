import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import { RxCross2 } from 'react-icons/rx'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import './index.css'

// import required modules
import { Keyboard, Pagination, Navigation } from 'swiper/modules'
import Image from 'next/image'
import { closeImageModal } from '@/components/molecules/ImageWrapper/ImageManager'

type prop = {
  images: { imageUrl: string }[]
  initialSlide: number | null
  messageImage?: boolean
}

export default function PostImageSlider({ images, initialSlide, messageImage }: prop) {
  return (
    <div className={` w-1/2 h-1/2 max-sm:w-11/12 max-sm:h-5/6  relative`}>
      <p className="bg-white rounded-full self-end w-max absolute z-50 right-2 top-2 text2xs p-1" onClick={() => closeImageModal()}>
        <RxCross2 />
      </p>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        keyboard={{
          enabled: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Keyboard, Navigation]}
        initialSlide={initialSlide || 0}
        className="mySwiper rounded-xl"
      >
        {images?.map((item: any) => (
          <SwiperSlide key={item?.imageUrl}>
            {<Image layout="fill" objectFit="contain" objectPosition="center" src={item?.imageUrl} alt="item" className="bg-neutral-800" />}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
