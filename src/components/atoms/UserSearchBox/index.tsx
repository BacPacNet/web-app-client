import React from 'react'
import { GoSearch } from 'react-icons/go'

type UserSearchInputProps = {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  iconPosition?: 'left' | 'right'
  className?: string
}

export default function UserSearchInput({ value, onChange, placeholder, iconPosition = 'right', className = '' }: UserSearchInputProps) {
  const icon = <GoSearch className="shrink-0 text-neutral-400" size={18} />

  return (
    <div className={`flex h-10 w-full items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 shadow-sm ${className}`}>
      {iconPosition === 'left' ? icon : null}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm outline-none text-neutral-700 placeholder:text-neutral-400"
        placeholder={placeholder || 'Searching All Users'}
      />
      {iconPosition === 'right' ? icon : null}
    </div>
  )
}
