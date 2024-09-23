import React from 'react'

interface LoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'shade' | 'border' | 'border_primary'
}

const LoginButtons: React.FC<LoginButtonProps> = ({ className = '', variant = 'primary', children, ...props }) => {
  const variantClasses = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-gray-500 text-white',
    border: 'border border-neutral-200 text-neutral-800 ',
    border_primary: 'border border-primary text-primary ',
    danger: 'bg-red-500 text-white',
    shade: 'bg-secondary border border-shade-button-border text-primary-500 drop-shadow-sm',
  }

  const variantClass = variantClasses[variant]
  return (
    <button className={`${variantClass} py-2 px-4 rounded-md active:scale-95 transition-transform duration-150 ${className}`} {...props}>
      {children}
    </button>
  )
}

export default LoginButtons
