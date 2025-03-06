'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AiOutlineInfoCircle } from 'react-icons/ai'

interface TooltipProps {
  content?: React.ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
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
    <div className="relative flex" ref={tooltipRef}>
      {/* Tooltip Icon */}
      <div onClick={() => setIsOpen(!isOpen)} className="text-primary-500">
        <AiOutlineInfoCircle size={20} />
      </div>

      {/* Tooltip Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-1/2 bottom-full mb-3 w-72 md:w-96 !-translate-x-1/4 md:!-translate-x-1/2 rounded-lg  bg-white p-4 shadow-2xl z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <p className="font-medium text-neutral-900">What is your status?</p>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              <li className="text-xs text-neutral-700">
                <span className="font-bold">• Students:</span> For current university students. Select if you are already enrolled.
              </li>
              <li className="text-xs text-neutral-700">
                <span className="font-bold">• Faculty:</span> For current university employees. Select if you have an occupation.
              </li>
              <li className="text-xs text-neutral-700">
                <span className="font-bold">• Applicant:</span> For those still under K-12 education. Select if you are not enrolled in a university.
              </li>
            </ul>
            {/* Small arrow pointing down */}
            <div className="absolute left-1/4  md:left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-white"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip
