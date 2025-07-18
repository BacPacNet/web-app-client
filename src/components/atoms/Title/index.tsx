import React, { ReactNode, HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export default function Title({ children, className = '', ...rest }: TitleProps) {
  return (
    <h1 className={`!text-[20px] font-bold text-neutral-700 font-poppins ${className}`} {...rest}>
      {children}
    </h1>
  )
}
