'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoIosArrowDown } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import StatusTooltip from '../StatusTooltip'

interface MultiSelectDropdownProps {
  options: string[]
  onChange: (value: string[]) => void
  value: string[]
  placeholder?: string
  search?: boolean
  err: boolean
  showIcon?: boolean
  label?: string
  isStatus?: boolean
  variant?: 'primary' | 'default'
  appearance?: 'default' | 'pill'
  filteredCount?: any
  multiSelect?: boolean
  disabled?: boolean
  parentCategory?: string[]
  setUniversityErr?: (value: boolean) => void
  onShowChange?: (show: boolean) => void
  isRelative?: boolean
  hideSelectedTags?: boolean
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

const MultiSelectDropdown = ({
  options,
  onChange,
  value,
  placeholder,
  search = false,
  err,
  showIcon = false,
  label,
  isStatus = false,
  variant = 'default',
  appearance = 'default',
  filteredCount,
  multiSelect = true,
  parentCategory,
  disabled = false,
  setUniversityErr,
  onShowChange,
  isRelative = false,
  hideSelectedTags = false,
}: MultiSelectDropdownProps) => {
  const [show, setShow] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const searchRef = useRef<HTMLInputElement>(null)

  const handleSelect = (optionValue: string) => {
    if (disabled) {
      if (setUniversityErr) {
        return setUniversityErr(true)
      }
      return
    }
    if (multiSelect == false) {
      setShow(false)
      return onChange([optionValue])
    } else if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleSearch = () => {
    const searchValue = searchRef.current?.value.toLowerCase() || ''
    setFilteredOptions(searchValue === '' ? options : options.filter((option: string) => option.toLowerCase().includes(searchValue)))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShow(false)
        if (onShowChange) {
          onShowChange(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onShowChange])

  const toggleDropdown = () => {
    if (disabled) {
      if (setUniversityErr) {
        return setUniversityErr(true)
      }
      return
    }
    if (!show) {
      setFilteredOptions(options)
      if (searchRef.current) searchRef.current.value = ''
    }
    setShow((prevShow) => {
      const newShow = !prevShow
      if (onShowChange) {
        onShowChange(newShow)
      }
      return newShow
    })
  }

  const isPill = appearance === 'pill'

  return (
    <motion.div ref={dropdownRef} className={`relative shrink-0 cursor-pointer ${isPill ? 'w-fit' : 'min-w-[150px]'}`}>
      <div className="flex gap-1">
        {label && <label className="text-xs mb-2 text-neutral-900 font-medium">{label}</label>}
        {isStatus && <StatusTooltip />}
      </div>

      <div
        onClick={toggleDropdown}
        className={`${err ? 'border-red-400' : 'border-neutral-200'} border flex items-center ${
          isPill
            ? 'h-9 w-fit shrink-0 gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-none'
            : `h-10 justify-between px-2 py-2 ${variantBg[variant]} rounded-lg drop-shadow-sm`
        } text-neutral-700 outline-none focus:ring-2 ${disabled ? 'bg-neutral-100 cursor-not-allowed opacity-70' : ''}`}
      >
        <div className={`flex flex-wrap gap-1 ${isPill ? '' : 'px-1 text-xs'}`}>
          <p className={isPill ? 'font-medium text-neutral-700' : 'text-neutral-700'}>{placeholder}</p>
        </div>
        <IoIosArrowDown className={`shrink-0 ${isPill ? 'text-sm text-neutral-500' : variantText[variant]}`} />
      </div>
      {!hideSelectedTags && (
        <div className="flex flex-wrap gap-2 mt-2">
          {parentCategory && parentCategory?.length > 0 ? (
            <div className="flex items-center text-2xs  px-2 py-1 h-7  text-primary-500 bg-white rounded-md border border-primary">
              <span className=" mr-1">{parentCategory}</span>
            </div>
          ) : (
            ''
          )}
          {value.length > 0
            ? value.map((selected, index) => (
                <div
                  key={index}
                  className="inline-flex w-fit shrink-0 gap-2 items-center text-2xs px-2 py-1 h-7 bg-primary-500 text-white rounded-md"
                >
                  <span className="whitespace-nowrap">
                    {selected}
                    {/*<span className="px-[6px] py-0 bg-white text-primary rounded-sm">{filteredCount ? filteredCount[selected] || 0 : 0}</span>*/}
                  </span>
                  <RxCross2
                    className="cursor-pointer text-sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange(value.filter((item) => item !== selected))
                    }}
                  />
                </div>
              ))
            : ''}
        </div>
      )}

      <AnimatePresence>
        {show && (
          <motion.div
            className={`${isPill ? 'min-w-max' : ''} flex flex-col custom-scrollbar gap-2 p-2 ${
              isRelative ? 'relative mb-3' : 'absolute left-0 top-14 mt-2'
            } bg-white border border-neutral-200 rounded-lg z-50 w-full max-h-52 overflow-y-auto`}
            {...motionStyle}
          >
            {search && (
              <input
                type="text"
                className="py-2 px-3 text-2xs border rounded-lg drop-shadow-sm border-neutral-200 text-neutral-700 h-10 outline-none"
                ref={searchRef}
                placeholder="Search..."
                onChange={handleSearch}
              />
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item: string, key: number) => (
                <div
                  key={key}
                  className={`flex gap-2 items-center text-xs text-neutral-900  p-1 px-2 cursor-pointer hover:bg-neutral-100 rounded-md ${
                    value.includes(item) ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  {multiSelect && (
                    <input
                      type="checkbox"
                      checked={value.includes(item)}
                      onChange={() => handleSelect(item)}
                      className="w-[16px] h-[16px]  appearance-none rounded border-2 border-neutral-200 cursor-pointer
                    checked:bg-primary checked:border-primary
                    relative after:content-[''] after:absolute after:w-[4px] after:h-[8px] after:border-r-2 after:border-b-2 after:border-white
                    after:rotate-45 after:top-[1.5px] after:left-[5px] checked:after:block after:hidden"
                    />
                  )}
                  <p>{item}</p>
                </div>
              ))
            ) : (
              <p className="text-neutral-500 p-2 text-xs">No results found</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MultiSelectDropdown
