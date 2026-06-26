'use client'

type Props = {
  year?: string | null
  className?: string
}

function getYearBadgeStyles(year?: string | null) {
  if (!year) {
    return 'bg-neutral-100 text-neutral-600'
  }

  if (year.includes('2')) {
    return 'bg-green-50 text-green-700'
  }

  return 'bg-surface-primary-50 text-primary-500'
}

export default function StudentYearBadge({ year, className = '' }: Props) {
  if (!year) {
    return <span className="text-sm text-neutral-400">-</span>
  }

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getYearBadgeStyles(year)} ${className}`}>{year}</span>
}
