'use client'

import './Section2.css'
import 'aos/dist/aos.css'

import BackgroundImg from '@assets/section2bg.png'
import Image from 'next/image'
import Institution from '@assets/institution.png'
import UnibuzzStudent from '@assets/unibuzz-student.png'
import sectionNumber from '@assets/Number2.png'
import { useRef } from 'react'

//import AOS from 'aos'

//import { TypeAnimation } from 'react-type-animation'

const Section2: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <div className="bg-white flex flex-col items-center px-4 md:px-6 lg:px-12 my-4 lg:my-8" ref={sectionRef}>
      <div className="flex justify-center flex-col items-center my-12">
        <Image src={sectionNumber} alt="1" className=" w-14 h-10" />
        <h3 className="font-inter font-extrabold text-2xl lg:text-4xl leading-12 tracking-tight text-center text-[#171717] py-4">
          Join your institute
        </h3>
      </div>
      <div className="flex flex-col items-center lg:items-start lg:flex-row gap-8 lg:gap-[4.25rem]">
        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end">
          <Image src={Institution} alt="l" className="object-cover" />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-4 items-center lg:items-start">
          <div className="h1 text-2xl lg:text-4xl font-extrabold">One click to join</div>
          <div className="text-center lg:text-left  w-full lg:w-3/4 text-sm lg:text-base">
            After searching for the institution you&apos;re interested in, click &apos;Join&apos; to become part of the university&apos;s group. This
            grants you access to the university page and its full range of features. Join now to seamlessly explore and engage with the university
            community.
          </div>
        </div>
      </div>

      <div className="w-full my-16 lg:my-32 flex flex-col items-center gap-[3rem] relative">
        <Image src={BackgroundImg} alt="Unibuzz College" className="absolute" />

        <div>
          <Image src={UnibuzzStudent} alt="Unibuzz College" className="object-cover relative" />
        </div>
        <div className="flex flex-col gap-[1.5rem] items-center relative">
          <h2 className="text-2xl lg:text-4xl font-bold text-center text-gray-900">Connect, Collaborate, and Elevate</h2>
          <p className="text-gray-dark text-center text-2xl lg:text-4xl">Enhanced Academic Communication with Unibuzz</p>
        </div>
      </div>

      {/*<div className="college-info flex flex-col items-center relative">
        <div className="h2">
          {typingStart && (
            <TypeAnimation
              style={{ whiteSpace: 'pre-line', display: 'block' }}
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
      </div>*/}
    </div>
  )
}

export default Section2
