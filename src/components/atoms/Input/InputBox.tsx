import React, { forwardRef } from 'react'

type Props = {
  placeholder?: string
  className?: string
  type: string
  err: boolean
}
const InputBox = forwardRef<HTMLInputElement, Props>(({ placeholder, className, type, err, ...rest }, ref) => {
  return (
    <input
      className={`${className} ${
        err ? 'border-red-400' : 'border-neutral-200'
      } py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm  text-neutral-900 placeholder:text-neutral-400 h-10 outline-none`}
      type={type}
      placeholder={placeholder}
      ref={ref}
      {...rest}
    />
  )
})

InputBox.displayName = 'InputBox' // for React DevTools

export default InputBox
