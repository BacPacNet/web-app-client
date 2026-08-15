'use client'

import { Spinner } from '@/components/spinner/Spinner'

type Props = {
  label: string
  className?: string
}

export default function AdminTableLoadingState({ label, className = 'px-4 py-6' }: Props) {
  return (
    <div className={`flex items-center justify-center gap-2 text-primary-500 ${className}`}>
      <Spinner />
      <p className="text-sm text-neutral-500">{label}</p>
    </div>
  )
}
