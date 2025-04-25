import React, { ReactNode, HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  defaultPadding?: boolean
}
const Card = React.forwardRef<HTMLDivElement, TitleProps>((props: TitleProps, ref) => {
  const { children, className = '', defaultPadding = true, ...rest } = props
  return (
    <div ref={ref} className={`relative z-10 shadow-card bg-white ${defaultPadding ? 'py-4' : ''}  ${className}`} {...rest}>
      {children}
    </div>
  )
})

Card.displayName = 'Card'
export default Card
