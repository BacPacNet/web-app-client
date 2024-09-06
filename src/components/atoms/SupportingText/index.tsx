import React, { ReactNode, HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export default function SupportingText({ children, className = '', ...rest }: TitleProps) {
  return (
    <p className={` font-normal text-neutral-500 font-inter ${className}`} {...rest}>
      {children}
    </p>
  )
}
