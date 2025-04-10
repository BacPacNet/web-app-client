import React, { ReactNode, HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}
const Card = React.forwardRef<HTMLDivElement, TitleProps>((props: TitleProps, ref) => {
  const { children, className = '', ...rest } = props
  return (
    <div ref={ref} className={`relative z-10 shadow-card bg-white py-4 ${className}`} {...rest}>
      {children}
    </div>
  )
})

Card.displayName = 'Card'
export default Card
