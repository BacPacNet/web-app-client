import Image from 'next/image'
import React from 'react'
import section4 from '@assets/section-4.svg'
import lightningIcon from '@assets/lightningIcon.svg'
import { FaCheckCircle } from 'react-icons/fa'

export default function SectionFour() {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between mb-32  md:mb-[192px] lg:gap-8 gap-12 px-4  lg:px-0">
      <div className="lg:w-1/2">
        <Image className="shadow-xl" width={650} height={650} src={section4} alt={section4} />
      </div>
      <div className="lg:w-1/2 flex flex-col  sm:items-start  sm:text-left justify-start h-full gap-6">
        <div className="flex gap-1 bg-surface-primary-50 rounded-full py-1 px-4 w-fit ">
          <Image width={18} height={18} src={lightningIcon} alt={lightningIcon} />
          <p className="text-primary-500">Collaborate</p>
        </div>
        <div>
          <h5 className="font-poppins text-[20px] sm:text-md font-semibold text-neutral-700 tracking-tighter ">
            Create new connections and freely message with others.
          </h5>
          <ul className="font-normal text-neutral-700 text-left text-xs sm:text-sm">
            <li className="flex items-center gap-3 my-6">
              <div>
                <FaCheckCircle className="text-[#22C55E] text-md" />
              </div>
              <p>Private messages, group messages, and forum posts</p>
            </li>
            <li className="flex gap-3 my-5">
              <div>
                <FaCheckCircle className="text-[#22C55E] text-md" />
              </div>
              <p>Connect with people you know and keep up with their university life</p>
            </li>
            <li className="flex gap-3 my-5">
              <div>
                <FaCheckCircle className="text-[#22C55E] text-md" />
              </div>
              <p>Edit your profile to your liking; university life is a fresh start</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
