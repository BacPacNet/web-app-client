// components/Dropdown.tsx
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

interface DropdownProps {
  options: string[]
  defaultOption: string
}

const Dropdown: React.FC<DropdownProps> = ({ options, defaultOption }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(defaultOption)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left xs:pl-5 sm:pl-0">
      <div>
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-white text-sm font-medium text-gray-dark hover:text-gray focus:outline-none"
          onClick={toggleDropdown}
        >
          Sort By: {selectedOption}
          <FaChevronDown className="ml-2 h-3 w-3 text-gray-500" />
        </button>
      </div>
      {isOpen && (
        <div
          className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option}
                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                role="menuitem"
                tabIndex={-1}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
