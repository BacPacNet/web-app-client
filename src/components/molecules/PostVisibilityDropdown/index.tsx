'use client'

import { POST_VISIBILITY_LABELS, UserPostType } from '@/types/constants'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

interface PostVisibilityDropdownProps {
  value: UserPostType
  onChange: (value: UserPostType) => void
  options: UserPostType[]
}

function PostVisibilityDropdown({ value, onChange, options }: PostVisibilityDropdownProps) {
  const [show, setShow] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShow(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: UserPostType) => {
    onChange(option)
    setShow(false)
  }

  return (
    <motion.div ref={dropdownRef} className="relative cursor-pointer">
      <div
        onClick={() => setShow((prev) => !prev)}
        className="h-10 flex items-center gap-1 px-3 py-2 bg-surface-primary-50 rounded-lg text-primary-500 text-sm font-normal whitespace-nowrap"
      >
        <span>Visibility: {POST_VISIBILITY_LABELS[value]}</span>
        <IoIosArrowDown className="text-primary-500" />
      </div>
      <AnimatePresence>
        {show && (
          <motion.div className="absolute right-0 top-full mt-1 bg-white shadow-lg border border-neutral-200 rounded-lg z-10 min-w-[140px] py-1">
            {options.map((option) => (
              <div
                key={option}
                className="text-sm text-neutral-700 px-4 py-2 cursor-pointer hover:bg-neutral-100"
                onClick={() => handleSelect(option)}
              >
                {POST_VISIBILITY_LABELS[option]}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PostVisibilityDropdown
