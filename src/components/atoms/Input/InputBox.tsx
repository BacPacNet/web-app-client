import React, { forwardRef, InputHTMLAttributes } from 'react'
import { RxCross2 } from 'react-icons/rx'

type Props = {
  placeholder?: string
  className?: string
  type: string
  err?: boolean
  value?: string
  disabled?: boolean
  isCancel?: boolean
  onCancel?: () => void
} & InputHTMLAttributes<HTMLInputElement>

const InputBox = forwardRef<HTMLInputElement, Props>(
  ({ placeholder, className, type, err, value, disabled, onClick, isCancel, onCancel, ...rest }, ref) => {
    return (
      <div className="relative w-full">
        <input
          className={`${className} ${
            err ? 'border-red-400' : 'border-neutral-200'
          } w-full py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm text-neutral-900 placeholder:text-neutral-400 h-10 outline-none`}
          type={type}
          placeholder={placeholder}
          ref={ref}
          value={value}
          disabled={disabled}
          onClick={onClick}
          {...rest}
        />
        {isCancel && <RxCross2 onClick={onCancel} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" size={20} />}
      </div>
    )
  }
)

InputBox.displayName = 'InputBox' // for React DevTools

export default InputBox
