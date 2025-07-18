'use client'
import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useModal } from '@/context/ModalContext'

interface ModalDropdownProps {
  options: string[]
  onChange: (value: string) => void
  value: string
  showSearch?: boolean
}

const ModalDropdown = ({ options, onChange, value, showSearch = true }: ModalDropdownProps) => {
  const { closeModal } = useModal()
  const [filteredOptions, setFilteredOptions] = useState(options)
  const searchRef = useRef<HTMLInputElement>(null)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    closeModal()
  }

  const handleSearch = () => {
    const searchValue = searchRef.current?.value.toLowerCase() || ''
    setFilteredOptions(searchValue === '' ? options : options.filter((option) => option.toLowerCase().includes(searchValue)))
  }

  return (
    <motion.div className="relative flex flex-col gap-2  mt-4 overflow-y-hidden">
      {showSearch && (
        <input
          type="text"
          className="py-2 px-3 text-xs border rounded-lg drop-shadow-sm border-neutral-200 text-neutral-700 outline-none w-full"
          ref={searchRef}
          placeholder="Search..."
          onChange={handleSearch}
        />
      )}

      <AnimatePresence>
        <motion.div className="flex flex-col gap-2 w-full  bg-white  rounded-lg z-10 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((item, key) => {
              return (
                <div
                  key={key}
                  className={`flex items-center gap-2 px-2 py-2 text-xs cursor-pointer hover:bg-gray-200 rounded-md ${
                    item === value ? 'bg-blue-100 text-primary-500 font-semibold' : 'text-neutral-900'
                  }`}
                  onClick={() => handleSelect(item)}
                >
                  <p>{item}</p>
                </div>
              )
            })
          ) : (
            <p className="text-neutral-500 p-2 text-xs">No results found</p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

export default ModalDropdown
