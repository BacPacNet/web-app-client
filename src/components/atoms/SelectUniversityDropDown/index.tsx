'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { useUniversitySearch } from '@/services/universitySearch'
import ImagePlaceholder from '@assets/unibuzz-orange.png'
import { Spinner } from '@/components/spinner/Spinner'

interface SelectDropdownProps {
  onChange: (value: string) => void
  value: string
  placeholder?: string
  icon: string
  search?: boolean
  err: boolean
  label?: string
}

const motionStyle = {
  initial: { opacity: 0, y: '-10%' },
  animate: { opacity: 1, y: '5%' },
  exit: { opacity: 0, y: '-10%', transition: { duration: 0.35 } },
  transition: { type: 'spring', stiffness: 100, duration: 0.75 },
}
const SelectUniversityDropdown = ({ onChange, value, placeholder, icon, search = false, err, label }: SelectDropdownProps) => {
  const [show, setShow] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { data: universities, isFetching } = useUniversitySearch(searchTerm || ' ')
  const handleSelect = (optionValue: any) => {
    onChange(optionValue)
    setShow(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShow(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <motion.div ref={dropdownRef} className="relative">
      <p className="text-xs text-neutral-700 font-medium mb-2">{label}</p>
      <div
        onClick={() => setShow(!show)}
        className={`${
          err ? 'border-red-400' : 'border-neutral-200'
        } flex justify-between items-center py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm  text-neutral-400 h-10 outline-none`}
      >
        <p className={`${value ? 'text-neutral-900' : 'text-neutral-400'} text-xs line-clamp-1`}> {value || placeholder}</p>
        <div>
          {icon == 'single' ? (
            <IoIosArrowDown />
          ) : (
            <div className="flex flex-col text-xs">
              <IoIosArrowUp />
              <IoIosArrowDown />
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            className="flex flex-col  gap-2 w-full absolute right-0  bg-white p-2 shadow-lg border border-neutral-200 rounded-lg z-10 max-h-52 overflow-y-scroll"
            {...motionStyle}
          >
            {search && (
              <input
                type="text"
                className="py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm border-neutral-200 text-neutral-700 h-10 outline-none"
                ref={searchRef}
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            {universities?.result?.length > 0 ? (
              universities?.result?.map((item: any, key: number) => (
                <div
                  className={`${
                    key === 0 ? '' : 'border-t'
                  } border-neutral-300 text-sm text-neutral-900 p-2 cursor-pointer hover:bg-gray-200 flex gap-3 items-center`}
                  onClick={() => handleSelect(item)}
                  key={key}
                >
                  <img
                    className="rounded-full"
                    style={{ width: '40px', height: '40px' }}
                    alt="logo"
                    src={item?.logos?.[0] || (ImagePlaceholder as unknown as string)}
                  />
                  <p className="text-2xs"> {item?.name}</p>
                </div>
              ))
            ) : isFetching ? (
              <div className="w-full flex justify-center">
                <Spinner />
              </div>
            ) : (
              <p className="text-neutral-500 p-2">No results found</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SelectUniversityDropdown
