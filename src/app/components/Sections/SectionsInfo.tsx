'use client'

import './SectionsInfo.css'
import 'aos/dist/aos.css'

import AOS from 'aos'
import Image from 'next/image'
import { StaticImageData } from 'next/image'
import { useEffect } from 'react'

interface SectionItem {
  title: string
  subTitle: string
  desc: string
  image: StaticImageData
  className: string
  subClass: string
  animation: string[]
  reverse: boolean
}
interface SectionsInfoProps {
  item: SectionItem
}
function SectionsInfo({ item }: SectionsInfoProps) {
  useEffect(() => {
    AOS.init({ duration: 300 })
  }, [])

  return (
    <div className={item.reverse === true ? 'part flex flex-row-reverse items-center' : 'part flex items-center'}>
      <div className={item.className} data-aos={item.animation[0]} data-aos-duration="500" data-aos-easing="ease-in">
        <Image src={item.image} alt={item.title} className="w-full h-full" />
      </div>
      <div className={item.subClass}>
        <div className="title">{item.title}</div>
        <div className="info" data-aos={item.animation[1]}>
          <div className={item.subClass == 'appSubClass' ? 'appSubtitle' : 'subtitle'}>{item.subTitle}</div>
          <div className="desc">{item.desc}</div>
        </div>
      </div>
    </div>
  )
}

export default SectionsInfo
