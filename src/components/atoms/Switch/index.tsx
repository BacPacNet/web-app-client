import React from 'react'

type SwitchProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      disabled={disabled}
      className={`relative w-[26px] h-4 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${
        checked && !disabled ? 'bg-blue-600' : disabled ? 'bg-[#B9B1FF]' : 'bg-neutral-300'
      }`}
    >
      <span
        className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300  ${
          checked ? 'translate-x-2' : '-translate-x-[2px]'
        }`}
      />
    </button>
  )
}

export default Switch
