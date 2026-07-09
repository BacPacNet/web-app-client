'use client'

import { getInactiveOpacityClass } from '@/lib/utils'
import { HiCheckCircle } from 'react-icons/hi2'

type Props = {
  isActive: boolean
  className?: string
}

export default function AdminUserStatusBadge({ isActive, className = '' }: Props) {
  const inactiveOpacityClass = getInactiveOpacityClass(isActive)

  if (isActive) {
    return (
      <span
        className={`flex items-center w-max justify-center gap-1 rounded-md bg-green-50 border border-[#86EFAC] px-2.5 py-1 text-xs font-medium text-green-700 ${inactiveOpacityClass} ${className}`.trim()}
      >
        <HiCheckCircle size={20} className="text-green-600" />
        <span className="text-3xs font-semibold font-inter text-[#15803D]">Active</span>
      </span>
    )
  }

  return (
    <span
      className={`flex items-center  w-max justify-center rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 ${inactiveOpacityClass} ${className}`.trim()}
    >
      Inactive
    </span>
  )
}
