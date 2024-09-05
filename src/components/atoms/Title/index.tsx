import React, { ReactNode, HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export default function Title({ children, className = '', ...rest }: TitleProps) {
  return (
    <h1 className={`lg:text-lg text-md font-bold text-neutral-900 font-poppins ${className}`} {...rest}>
      {children}
    </h1>
  )
}
