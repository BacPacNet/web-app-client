import React, { forwardRef, InputHTMLAttributes, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

interface InputBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string
  className?: string
  type: string
  err?: boolean
  value?: string
  disabled?: boolean
  isCancel?: boolean
  onCancel?: () => void
  label?: string
}

const InputBox = forwardRef<HTMLInputElement, InputBoxProps>(
  ({ placeholder, className, type, err, value, disabled, isCancel, onCancel, label, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'

    return (
      <div className="relative w-full flex flex-col gap-2">
        {label && <label className="text-xs text-neutral-700 font-medium">{label}</label>}
        <div className="relative">
          <input
            className={`${className} ${
              err ? 'border-red-400' : 'border-neutral-200'
            } w-full py-2 px-3 border  rounded-lg drop-shadow-sm text-neutral-900 placeholder:text-neutral-400 h-10 outline-none pr-10`}
            type={isPassword && showPassword ? 'text' : type}
            placeholder={placeholder}
            ref={ref}
            value={value}
            disabled={disabled}
            {...rest}
          />
          {isPassword && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-700">
              {showPassword ? (
                <AiOutlineEyeInvisible className="h-5 w-5" onClick={() => setShowPassword(!showPassword)} />
              ) : (
                <AiOutlineEye className="h-5 w-5" onClick={() => setShowPassword(!showPassword)} />
              )}
            </div>
          )}
          {isCancel && <RxCross2 onClick={onCancel} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer" size={20} />}
        </div>
      </div>
    )
  }
)

InputBox.displayName = 'InputBox'

export default InputBox
