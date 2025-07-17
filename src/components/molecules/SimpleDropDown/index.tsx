import { Sortby } from '@/types/common'
import React, { useState, useRef, useEffect } from 'react'
import { IconType } from 'react-icons'
import { IoMdArrowDropdown } from 'react-icons/io'

interface DropdownOption {
  value: Sortby
  label: string
  icon?: React.ReactNode
}

interface DropdownProps {
  label: string
  options: DropdownOption[]
  onSelect: (option: DropdownOption) => void
}

const SimpleDropdown: React.FC<DropdownProps> = ({ label, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: DropdownOption) => {
    onSelect(option)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button className="rounded bg-white  text-neutral-500 text-xs mt-4 flex gap-1 items-center font-medium" onClick={() => setIsOpen(!isOpen)}>
        {label}
        <IoMdArrowDropdown className="text-sm" />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-neutral-300 rounded shadow-card z-10">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className="flex items-start p-3 hover:bg-neutral-200 cursor-pointer text-neutral-800"
            >
              {option.icon && <div className="mt-1 mr-2 text-primary">{option.icon}</div>}
              <div>
                <div className="font-normal text-sm">{option.label}</div>
                {/*<div className="text-xs text-gray-500">{option.description}</div>*/}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SimpleDropdown
