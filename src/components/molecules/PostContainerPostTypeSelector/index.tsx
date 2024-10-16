'use client'
import React, { useState } from 'react'

const PostType = ['POPULAR', 'RECENT', 'SAVED']

const PostContainerPostTypeSelector = () => {
  const [selectedType, setSelectedType] = useState<string>('RECENT')

  return (
    <div className="flex h-16 bg-white rounded-t-2xl border-b-2 border-neutral-200 ">
      {PostType.map((item) => (
        <button
          onClick={() => setSelectedType(item)}
          key={item}
          className={`relative w-28 px-4 py-2 ${selectedType === item ? 'text-[#3A169C]' : 'text-gray-500 text-neutral-400'} font-extrabold `}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export default PostContainerPostTypeSelector
