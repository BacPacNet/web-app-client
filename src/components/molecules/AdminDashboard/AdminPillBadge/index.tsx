'use client'

import { getInactiveOpacityClass } from '@/lib/utils'

export type AdminPillBadgeVariant = 'neutral' | 'primary' | 'success'

const VARIANT_STYLES: Record<AdminPillBadgeVariant, string> = {
  neutral: 'bg-neutral-100 text-neutral-600',
  primary: 'bg-surface-primary-50 text-primary-500',
  success: 'bg-green-50 text-green-700',
}

type Props = {
  label?: string | null
  variant?: AdminPillBadgeVariant
  isUserActive?: boolean
  className?: string
}

export function getStudyYearBadgeVariant(year?: string | null): AdminPillBadgeVariant {
  if (!year) {
    return 'neutral'
  }

  if (year.includes('2')) {
    return 'success'
  }

  return 'primary'
}

export default function AdminPillBadge({ label, variant = 'primary', isUserActive = true, className = '' }: Props) {
  const inactiveOpacityClass = getInactiveOpacityClass(isUserActive)

  if (!label) {
    return <span className={`text-sm text-neutral-400 ${inactiveOpacityClass} ${className}`.trim()}>-</span>
  }

  return (
    <span
      className={`inline-flex w-max shrink-0 items-center whitespace-nowrap rounded-full px-3 py-1 text-3xs font-semibold font-inter ${VARIANT_STYLES[variant]} ${inactiveOpacityClass} ${className}`.trim()}
    >
      {label}
    </span>
  )
}
