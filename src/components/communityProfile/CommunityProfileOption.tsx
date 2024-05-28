import React from 'react'
import { valueType } from './communityProfileOptionEnum'

const option = [valueType.Posts, valueType.Replies, valueType.Media, valueType.Saved, valueType.Settings]

type optionType = {
  selectedOption: string
  setSelectedOption: (value: valueType) => void
}

const CommunityProfileOption = ({ selectedOption, setSelectedOption }: optionType) => {
  return (
    <div className="w-full flex justify-between border-b-2 border-[#737373]">
      {option.map((item, idx) => (
        <div
          key={item}
          onClick={() => setSelectedOption(item)}
          className={`${selectedOption == item ? 'border-x-2 bg-[#FAFAFA]' : ''} ${
            selectedOption == item && idx == 0 ? 'border-l-0 rounded-ss-lg' : selectedOption == item && idx == 4 ? 'border-r-0 rounded-tr-lg' : ''
          } py-4 w-full font-semibold text-center max-sm:text-xs`}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

export default CommunityProfileOption
