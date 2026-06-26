'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useState } from 'react'
import { FiExternalLink, FiMoreVertical, FiUserX } from 'react-icons/fi'

type Props = {
  onDeactivate?: () => void
  onViewProfile?: () => void
  isActive?: boolean
}

export default function StudentRowActionMenu({ onDeactivate, onViewProfile, isActive = true }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDeactivate = () => {
    onDeactivate?.()
    setIsOpen(false)
  }

  const handleViewProfile = () => {
    onViewProfile?.()
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          aria-label="Student actions"
        >
          <FiMoreVertical size={18} />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-44 border-none bg-white p-1 shadow-card">
        <div className="flex flex-col">
          {isActive && onDeactivate ? (
            <button
              type="button"
              onClick={handleDeactivate}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive-600 transition-colors hover:bg-neutral-50"
            >
              <FiUserX size={16} />
              Deactivate
            </button>
          ) : null}

          {onViewProfile ? (
            <button
              type="button"
              onClick={handleViewProfile}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              <FiExternalLink size={16} />
              View Profile
            </button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
