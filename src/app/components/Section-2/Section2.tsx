'use client'

import './Section2.css'
import 'aos/dist/aos.css'

import { useEffect, useState } from 'react'

import AOS from 'aos'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation'
import banner from '../../../assets/instituteBanner.png'
import magnifier from '../../../assets/magnifier.png'
import picture from '../../../assets/Section Image.png'
import sectionNumber from '../../../assets/Number2.png'
import users from '../../../assets/users.png'

function Section2() {
  const [typingStart, setTypingStart] = useState(false)
  useEffect(() => {
    try {
      AOS.init({ duration: 300 })
      setTypingStart(true)
    } catch (e) {
      console.log('error')
    }
  }, [])
  return (
    <div className="section-2 bg-white flex flex-col items-center">
      <div className="heading flex justify-center flex-col items-center mt-4">
        <Image src={sectionNumber} alt="1" className=" w-14 h-10" />
        <h3 className="font-inter font-extrabold text-4xl leading-12 tracking-tight text-center text-[#171717]">Join your institute</h3>
      </div>
      <div className="part-1 mt-24 flex">
        <div className="left" data-aos="fade-bottom">
          <Image src={picture} alt="l" className="picture absolute" />
          <Image src={magnifier} alt="l" className="magnifier relative" />
        </div>
        <div className="right-sec2" data-aos="fade-right">
          <div className="h1 text-4xl font-extrabold">One click to join</div>
          <div className="desc">
            After searching for the institution you&apos;re interested in, click &apos;Join&apos; to become part of the university&apos;s group. This
            grants you access to the university page and its full range of features. Join now to seamlessly explore and engage with the university
            community.
          </div>
        </div>
      </div>
      <div className="college-info flex flex-col items-center">
        <div className="h2">
          {typingStart && (
            <TypeAnimation
              style={{ whiteSpace: 'pre-line', display: 'block', fontSize: '44px' }}
              className="typing-effect hp1"
              cursor={false}
              sequence={[1000, 'Connect, Collaborate, and Elevate']}
              speed={60}
              repeat={0}
            />
          )}
          <p className="hp2">Enhanced Academic Communication with Unibuzz</p>
        </div>
        <div className="college-pic mt-6 flex flex-col items-center">
          <Image src={banner} alt="Unibuzz College" className="pic-1" />
          <Image src={users} alt="users" className="pic-2" />
        </div>
      </div>
    </div>
  )
}

export default Section2
