'use client'
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { useUniversitySearch } from '@/services/universitySearch'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import { Spinner } from '@/components/spinner/Spinner'
import Image from 'next/image'

interface University {
  _id: string
  name: string
  logo?: string | null
}

interface SelectDropdownProps {
  onChange: (value: University) => void
  value: string
  placeholder?: string
  icon: 'single' | 'dual'
  search?: boolean
  err?: boolean
  label?: string
}

const MOTION_STYLE = {
  initial: { opacity: 0, y: '-10%' },
  animate: { opacity: 1, y: '5%' },
  exit: { opacity: 0, y: '-10%', transition: { duration: 0.35 } },
  transition: { type: 'spring', stiffness: 100, duration: 0.75 },
} as const

const SelectUniversityDropdown = ({ onChange, value, placeholder, icon, search = false, err, label }: SelectDropdownProps) => {
  const [show, setShow] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const { data: universitiesData, isLoading } = useUniversitySearch(searchTerm, 1, 10)
  const universities = universitiesData?.result?.universities || []

  // Memoized handlers
  const handleImageError = useCallback((logoUrl: string) => {
    setImageErrors((prev) => new Set(prev).add(logoUrl))
  }, [])

  const getImageSrc = useCallback(
    (item: University) => {
      if (!item?.logo || imageErrors.has(item.logo)) {
        return universityLogoPlaceholder
      }
      return item.logo
    },
    [imageErrors]
  )

  const handleSelect = useCallback(
    (optionValue: University) => {
      onChange(optionValue)
      setShow(false)
    },
    [onChange]
  )

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const toggleDropdown = useCallback(() => {
    setShow((prev) => !prev)
  }, [])

  // Memoized computed values
  const dropdownClassName = useMemo(
    () =>
      `${
        err ? 'border-red-400' : 'border-neutral-200'
      } flex justify-between items-center py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm text-neutral-400 h-10 outline-none cursor-pointer`,
    [err]
  )

  const valueClassName = useMemo(() => `${value ? 'text-neutral-900' : 'text-neutral-400'} text-sm line-clamp-1 font-normal`, [value])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShow(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (show && search && searchRef.current) {
      searchRef.current.focus()
    }
  }, [show, search])

  // Memoized university list
  const universityList = useMemo(
    () =>
      universities.map((item: University, key: number) => (
        <div
          key={item._id}
          className={`${
            key === 0 ? '' : 'border-t'
          } border-neutral-300 text-sm text-neutral-900 p-2 cursor-pointer hover:bg-gray-200 flex gap-3 items-center transition-colors duration-150`}
          onClick={() => handleSelect(item)}
        >
          <Image
            className="rounded-full object-contain"
            width={40}
            height={40}
            alt={`${item.name} logo`}
            src={getImageSrc(item)}
            onError={() => handleImageError(item?.logo || '')}
            unoptimized={!item?.logo}
            priority={key < 3} // Prioritize first 3 images
          />
          <p className="text-2xs font-medium"> {item.name}</p>
        </div>
      )),
    [universities, handleSelect, getImageSrc, handleImageError]
  )

  return (
    <motion.div ref={dropdownRef} className="relative">
      {label && <p className="text-xs text-neutral-700 font-medium mb-2">{label}</p>}

      <div
        onClick={toggleDropdown}
        className={dropdownClassName}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleDropdown()
          }
        }}
      >
        <p className={valueClassName}> {value || placeholder}</p>
        <div>
          {icon === 'single' ? (
            <IoIosArrowDown className="transition-transform duration-200" />
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
            className="flex flex-col gap-2 w-full absolute right-0 bg-white p-2 shadow-lg border border-neutral-200 rounded-lg z-10 max-h-52 overflow-y-scroll"
            {...MOTION_STYLE}
          >
            {search && (
              <input
                type="text"
                className="py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm border-neutral-200 text-neutral-700 h-10 outline-none"
                ref={searchRef}
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            )}

            {universities.length > 0 ? (
              universityList
            ) : isLoading ? (
              <div className="w-full flex justify-center py-4">
                <Spinner />
              </div>
            ) : (
              <p className="text-neutral-500 p-2 text-center">No results found</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SelectUniversityDropdown
