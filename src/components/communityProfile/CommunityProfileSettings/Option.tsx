import React from 'react'
import { SettingOptionType } from './optionEnum'

const option = [
  SettingOptionType.Accesibility,
  SettingOptionType.Billings,
  SettingOptionType.Notifications,
  SettingOptionType.Security,
  SettingOptionType.Account,
]

type optionType = {
  selectedOption: string
  setSelectedOption: (value: SettingOptionType) => void
}

const Option = ({ selectedOption, setSelectedOption }: optionType) => {
  return (
    <div className="w-full flex justify-between text-white">
      {option.map((item) => (
        <div
          key={item}
          onClick={() => setSelectedOption(item)}
          className={`${selectedOption == item ? ' bg-[#501EE3]' : 'bg-[#6647FF]'}
           py-4 w-full font-semibold text-center max-sm:text-xs `}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

export default Option
