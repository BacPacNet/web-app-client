'use client'
import React, { useState } from 'react'
import Dropdown, { DropdownOption } from '@/components/ui/dropdown'
import Modal from '@/components/Modal'
import { cn } from '@/lib/utils'
interface SearchFilterProps {
  filters: {
    label: string
    options: DropdownOption[]
  }[]
}

const SearchFilter: React.FC<SearchFilterProps> = ({ filters }) => {
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<{ label: string; options: DropdownOption[] } | null>(null)
  console.log('Selected Filters: ', selectedValues)

  const handleSelectChange = (filterLabel: string, value: string) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [filterLabel]: value,
    }))
  }

  const handleReset = () => {
    setSelectedValues({})
  }

  const handleFilterClick = (filterLabel: string) => {
    const filter = filters.find((f) => f.label === filterLabel)
    if (filter) {
      setActiveFilter(filter)
      setIsModalOpen(true)
    }
  }

  const handleOptionSelect = (value: string) => {
    if (activeFilter) {
      handleSelectChange(activeFilter.label, value)
    }
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {activeFilter && (
          <div className="flex flex-col justify-between pt-6">
            <div>
              <h1 className="text-xl font-medium text-center mb-4">{activeFilter.label}</h1>
              <ul className="">
                {activeFilter.options.map((option) => {
                  const activeClass = selectedValues[activeFilter.label] === option.value ? 'bg-gray-100 border-l-2 border-black' : ''
                  return (
                    <li
                      key={option.value}
                      className={cn('py-1 px-4 mx-6 my-2 hover:bg-gray-50 hover:border-l-2 hover:border-black cursor-pointer', activeClass)}
                      onClick={() => handleOptionSelect(option.value)}
                    >
                      {option.label}
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="flex justify-end">
              <button className="my-4 bg-[#6647FF] text-white py-2 px-6 rounded-lg hover:bg-blue-700" onClick={() => setIsModalOpen(false)}>
                Apply
              </button>
            </div>
          </div>
        )}
      </Modal>
      {/* For Screen sizes equivalent to large or more */}
      <div className="border-2 border-gray-300 rounded-lg pb-4 max-h-[400px] hidden lg:block">
        <p className="p-[18px] pr-[61px] mb-4 border-b-2 rounded-t-lg bg-gray-50 font-medium text-[16px] whitespace-nowrap">Search Filter</p>
        <div className=" p-4 rounded-md">
          {filters.map(({ label, options }) => (
            <Dropdown
              key={label}
              label={label}
              options={options}
              value={selectedValues[label] || ''}
              onChange={(value) => handleSelectChange(label, value)}
            />
          ))}
          <button
            className="px-3 py-2 rounded-md hover:border-indigo-400 transition-colors duration-300 border-indigo-500 border-2 mt-4 text-indigo-500 font-medium text-xs float-right mb-4"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
      {/* For screen sizes below large */}
      <div className="pb-4 block lg:hidden justify-center">
        <p className="font-medium text-2xl pb-3">Search Filters</p>
        <div className="flex flex-row items-center justify-between flex-wrap">
          <div className="flex flex-row gap-3 flex-wrap py-2">
            {filters.map(({ label }) => (
              <p
                key={label}
                className="border-2 border-gray-300 rounded-3xl py-2 px-4 font-medium cursor-pointer"
                onClick={() => handleFilterClick(label)}
              >
                {selectedValues[label] ?? label}
              </p>
            ))}
          </div>
          <button
            className="px-4 py-2 rounded-3xl hover:border-indigo-400 transition-colors duration-300 border-indigo-500 border-2 text-indigo-500 font-medium"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  )
}

export default SearchFilter
