import Image from 'next/image'
import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import lightningIcon from '@assets/lightningIcon.svg'
import section5 from '@assets/section-5.svg'

export default function SectionFive() {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between my-20 gap-14">
      <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left justify-start h-full gap-6">
        <div className="flex gap-1 bg-surface-primary-50 rounded-full py-1 px-4 w-fit ">
          <Image width={18} height={18} src={lightningIcon} alt={lightningIcon} />
          <p className="text-primary-500">Elevate</p>
        </div>
        <div>
          <p className="font-poppins text-sm lg:text-[32px] font-normal tracking-tighter ">
            Use our AI assistant among other features to enrich your university life.
          </p>
          <ul className="font-normal text-left text-xs lg:text-sm">
            <li className="flex items-center gap-3 my-6">
              <div>
                <FaCheckCircle className="text-[#22C55E] text-md" />
              </div>
              <p>AI assistant that answers all questions related to your university</p>
            </li>
            <li className="flex gap-3 my-5">
              <div>
                <FaCheckCircle className="text-[#22C55E] text-md" />
              </div>
              <p>LaTeX syntax for academic for communication of scientific documents and technical note-taking</p>
            </li>
            <li className="flex gap-3 my-5">
              <div>
                <FaCheckCircle className="text-[#22C55E] text-md" />
              </div>
              <p>Move up to 5gb of files within platform for ebooks, research data, etc</p>
            </li>
          </ul>
        </div>
      </div>
      <div className="lg:w-1/2">
        <Image className="shadow-xl" width={650} height={650} src={section5} alt={section5} />
      </div>
    </div>
  )
}
