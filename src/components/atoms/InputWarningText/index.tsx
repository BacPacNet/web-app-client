import React, { ReactNode, HTMLAttributes } from 'react'

interface InputWarningTextProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export default function InputWarningText({ children, className = '', ...rest }: InputWarningTextProps) {
  return (
    <span className={`text-red-500 font-normal text-2xs mt-2 ${className}`} {...rest}>
      {children}
    </span>
  )
}
