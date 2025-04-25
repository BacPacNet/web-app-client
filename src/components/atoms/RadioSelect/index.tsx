import React from 'react'

interface RadioOptionProps {
  label: string
  description?: string
  value: string
  register: any
  name: string
  error?: string
  checkedValue: string
  checkedContent?: React.ReactNode
  isDisabled?: boolean
  required?: boolean
  onAttemptSelect?: () => void
  fontSize?: 'small' | 'large'
}

const RadioOption = ({
  label,
  description,
  value,
  register,
  name,
  error,
  checkedValue,
  checkedContent,
  isDisabled = false,
  required = false,
  onAttemptSelect,
  fontSize = 'small',
}: RadioOptionProps) => {
  const isChecked = checkedValue === value

  const handleClick = () => {
    if (isDisabled && onAttemptSelect) {
      onAttemptSelect()
    }
  }

  const fontStyle = {
    small: isDisabled ? 'text-neutral-400 text-sm font-medium' : 'text-neutral-700 text-sm font-medium',
    large: isDisabled ? 'text-neutral-400 text-[20px] font-semibold font-poppins' : 'text-neutral-900   font-semibold font-poppins',
  }

  return (
    <label className="flex flex-col gap-1 relative mt-4" onClick={handleClick}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center">
          <input
            type="radio"
            value={value}
            disabled={isDisabled}
            {...register(name, { required: required })}
            className="w-[18px] h-[18px]  appearance-none rounded-full border-2 border-neutral-300 
                     checked:border-primary relative bg-white
                     after:content-[''] after:absolute after:top-[3.5px] after:left-[3.5px]
                     after:w-[8px] after:h-[8px] after:rounded-full
                     after:bg-primary after:hidden checked:after:block"
          />
        </div>
        <div className="">
          <span className={`${fontStyle[fontSize]} `}>{label}</span>
          <p className="text-neutral-400 text-[12px]">{description ? description : ''}</p>
        </div>
      </div>

      {isChecked && checkedContent && <div className=" mt-2">{checkedContent}</div>}

      {error && <p className="absolute -bottom-4 left-0 text-red-500 text-2xs">{error}</p>}
    </label>
  )
}

export default RadioOption
