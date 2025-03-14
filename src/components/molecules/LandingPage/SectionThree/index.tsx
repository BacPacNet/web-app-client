import Image from 'next/image'
import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import section3 from '@assets/section-3.svg'
import lightningIcon from '@assets/lightningIcon.svg'

export default function SectionThree() {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between my-20 gap-14  px-4 sm:px-24 lg:px-0">
      <div className="lg:w-1/2 flex flex-col items-center sm:items-start text-center sm:text-left justify-start h-full gap-6">
        <div className="flex gap-1 bg-surface-primary-50 rounded-full py-1 px-4 w-fit ">
          <Image width={18} height={18} src={lightningIcon} alt={lightningIcon} />
          <p className="text-primary-500">Connect</p>
        </div>
        <div>
          <p className="font-poppins text-sm sm:text-[32px] font-normal tracking-tighter ">
            Courses, clubs, circles and more. Join all the groups imaginable.
          </p>
          <ul className="font-normal text-neutral-700 text-left text-xs sm:text-sm">
            <li className="flex items-center gap-3 my-6">
              <div>
                <FaCheckCircle className="text-[#22C55E] text-md" />
              </div>
              <p>Join university groups or create your own</p>
            </li>
            <li className="flex gap-3 my-5">
              <div>
                <FaCheckCircle className="text-[#22C55E] text-md" />
              </div>
              <p>Distinguish between university approved groups and casual groups</p>
            </li>
            <li className="flex gap-3 my-5">
              <div>
                <FaCheckCircle className="text-[#22C55E] text-md" />
              </div>
              <p>All social networking done within these groups</p>
            </li>
          </ul>
        </div>
      </div>
      <div className="lg:w-1/2">
        <Image width={650} height={650} src={section3} alt={section3} className="shadow-xl object-contain" />
      </div>
    </div>
  )
}
