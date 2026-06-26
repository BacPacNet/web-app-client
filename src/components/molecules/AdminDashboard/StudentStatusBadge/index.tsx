'use client'

import { HiCheckCircle } from 'react-icons/hi2'

type Props = {
  isActive: boolean
  className?: string
}

export default function StudentStatusBadge({ isActive, className = '' }: Props) {
  if (isActive) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ${className}`}>
        <HiCheckCircle size={14} className="text-green-600" />
        Active
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 ${className}`}>
      Inactive
    </span>
  )
}
