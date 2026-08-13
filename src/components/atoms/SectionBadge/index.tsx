import { ReactNode } from 'react'

export type SectionBadgeVariant = 'red' | 'indigo' | 'amber' | 'sky' | 'violet'

const variantClasses: Record<SectionBadgeVariant, string> = {
  red: 'bg-red-100 text-red-500',
  indigo: 'bg-indigo-100 text-indigo-500',
  amber: 'bg-amber-100 text-orange-500',
  sky: 'bg-sky-100 text-sky-500',
  violet: 'bg-violet-100 text-violet-500',
}

interface SectionBadgeProps {
  children: ReactNode
  variant?: SectionBadgeVariant
  className?: string
}

export default function SectionBadge({ children, variant = 'red', className = '' }: SectionBadgeProps) {
  return <span className={`rounded-full px-3 py-1 text-2xs font-bold ${variantClasses[variant]} ${className}`}>{children}</span>
}
