'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  icon: ReactNode
  content: ReactNode
}

const CustomTooltip: React.FC<TooltipProps> = ({ icon, content }) => {
  const [isOpen, setIsOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative flex items-center" ref={tooltipRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer text-primary-500">
        {icon}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-full ml-3 -top-10  w-max rounded-lg bg-white p-4 shadow-2xl z-50"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            {content}

            <div className="absolute top-1/2 -left-4 -translate-y-1/2 border-8 border-transparent border-r-white z-50"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomTooltip
