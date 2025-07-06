import Image from 'next/image'
import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import lightningIcon from '@assets/lightningIcon.svg'
import aiAssistantUI from '@assets/aiAssistantUI.svg'
import { BsStars } from 'react-icons/bs'

export default function SectionFive() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between mb-32  md:mb-[192px] lg:gap-8 gap-12 px-4  lg:px-0">
      <div className="lg:w-1/2 flex flex-col  sm:items-start  sm:text-left justify-start h-full gap-6">
        <div className="flex gap-1 bg-surface-primary-50 rounded-full py-1 px-4 w-fit ">
          <Image width={18} height={18} src={lightningIcon} alt={lightningIcon} />
          <p className="text-primary-500">Elevate</p>
        </div>
        <div>
          <h5 className="font-poppins text-[20px] sm:text-md font-semibold text-neutral-700 tracking-tighter ">
            Use our AI assistant among other features to enrich your university life.
          </h5>
          <ul className="font-normal text-left text-xs sm:text-sm">
            <li className="flex items-center gap-3 my-6">
              <div>
                <FaCheckCircle className="text-[#22C55E] text-md" />
              </div>
              <p>AI assistant that answers all questions related to your university</p>
            </li>
            <li className="flex gap-3 my-5">
              <div>
                <BsStars className="text-primary-500 text-md" />
              </div>
              <p>
                <b>Upcoming: </b>LaTeX syntax for academic for communication of scientific documents and technical note-taking
              </p>
            </li>
            <li className="flex gap-3 my-5">
              <div>
                <BsStars className="text-primary-500 text-md" />
              </div>
              <p>
                <b>Upcoming: </b> Move up to 5gb of files within platform for ebooks, research data, etc
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="lg:w-1/2">
        <Image className="shadow-xl" width={650} height={650} src={aiAssistantUI} alt={aiAssistantUI} />
      </div>
    </div>
  )
}
