'use client'
import { useEffect, useRef, useState } from 'react'
import { Calendar } from 'react-date-range'
import { addYears } from 'date-fns'
import { enGB } from 'date-fns/locale'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file
import { motion, AnimatePresence } from 'framer-motion'
import { CiCalendar } from 'react-icons/ci'
import { convertToDateObj } from '@/lib/utils'
interface SelectDropdownProps {
  onChange: (value: string) => void
  value: any
  placeholder?: string
  label?: string

  err: boolean
}

const DateSelect = ({ onChange, value, placeholder, err, label }: SelectDropdownProps) => {
  const [show, setShow] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleDateChange = (data: Date) => {
    onChange(new Date(data).toLocaleDateString())
    setShow(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShow(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <motion.div ref={dropdownRef} className="relative flex flex-col gap-2">
      {label && <label className="text-xs text-neutral-700 font-medium">{label}</label>}
      <div
        onClick={() => setShow(!show)}
        className={`${
          err ? 'border-red-400' : 'border-neutral-200'
        } flex justify-between items-center py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm   h-10 outline-none`}
      >
        <p className={`${value ? 'text-neutral-900' : 'text-neutral-400'}`}> {value ? value : placeholder}</p>
        <CiCalendar size={22} />
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            className="shadow-lg w-full absolute  z-10  left-0 top-full  max-xl:left-0 bg-white "
            initial={{ opacity: 0, y: '-10%' }}
            animate={{ opacity: 1, y: '5%' }}
            exit={{ opacity: 0, y: '-10%', transition: { duration: '0.35' } }}
            transition={{ type: 'spring', stiffness: '100', duration: '0.75' }}
          >
            <div className="w-full flex items-center justify-center ">
              <Calendar
                date={value ? (convertToDateObj(value) as Date) : new Date()}
                onChange={(item) => handleDateChange(item)}
                locale={enGB}
                minDate={addYears(new Date(), -100)}
                maxDate={new Date()}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default DateSelect
