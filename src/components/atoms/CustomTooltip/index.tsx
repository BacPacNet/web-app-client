'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  icon: ReactNode
  content: ReactNode
  position?: 'top' | 'right' | 'bottom' | 'left'
}

const CustomTooltip: React.FC<TooltipProps> = ({ icon, content, position = 'right' }) => {
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

  const getPositionClass = () => {
    if (position === 'top') return 'bottom-full mb-2 left-1/2 -translate-x-1/2'
    if (position === 'right') return 'left-full ml-3 -translate-y-1/2'
    if (position === 'bottom') return 'top-full mt-2 -left-1/2 -translate-x-1/2'
    if (position === 'left') return 'right-full mr-3 top-1/2 -translate-y-1/2'
    return ''
  }

  const getMotionProps = () => {
    if (position === 'top') return { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } }
    if (position === 'bottom') return { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 } }
    if (position === 'left') return { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -10 } }
    return { initial: { opacity: 0, x: 10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 10 } } // default right
  }

  const positionClass = getPositionClass()
  const motionProps = getMotionProps()

  return (
    <div className="relative flex items-center" ref={tooltipRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer text-primary-500">
        {icon}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute z-50 w-[250px] sm:w-[400px] rounded-lg bg-white p-4 shadow-card ${positionClass}`}
            initial={motionProps.initial}
            animate={motionProps.animate}
            exit={motionProps.exit}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomTooltip
