import React, { ReactNode, HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export default function Text({ children, className = '', ...rest }: TitleProps) {
  return (
    <p className={`lg:text-md text-sm font-normal text-neutral-700 font-inter ${className}`} {...rest}>
      {children}
    </p>
  )
}
