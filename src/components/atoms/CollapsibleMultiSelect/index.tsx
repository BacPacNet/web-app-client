import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface CollapsibleMultiSelectProps {
  title: string
  options: string[]
  selectedOptions: string[]
  onSelect: (option: string) => void
  handleSelectAll: () => void
}

const CollapsibleMultiSelect: React.FC<CollapsibleMultiSelectProps> = ({ title, options, selectedOptions, onSelect, handleSelectAll }) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  const toggleSection = () => setExpanded(!expanded)
  const toggleOption = (option: string) => {
    onSelect(option)
  }

  const handleSelectAllOptions = () => {
    setExpanded(true)
    handleSelectAll()
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center py-4 cursor-pointer " onClick={toggleSection}>
        <div className="flex items-center space-x-2" onClick={handleSelectAllOptions}>
          <input
            type="checkbox"
            checked={selectedOptions.length > 0}
            onChange={handleSelectAllOptions}
            className="w-[18px] h-[18px]  border-neutral-200 rounded "
          />
          <span className="text-2xs font-medium text-neutral-900">{title}</span>
        </div>
        {/* {expanded ? <FaChevronUp size={24} color="#000" /> : <FaChevronDown size={24} color="#000" />} */}
      </div>

      {expanded && (
        <div className="px-4 pb-2 grid grid-cols-2 ms-6">
          {options.map((option) => (
            <div key={option} className="flex items-center space-x-2 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => toggleOption(option)}
                className="w-[18px] h-[18px]  border-neutral-200 rounded "
              />
              <span className="text-3xs text-neutral-700">{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CollapsibleMultiSelect
