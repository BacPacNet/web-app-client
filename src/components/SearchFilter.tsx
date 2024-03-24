'use client'
import React, { useState } from 'react'
import Dropdown, { DropdownOption } from '@/components/ui/dropdown'

interface SearchFilterProps {
  filters: {
    label: string
    options: DropdownOption[]
  }[]
}

const SearchFilter: React.FC<SearchFilterProps> = ({ filters }) => {
  const [selectedValues, setSelectedValues] = useState<{ [key: string]: string }>({})

  const handleSelectChange = (filterLabel: string, value: string) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [filterLabel]: value,
    }))
  }

  const handleReset = () => {
    setSelectedValues({})
  }

  return (
    <div className=" p-4 rounded-md h-auto">
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
        className="px-3 py-2 rounded-md hover:bg-indigo-500 transition-colors duration-300 border-indigo-500 border-2 mt-4 text-indigo-500 font-medium text-xs float-right"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  )
}

export default SearchFilter
