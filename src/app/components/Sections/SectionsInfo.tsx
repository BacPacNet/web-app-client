'use client'

import './SectionsInfo.css'
import 'aos/dist/aos.css'

import AOS from 'aos'
import Image from 'next/image'
import { useEffect } from 'react'

function SectionsInfo({ item }) {
  useEffect(() => {
    AOS.init({ duration: 300 })
  }, [])

  return (
    <div className={item.reverse === true ? 'part flex flex-row-reverse items-center' : 'part flex items-center'}>
      <div className={item.className} data-aos={item.animation[0]}>
        <Image src={item.image} alt={item.title} className="w-full h-full" />
      </div>
      <div className={item.subClass}>
        <div className="title">{item.title}</div>
        <div className="info">
          <div className={item.subClass == 'appSubClass' ? 'appSubtitle' : 'subtitle'}>{item.subTitle}</div>
          <div className="desc" data-aos={item.animation[1]}>
            {item.desc}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionsInfo
