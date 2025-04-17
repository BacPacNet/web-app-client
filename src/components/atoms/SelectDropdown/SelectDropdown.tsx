'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { FiUserCheck, FiUser } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'
import { MdOutlinePublic } from 'react-icons/md'
import { FiUsers } from 'react-icons/fi'
import Image from 'next/image'
import Tooltip from '../Tooltip'
import StatusTooltip from '../StatusTooltip'
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
  label?: string
  isStatus?: boolean
  variant?: 'primary' | 'default'
  setCityOptions?: any
}

const motionStyle = {
  initial: { opacity: 0, y: '-10%' },
  animate: { opacity: 1, y: '5%' },
  exit: { opacity: 0, y: '-10%', transition: { duration: '0.35' } },
  transition: { type: 'spring', stiffness: '100', duration: '0.75' },
}

const variantText: any = {
  primary: 'text-primary-500',
  default: 'text-neutral-800',
}
const variantBg: any = {
  primary: 'bg-surface-primary-50',
  default: 'bg-white',
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
  label,
  isStatus = false,
  variant = 'default',
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
    <motion.div ref={dropdownRef} className="relative cursor-pointer min-w-[90px]">
      <div className="flex gap-1">
        {label && <label className="text-xs mb-2 text-neutral-700 font-medium">{label}</label>}
        {isStatus && <StatusTooltip />}
      </div>

      <div
        onClick={toggleDropdown}
        className={`${err ? 'border-red-400' : 'border-neutral-200'} border  h-10 flex justify-between items-center px-2 py-2  ${
          variantBg[variant]
        } focus:ring-2 rounded-lg drop-shadow-sm  text-neutral-400  outline-none`}
      >
        <p className={`${value ? 'text-neutral-900' : 'text-neutral-400'} ${variantText[variant]} text-xs px-1`}> {value || placeholder}</p>
        <div>
          {value && isAllowedToRemove ? (
            <RxCross2
              onClick={(e) => {
                e.stopPropagation()
                onChange('')
              }}
            />
          ) : icon === 'single' ? (
            <IoIosArrowDown className={`${variantText[variant]}`} />
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
            } absolute left-0 top-full mt-1 bg-white shadow-lg border border-neutral-200 rounded-lg z-10 w-52 max-h-52 overflow-y-auto`}
            //{...motionStyle}
          >
            {search && (
              <input
                type="text"
                className="py-2 px-3 text-2xs border rounded-lg drop-shadow-sm border-neutral-200 text-neutral-700 h-10  outline-none"
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
                    className={` flex gap-2 items-center  text-xs text-neutral-900 p-1 px-2 cursor-pointer hover:bg-neutral-100 rounded-md`}
                    onClick={() => handleSelect(item)}
                    key={key}
                  >
                    {showIcon && <IconComponent size={16} className=" text-primary-500" />}
                    <p>{item}</p>
                  </div>
                )
              })
            ) : (
              <p className="text-neutral-500 p-2 text-xs">No results found</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
export default SelectDropdown
