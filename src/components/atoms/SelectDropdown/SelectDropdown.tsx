'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { FiUserCheck, FiUser } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'
import { MdOutlinePublic } from 'react-icons/md'
import { FiUsers } from 'react-icons/fi'
const icons = [MdOutlinePublic, FiUserCheck, FiUsers, FiUser]

interface SelectDropdownProps {
  options: string[]
  onChange: (value: string) => void
  value: string
  placeholder?: string
  icon: string
  search?: boolean
  err: boolean
  showIcon?: boolean
  isAllowedToRemove?: boolean
}

const motionStyle = {
  initial: { opacity: 0, y: '-10%' },
  animate: { opacity: 1, y: '5%' },
  exit: { opacity: 0, y: '-10%', transition: { duration: '0.35' } },
  transition: { type: 'spring', stiffness: '100', duration: '0.75' },
}

const SelectDropdown = ({
  options,
  onChange,
  value,
  isAllowedToRemove = true,
  placeholder,
  icon,
  search = false,
  err,
  showIcon = false,
}: SelectDropdownProps) => {
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

  const toggleDropdown = () => {
    if (!show) {
      setFilteredOptions(options)
      if (searchRef.current) searchRef.current.value = ''
    }
    setShow((prevShow) => !prevShow)
  }

  return (
    <motion.div ref={dropdownRef} className="relative">
      <div
        onClick={toggleDropdown}
        className={`${
          err ? 'border-red-400' : 'border-neutral-200'
        } h-10 flex justify-between items-center py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm  text-neutral-400  outline-none`}
      >
        <p className={`${value ? 'text-neutral-900' : 'text-neutral-400'} text-2xs`}> {value || placeholder}</p>
        <div>
          {value && isAllowedToRemove ? (
            <RxCross2
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
              }}
            />
          ) : icon === 'single' ? (
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
            className={`flex flex-col custom-scrollbar ${
              !showIcon ? 'gap-2 w-full p-2' : 'gap-1 p-1'
            } absolute right-0 bg-white shadow-lg border border-neutral-200 rounded-lg z-10 max-h-52 w-52 overflow-y-auto`}
            {...motionStyle}
          >
            {search && (
              <input
                type="text"
                className="py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm border-neutral-200 text-neutral-700 h-10 outline-none"
                ref={searchRef}
                placeholder="Search..."
                onChange={handleSearch}
              />
            )}
            {filteredOptions?.length > 0 ? (
              filteredOptions.map((item: string, key: number) => {
                const IconComponent = icons[key % icons.length]
                return (
                  <div
                    className={`${
                      key === 0 ? '' : 'border-t'
                    } flex gap-2 items-center border-neutral-300 text-2xs text-neutral-900 p-1 cursor-pointer hover:bg-gray-200`}
                    onClick={() => handleSelect(item)}
                    key={key}
                  >
                    {showIcon && <IconComponent size={16} className="text-neutral-900" />}
                    <p>{item}</p>
                  </div>
                )
              })
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
