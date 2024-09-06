import React, { forwardRef } from 'react'

type Props = {
  placeholder?: string
  className?: string
  type: string
}
const InputBox = forwardRef<HTMLInputElement, Props>(({ placeholder, className, type, ...rest }, ref) => {
  return (
    <input
      className={`${className} py-2 px-3 border rounded-lg drop-shadow-sm border-neutral-200 text-neutral-400 h-10 outline-none`}
      type={type}
      placeholder={placeholder}
      ref={ref}
      {...rest}
    />
  )
})

InputBox.displayName = 'InputBox' // for React DevTools

export default InputBox
