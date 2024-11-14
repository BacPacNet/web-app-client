import React, { useState } from 'react'

function StartChatModal() {
  const [searchInput, setSearchInput] = useState('')

  return (
    <div className="relative w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        onChange={(e) => setSearchInput(e.target.value)}
        value={searchInput}
        type="text"
        placeholder="Search users by name"
        className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border border-neutral-300  rounded-2xl"
      />
    </div>
  )
}

export default StartChatModal
