'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import ImagePlaceholder from '@assets/unibuzz-orange.png'

type dataType = {
  _id: string
  communityLogoUrl: {
    imageUrl: string
  }
  name: string
}

type Props = {
  setSelectedUniversity: (value: dataType) => void
  setShow: (value: boolean) => void
  show: boolean
  data: dataType[]
}

const motionStyle = {
  initial: { opacity: 0, y: '-10%' },
  animate: { opacity: 1, y: '5%' },
  exit: { opacity: 0, y: '-10%', transition: { duration: '0.35' } },
  transition: { type: 'spring', stiffness: '100', duration: '0.75' },
}

const SelectAIUniversityDropdown = ({ data, show, setShow, setSelectedUniversity }: Props) => {
  const handleClick = (item: dataType) => {
    setShow(false)
    setSelectedUniversity(item)
  }
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`flex flex-col  custom-scrollbar  absolute   bg-white  shadow-lg border border-neutral-200 rounded-lg z-10 max-h-52 w-52 overflow-y-auto`}
          {...motionStyle}
        >
          {data?.map((item: any) => (
            <div
              onClick={() => handleClick(item)}
              key={item?._id}
              className="flex items-center gap-2 text-2xs p-2 cursor-pointer hover:bg-neutral-200"
            >
              <div className="w-5 h-5">
                <Image width={20} height={20} src={item?.communityLogoUrl?.imageUrl || ImagePlaceholder} alt="logo" />
              </div>
              <p>{item?.name}</p>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SelectAIUniversityDropdown
