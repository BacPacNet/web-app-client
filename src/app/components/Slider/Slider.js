'use client'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import './Slider.css'
import 'aos/dist/aos.css'

import { EffectCoverflow, Navigation, Pagination } from 'swiper/modules'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import Image from 'next/image'
import arrow from '../../../assets/arrow.png'
import f1 from '../../../assets/Organized Group Feature.png'
import f2 from '../../../assets/chatBot.png'
import f3 from '../../../assets/connectionFeature.png'
import nextarrow from '../../../assets/right.png'

export default function Slider() {
  const [description, setDescription] = useState('')

  const featureInfo = [
    {
      id: 0,
      featureName: 'group feature',
      imgUrl: f1,
      desc: 'Create and organize all your university-related groups in your university’s dedicated community page. ',
    },
    {
      id: 1,
      featureName: 'chatBot feature',
      imgUrl: f2,
      desc: 'feature 2 description',
    },
    {
      id: 2,
      featureName: 'connection feature',
      imgUrl: f3,
      desc: 'feature 3 description',
    },
    {
      id: 3,
      featureName: 'chatBot feature',
      imgUrl: f2,
      desc: 'feature 2 description',
    },
  ]
  const handleSlideChange = (item) => {
    const imgIndex = item.realIndex
    setDescription(featureInfo[imgIndex].desc)
  }
  return (
    <Swiper
      data-aos="fade-up"
      data-aos-duration="500"
      effect={'coverflow'}
      // grabCursor={true}
      // onSlideChange={handleSlideChange}
      centeredSlides={true}
      loop={true}
      slidesPerView={'auto'}
      onSnapIndexChange={handleSlideChange}
      coverflowEffect={{
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2.5,
      }}
      pagination={{ el: '.swiper-pagination', clickable: true }}
      navigation={{
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
        clickable: true,
      }}
      modules={[EffectCoverflow, Pagination, Navigation]}
      className="swiper_container"
    >
      {featureInfo.map((feature, index) => (
        <SwiperSlide key={index}>
          {({ isActive }) => (
            <div className={isActive ? 'active-img' : 'not-active-img'}>
              <Image src={feature.imgUrl} alt={`slide_image_${index}`} className="img" />
            </div>
          )}
        </SwiperSlide>
      ))}
      <div className="slider-controler">
        <div className="slider-btn">
          <div className="swiper-button-prev slider-arrow">
            <Image src={arrow} name="arrow-back-outline" className="ion-icon swiper-button-prev" alt="prev" />
          </div>
          <div className="swiper-button-next slider-arrow">
            <Image src={nextarrow} name="arrow-forward-outline" className="ion-icon swiper-button-next" alt="next" />
          </div>
        </div>
        <div className="swiper-pagination"></div>
        <div className="description" data-aos="fade-left">
          <p className="animated-description">{description}</p>
        </div>
      </div>
    </Swiper>
  )
}
