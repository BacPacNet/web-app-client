import React, { ReactNode, HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export default function Card({ children, className = '', ...rest }: TitleProps) {
  return (
    <div className={`relative z-10 shadow-2xl bg-white py-8 ${className}`} {...rest}>
      {children}
    </div>
  )
}
