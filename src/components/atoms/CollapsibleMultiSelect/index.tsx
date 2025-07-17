import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

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
    <div className="w-full border-b border-[#E5E7EB]">
      <div className="flex justify-between items-center py-4 cursor-pointer " onClick={toggleSection}>
        <div className="flex items-center space-x-2">
          {/* <input
            type="checkbox"
            checked={selectedOptions.length > 0}
            onChange={handleSelectAllOptions}
            className="w-[18px] h-[18px]  border-neutral-200 rounded cursor-pointer"
          /> */}
          <span className="text-xs font-medium text-neutral-900">{title}</span>
        </div>
        {expanded ? <MdKeyboardArrowUp size={20} className="text-neutral-500" /> : <MdKeyboardArrowDown size={20} className="text-neutral-500" />}
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-2 grid grid-cols-2 ms-2">
              {options.map((option) => (
                <label key={option} className="flex items-center space-x-2 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => toggleOption(option)}
                    className="w-[18px] h-[18px] appearance-none rounded border-2 border-neutral-200 cursor-pointer
              checked:bg-primary checked:border-primary
              relative after:content-[''] after:absolute after:w-[5px] after:h-[10px] after:border-r-2 after:border-b-2 after:border-white
              after:rotate-45 after:top-[1px] after:left-[5px] checked:after:block after:hidden"
                  />
                  <span className="text-2xs text-neutral-700">{option}</span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CollapsibleMultiSelect
