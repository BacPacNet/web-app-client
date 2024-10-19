import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import './index.css'

// import required modules
import { Keyboard, Pagination, Navigation } from 'swiper/modules'
import Image from 'next/image'

type prop = {
  images: { imageUrl: string }[]
  initialSlide: number | null
  messageImage?: boolean
}

export default function PostImageSlider({ images, initialSlide, messageImage }: prop) {
  return (
    <div className={`z-40 fixed ${messageImage ? 'w-full h-[400px]' : 'w-[60%] h-3/6'}  top-1/4  `}>
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
        className="mySwiper "
      >
        {images?.map((item: any) => (
          <SwiperSlide key={item?.imageUrl}>
            {<Image layout="fill" objectFit="cover" objectPosition="center" src={item?.imageUrl} alt="item" />}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
