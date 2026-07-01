'use client'

import { cn } from '@/lib/utils'
import { HiOutlineEye } from 'react-icons/hi2'

const DEFAULT_MESSAGE = 'Changes here update the live University page visible to students.'

type Props = {
  message?: string
  className?: string
}

export default function AdminLiveUpdateNotice({ message = DEFAULT_MESSAGE, className }: Props) {
  return (
    <div className={cn('flex items-center gap-2 rounded-lg border border-[#C7D2FE] bg-[#F0F4FF] px-3 py-2', className)}>
      <HiOutlineEye size={18} className="shrink-0 text-[#4338CA]" />
      <span className="text-2xs text-[#4338CA]">{message}</span>
    </div>
  )
}
