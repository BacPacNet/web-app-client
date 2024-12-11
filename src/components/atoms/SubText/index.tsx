import React, { ReactNode, HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export default function SubText({ children, className = '', ...rest }: TitleProps) {
  return (
    <p className={`text-2xs font-normal text-neutral-500 font-inter ${className}`} {...rest}>
      {children}
    </p>
  )
}
