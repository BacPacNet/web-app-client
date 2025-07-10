import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'shade'
    | 'border'
    | 'border_primary'
    | 'disable'
    | 'danger_secondary'
    | 'notificationDanger'
    | 'border_danger'
  size?: 'small' | 'medium' | 'large'
  leftIcon?: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Buttons: React.FC<ButtonProps> = ({
  className = '',
  variant = 'primary',
  size = 'small',
  children,
  disabled,
  leftIcon = null,
  onClick,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-gray-500 text-white',
    border: 'border border-neutral-200 text-neutral-500 shadow-button ',
    border_primary: 'border border-primary text-primary bg-white ',
    border_danger: 'border border-destructive-500 text-destructive-500 bg-white ',
    danger: 'bg-red-500 text-white',
    danger_secondary: 'text-destructive-600 bg-[#FEF2F2] border border-[#FECACA] ',
    notificationDanger: 'bg-destructive-50 text-destructive-500 border border-destructive-200',
    shade: 'bg-secondary border border-shade-button-border text-primary-500 drop-shadow-sm',
    disable: 'bg-primary-300 text-white',
  }
  const variantSizes = {
    small: 'text-2xs py-3 px-4 h-9 ',
    medium: 'text-xs py-3 px-4 h-10',
    large: 'text-xs py-3 px-4 h-10 md:text-sm md:h-12',
  }

  const variantClass = variantClasses[variant]
  const variantSize = variantSizes[size]
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${variantClass} ${variantSize} rounded-md active:scale-95 transition-transform duration-150 font-medium flex items-center justify-center  ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
    </button>
  )
}

export default Buttons
