// components/LoginButton.tsx
import React from 'react'

interface LoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

const LoginButton: React.FC<LoginButtonProps> = ({ className = '', children, ...props }) => {
  return (
    <button className={`bg-primary-500 text-white py-2 px-4 rounded-md active:scale-95 transition-transform duration-150 ${className}`} {...props}>
      {children}
    </button>
  )
}

export default LoginButton
