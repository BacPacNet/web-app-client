import React, { ReactNode, useState } from 'react'

interface TooltipProps {
  text: string // The text to display in the tooltip
  children: ReactNode // The element that triggers the tooltip
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-slate-600 text-white text-[8px] px-3 py-1 rounded shadow-lg z-50">
          {text}
        </div>
      )}
    </div>
  )
}

export default Tooltip
