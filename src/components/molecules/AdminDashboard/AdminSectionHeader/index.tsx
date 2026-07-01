'use client'

import { cn } from '@/lib/utils'

type Props = {
  title: string
  description?: string
  className?: string
}

export default function AdminSectionHeader({ title, description, className }: Props) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <h2 className="text-xs font-semibold text-neutral-900">{title}</h2>
      {description ? <p className="text-2xs text-neutral-500">{description}</p> : null}
    </div>
  )
}
