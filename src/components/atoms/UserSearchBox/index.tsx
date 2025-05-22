import React from 'react'
import { GoSearch } from 'react-icons/go'

export default function UserSearchInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="w-full px-3 py-2 border border-neutral-200 shadow-sm rounded-lg flex items-center gap-4 h-10">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs w-full outline-none text-neutral-700"
        placeholder="Searching All Users"
      />
      <GoSearch className="text-neutral-500" size={20} />
    </div>
  )
}
