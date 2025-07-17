import React, { useState, useMemo, forwardRef } from 'react'
import { IoSearch } from 'react-icons/io5'
import './index.css'

type Props = {
  placeholder?: string
  className?: string
  type: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const GroupSearchBox = forwardRef<HTMLInputElement, Props>(({ placeholder, className = '', type, onChange, ...rest }, ref) => {
  return (
    <div className="relative w-full">
      <IoSearch className="text-neutral-700 absolute top-[50%] right-6 translate-y-[-50%] z-10" width={20} height={20} />
      <input
        className={`${className} group-search-input py-2 px-3 border rounded-md drop-shadow-sm border-neutral-200 text-neutral-700 h-10 outline-none w-full`}
        type={type}
        placeholder={placeholder}
        ref={ref}
        onChange={onChange}
        {...rest}
      />
    </div>
  )
})

GroupSearchBox.displayName = 'GroupSearchBox' // for React DevTools

export default GroupSearchBox
