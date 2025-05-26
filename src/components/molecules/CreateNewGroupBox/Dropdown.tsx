import { FaXmark } from 'react-icons/fa6'
import { BiChevronDown } from 'react-icons/bi'
import { useState } from 'react'
import CollegeResult from '@/components/CollegeResult'

//interface UniversityOption {
//  _id: string
//  UniversityName: string
//  communityId: string
//  [key: string]: any // other optional fields
//}

interface UniversityDropdownProps {
  label?: string
  selected: { name: string; id: string }
  options: any[]
  onSelect: (value: { name: string; id: string }) => void
  onClear: () => void
  error?: boolean
  errorMessage?: string
}

const UniversityDropdown: React.FC<UniversityDropdownProps> = ({
  label = 'University',
  selected,
  options,
  onSelect,
  onClear,
  error = false,
  errorMessage,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSelect = (university: any) => {
    onSelect({ name: university.UniversityName, id: university.communityId })
    setShowDropdown(false)
  }

  return (
    <div className="relative w-full">
      <label className="text-sm font-medium">{label}</label>

      <div
        onClick={() => setShowDropdown(!showDropdown)}
        className={`w-full flex justify-between items-center border mt-2 ${
          error ? 'border-destructive-600' : 'border-neutral-200'
        } rounded-lg p-3 text-xs text-neutral-700 h-10 bg-white shadow-sm cursor-pointer`}
      >
        {selected.name || 'Select University'}
        {selected.name ? (
          <FaXmark
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
            className="w-4 h-4 ml-2"
          />
        ) : (
          <BiChevronDown className="w-4 h-4 ml-2" />
        )}
      </div>

      {error && errorMessage && <p className="text-destructive-600 text-xs mt-1">{errorMessage}</p>}

      {showDropdown && (
        <div className="absolute left-0 top-full mt-2 w-full max-h-64 bg-white shadow-lg border border-neutral-300 rounded-lg z-50 overflow-y-auto custom-scrollbar">
          {options?.length > 0 ? (
            options.map((university: any) => (
              <div
                key={university._id}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(university)
                }}
                className="bg-white rounded-md hover:bg-surface-primary-50 py-1 cursor-pointer"
              >
                <CollegeResult university={university} />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg border-b border-neutral-200 text-black">
              <p className="p-3 text-gray-500">No results found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UniversityDropdown
