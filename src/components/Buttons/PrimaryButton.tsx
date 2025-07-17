import React from 'react'

export interface ButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    React.AriaAttributes {}

export const ButtonPrimary: React.FC<ButtonProps> = (props) => {
  const { children, className, ...rest } = props

  return (
    <button className={`primary-btn ${className}`} {...rest}>
      {children}
    </button>
  )
}
