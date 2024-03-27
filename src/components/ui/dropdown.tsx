import React from 'react'

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
  return (
    <div className="mb-4">
      <div className="relative">
        <select
          id={label.toLowerCase()}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" className="px-3 hover:bg-gray-100">
            {label}
          </option>
          {options.map(({ value, label }) => (
            <option key={value} value={value} className="px-3 hover:bg-gray-100">
              {label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Dropdown
