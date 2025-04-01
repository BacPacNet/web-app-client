import React from 'react'

type SwitchProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={`relative w-[26px] h-4 flex items-center bg-gray-300 rounded-full p-1 transition-colors duration-300 ${
        checked ? 'bg-blue-600' : 'bg-neutral-300'
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
