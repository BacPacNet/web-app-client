import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BlogBulletListProps = {
  children: ReactNode
  intro?: string
  className?: string
  introClassName?: string
}

export function BlogBulletList({ children, intro, className, introClassName }: BlogBulletListProps) {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      {intro && <p className={cn('text-xs text-neutral-700 leading-relaxed', introClassName)}>{intro}</p>}
      <ul className={cn('flex w-full flex-col items-start gap-2 pl-4 list-disc marker:text-neutral-700', className)}>{children}</ul>
    </div>
  )
}

type BlogBulletItemProps = {
  children: ReactNode
  bold?: boolean
  className?: string
}

export function BlogBulletItem({ children, bold = true, className }: BlogBulletItemProps) {
  return (
    <li className={cn('text-xs leading-relaxed text-neutral-700', bold ? 'font-bold' : 'font-normal text-neutral-700', className)}>{children}</li>
  )
}
