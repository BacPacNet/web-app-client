import React, { ReactNode, HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export default function SubText({ children, className = '', ...rest }: TitleProps) {
  return (
    <p className={`lg:text-2xs text-xs font-normal text-neutral-500 font-inter ${className}`} {...rest}>
      {children}
    </p>
  )
}
