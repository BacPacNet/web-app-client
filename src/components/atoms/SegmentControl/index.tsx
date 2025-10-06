'use client'

export interface SegmentedOption {
  label: string
  value: string
}

interface SegmentedControlProps {
  options: SegmentedOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, value, onChange, className = '' }) => {
  return (
    <div className={`flex items-center bg-[#F3F4F6] rounded-xl p-1 w-full ${className}`}>
      {options.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 px-4 py-2 rounded-xl  font-medium transition-all duration-200 ${
              isActive ? 'bg-white text-[#18191A] shadow-sm' : 'text-[#6B7280] '
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl
