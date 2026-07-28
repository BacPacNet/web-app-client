import { ReactNode } from 'react'
import SectionBadge, { type SectionBadgeVariant } from '@/components/atoms/SectionBadge'

interface SectionHeaderProps {
  badge: string
  badgeVariant?: SectionBadgeVariant
  title: ReactNode
  highlight?: string
  highlightClassName?: string
  description?: ReactNode
  align?: 'center' | 'start'
  maxWidth?: 'max-w-[800px]' | 'full-width'
  className?: string
  descriptionClassName?: string
  maxtitleWidth?: 'max-w-[800px]' | 'full-width'
}

export default function SectionHeader({
  badge,
  badgeVariant = 'indigo',
  title,
  highlight,
  highlightClassName = 'text-primary-500',
  description,
  align = 'center',
  maxWidth = 'full-width',
  className = '',
  descriptionClassName = 'max-w-lg',
  maxtitleWidth = 'full-width',
}: SectionHeaderProps) {
  const alignmentClasses = align === 'start' ? 'items-center text-center lg:items-start lg:text-left' : 'items-center text-center'

  return (
    <div className={`mx-auto flex ${maxWidth === 'full-width' ? 'w-full' : 'max-w-[800px]'} flex-col gap-4 ${alignmentClasses} ${className}`}>
      <SectionBadge variant={badgeVariant}>{badge}</SectionBadge>
      <h2
        className={`font-poppins text-md-big lg:text-[36px] font-bold text-[#131A2B] ${
          maxtitleWidth === 'full-width' ? 'max-w-full' : 'max-w-[800px]'
        }`}
      >
        {title}
        {highlight ? <span className={highlightClassName}>{highlight}</span> : null}
      </h2>
      {description ? <p className={`font-inter  text-[15px] lg:text-2sm text-[#5B6477] ${descriptionClassName}`}>{description}</p> : null}
    </div>
  )
}
