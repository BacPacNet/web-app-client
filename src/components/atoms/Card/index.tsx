import React, { ReactNode, HTMLAttributes } from 'react'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}
const Card = React.forwardRef<HTMLDivElement, TitleProps>((props: TitleProps, ref) => {
  const { children, className = '', ...rest } = props
  return (
    <div ref={ref} className={`${className} font-poppins relative z-10 shadow-card bg-white py-4 `} {...rest}>
      {children}
    </div>
  )
})

export default Card
