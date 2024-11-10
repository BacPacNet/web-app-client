import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'

interface OTPInputProps {
  length: number
  value: string
  onChange: (otp: string) => void
}

const OTPInput: React.FC<OTPInputProps> = ({ length, value, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null))

  useEffect(() => {
    const formattedValue = value?.padEnd(length, ' ').slice(0, length)
    setOtp(Array.from(formattedValue))
  }, [value, length])

  const handleChange = (newOtp: string[]) => {
    onChange(newOtp.join(''))
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value.slice(-1)
    if (/[^0-9]/.test(newValue)) return

    setOtp((prevOtp) => {
      const newOtp = [...prevOtp]
      newOtp[index] = newValue

      handleChange(newOtp)

      return newOtp
    })

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault()

      setOtp((prevOtp) => {
        const newOtp = [...prevOtp]
        newOtp[index] = ''

        handleChange(newOtp)

        return newOtp
      })

      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.select()
  }

  return (
    <div className="flex justify-center gap-2">
      {otp.map((data, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          value={data}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleInput(e, index)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
          onFocus={handleFocus}
          className="w-10 h-12 px-3 py-1 text-2xl text-neutral-400 font-semibold text-center border border-neutral-200 rounded-lg focus:outline-none focus:ring-2"
        />
      ))}
    </div>
  )
}

export default OTPInput
