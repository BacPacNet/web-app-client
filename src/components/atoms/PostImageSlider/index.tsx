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
}

export default function PostImageSlider({ images, initialSlide }: prop) {
  return (
    <div className="z-40 fixed w-[60%] top-1/4 h-3/6 ">
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
