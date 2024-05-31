'use client'
import React, { useState } from 'react'
import CommunityProfileOption from './CommunityProfileOption'
import CommunityProfilePost from './CommunityProfilePost'
import CommunityProfileSettings from './CommunityProfileSettings/CommunityProfileSettings'
import { valueType } from './communityProfileOptionEnum'

const dummyData = [
  {
    dp: 'https://cdn.pixabay.com/photo/2023/02/19/08/39/man-7799486_1280.jpg',
    content: 'Law Debate Club will have its first debate starting next week Feb 19, 2024! Any participants interested send me a DM.',
    name: 'Kathryn Murphy',
  },
]

const dummyMediaData = [
  {
    dp: 'https://cdn.pixabay.com/photo/2023/02/19/08/39/man-7799486_1280.jpg',
    content: 'Beautiful building landscapes in the japanese skyline.',
    name: 'Kathryn Murphy',
    media: 'https://cdn.pixabay.com/photo/2016/04/07/18/36/architecture-1314416_1280.jpg',
  },
]

const dummySavedData = [
  {
    dp: 'https://cdn.pixabay.com/photo/2023/02/19/08/39/man-7799486_1280.jpg',
    content: 'Beautiful building landscapes in the japanese skyline.',
    name: 'Kathryn Murphy',
    saved: true,
  },
]

const CommunityProfileContainer = () => {
  const [selectedOption, setSelectedOption] = useState('Posts')
  return (
    <div className="w-1/2 max-md:w-9/12 max-sm:w-11/12 border-2 rounded-lg border-[#737373] max-h-max ">
      <CommunityProfileOption selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      {selectedOption == valueType.Posts ? (
        <CommunityProfilePost data={dummyData} />
      ) : selectedOption == valueType.Media ? (
        <CommunityProfilePost data={dummyMediaData} />
      ) : selectedOption == valueType.Saved ? (
        <CommunityProfilePost data={dummySavedData} />
      ) : selectedOption == valueType.Settings ? (
        <CommunityProfileSettings />
      ) : (
        <CommunityProfilePost data={dummyData} />
      )}
    </div>
  )
}

export default CommunityProfileContainer
