import React, { useState } from 'react'
import { cn } from '@/lib/utils'
export interface DropdownOption {
  label: string
  value: string
}

interface DropdownProps {
  label: string
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const activeStyle = isOpen ? 'bg-gray-50 border-2 rounded-b-none' : ''
  const activeDropdownStyle = isOpen ? 'border-2 border-gray-300 rounded-t-none border-t-0' : 'rounded-md'
  return (
    <div className="mb-4 relative">
      <button
        className={cn('block w-full py-2 px-3 border border-gray-300 bg-white rounded-md appearance-none text-left', activeStyle)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || label}
        <svg
          className="fill-current h-4 w-4 absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </button>
      {isOpen && (
        <ul className={cn('absolute z-10 w-full bg-white rounded-md shadow-md', activeDropdownStyle)}>
          {options.map(({ value, label }) => (
            <li key={value} className="px-3 py-2 hover:bg-gray-50 hover:font-medium cursor-pointer" onClick={() => handleOptionClick(value)}>
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
