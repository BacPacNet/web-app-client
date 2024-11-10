import React, { ReactNode, HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export default function SettingsText({ children, className = '', ...rest }: TitleProps) {
  return (
    <p className={`font-bold text-neutral-700 font-inter ${className}`} {...rest}>
      {children}
    </p>
  )
}
