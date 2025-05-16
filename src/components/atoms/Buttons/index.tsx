import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'shade' | 'border' | 'border_primary' | 'disable' | 'danger_secondary' | 'notificationDanger'
  size?: 'small' | 'medium' | 'large' | 'extra_small' | 'extra_small_paddind_2' | 'height40' | 'small_profile'
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
    border_primary: 'border border-primary text-primary ',
    danger: 'bg-red-500 text-white',
    danger_secondary: 'text-destructive-600 bg-[#FEF2F2] border border-[#FECACA] ',
    notificationDanger: 'bg-destructive-50 text-destructive-500 border border-destructive-200',
    shade: 'bg-secondary border border-shade-button-border text-primary-500 drop-shadow-sm',
    disable: 'bg-primary-300 text-white',
  }
  const variantSizes = {
    small: 'text-sm py-2 px-4 ',
    small_profile: 'py-3 px-4 text-2xs',
    medium: 'text-xs py-3 px-3 h-10',
    large: 'text-sm p-3  h-12 ',
    extra_small: 'text-3xs sm:text-2xs py-1 px-2',
    extra_small_paddind_2: 'text-2xs py-2 px-3',
    height40: 'text-2xs sm:text-xs p-2 sm:p-3 sm:h-10 ',
  }

  const variantClass = variantClasses[variant]
  const variantSize = variantSizes[size]
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${variantClass} ${variantSize} rounded-md active:scale-95 transition-transform duration-150 font-medium flex items-center justify-center ${
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
