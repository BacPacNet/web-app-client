'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'

interface SelectDropdownProps {
  options: string[]
  onChange: (value: string) => void
  value: string
  placeholder?: string
  icon: string
  search?: boolean
  err: boolean
}
const SelectDropdown = ({ options, onChange, value, placeholder, icon, search = false, err }: SelectDropdownProps) => {
  const [show, setShow] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const searchRef = useRef<HTMLInputElement>(null)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setShow(false)
  }

  const handleSearch = () => {
    const searchValue = searchRef.current?.value.toLowerCase() || ''
    setFilteredOptions(searchValue === '' ? options : options.filter((option: string) => option.toLowerCase().includes(searchValue)))
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
      <div
        onClick={() => setShow(!show)}
        className={`${
          err ? 'border-red-400' : 'border-neutral-200'
        } flex justify-between items-center py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm  text-neutral-400 h-10 outline-none`}
      >
        <p className={`${value ? 'text-neutral-900' : 'text-neutral-400'}`}> {value || placeholder}</p>
        <div>
          {icon == 'single' ? (
            <IoIosArrowDown />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4.7998 5.5999L7.9998 2.3999L11.1998 5.5999M11.1998 10.3999L7.9998 13.5999L4.7998 10.3999"
                stroke="#4B5563"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            className="flex flex-col  gap-2 w-full absolute right-0  bg-white p-2 shadow-lg border border-neutral-200 rounded-lg z-10 max-h-52 overflow-y-scroll"
            initial={{ opacity: 0, y: '-10%' }}
            animate={{ opacity: 1, y: '5%' }}
            exit={{ opacity: 0, y: '-10%', transition: { duration: '0.35' } }}
            transition={{ type: 'spring', stiffness: '100', duration: '0.75' }}
          >
            {search && (
              <input
                type="text"
                className="py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm border-neutral-200 text-neutral-400 h-10 outline-none"
                ref={searchRef}
                placeholder="Search..."
                onChange={handleSearch}
              />
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item: string, key: number) => (
                <p
                  className={`${key === 0 ? '' : 'border-t'} border-neutral-300 text-sm text-neutral-900 p-2 cursor-pointer hover:bg-gray-200`}
                  onClick={() => handleSelect(item)}
                  key={key}
                >
                  {item}
                </p>
              ))
            ) : (
              <p className="text-neutral-500 p-2">No results found</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SelectDropdown
