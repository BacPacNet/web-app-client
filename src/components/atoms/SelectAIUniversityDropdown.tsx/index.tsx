'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

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
          className={`flex flex-col  custom-scrollbar  
        gap-2  p-2
     absolute   bg-white  shadow-lg border border-neutral-200 rounded-lg z-10 max-h-52 w-52 overflow-y-auto`}
          {...motionStyle}
        >
          {data?.map((item: any) => (
            <div onClick={() => handleClick(item)} key={item?._id} className="flex items-center gap-2 text-2xs py-2 cursor-pointer">
              <Image width={20} height={20} src={item?.communityLogoUrl?.imageUrl} alt={item?.name} />
              <p>{item?.name}</p>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SelectAIUniversityDropdown
