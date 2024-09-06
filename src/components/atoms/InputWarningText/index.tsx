import React, { ReactNode, HTMLAttributes } from 'react'

interface InputWarningTextProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export default function InputWarningText({ children, className = '', ...rest }: InputWarningTextProps) {
  return (
    <span className={`text-red-500 font-normal ${className}`} {...rest}>
      {children}
    </span>
  )
}
