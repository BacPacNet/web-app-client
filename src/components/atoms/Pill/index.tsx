import React from 'react'

interface PillProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  className?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'shade' | 'border' | 'border_primary'
  size?: 'small' | 'medium' | 'large' | 'extra_small' | 'extra_small_paddind_2'
}

const Pill: React.FC<PillProps> = ({ className = '', variant = 'primary', size = 'small', children, disabled, ...props }) => {
  const variantClasses = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-gray-500 text-white',
    border: 'border border-neutral-200 text-neutral-800 shadow-button ',
    border_primary: 'border border-primary text-primary ',
    danger: 'bg-red-500 text-white',
    shade: 'bg-secondary border border-shade-button-border text-primary-500 drop-shadow-sm',
  }
  const variantSizes = {
    small: 'text-sm py-2 px-4 ',
    medium: 'text-md py-2 px-4 ',
    large: 'text-lg py-2 px-4 ',
    extra_small: 'text-2xs py-1 px-2',
    extra_small_paddind_2: 'text-3xs py-2 px-2',
  }

  const variantClass = variantClasses[variant]
  const variantSize = variantSizes[size]
  return (
    <div
      className={`${variantClass} ${variantSize} rounded-md active:scale-95 transition-transform duration-150 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Pill
