'use client'

import { cn } from '@/lib/utils'
import { IconType } from 'react-icons'
import { HiOutlineBars3BottomLeft, HiOutlinePhone, HiOutlinePhoto, HiOutlineSquares2X2 } from 'react-icons/hi2'

export type UniversityTabId = 'university-profile' | 'from-the-university' | 'university-overview' | 'contact-info'

export type UniversityTab = {
  id: UniversityTabId
  label: string
  icon: IconType
}

export const UNIVERSITY_TABS: UniversityTab[] = [
  { id: 'university-profile', label: 'University Profile', icon: HiOutlinePhoto },
  { id: 'from-the-university', label: 'From the University', icon: HiOutlineSquares2X2 },
  { id: 'university-overview', label: 'University Overview', icon: HiOutlineBars3BottomLeft },
  { id: 'contact-info', label: 'Contact Info', icon: HiOutlinePhone },
]

type Props = {
  activeTab: UniversityTabId
  onTabChange: (tabId: UniversityTabId) => void
  className?: string
}

export default function UniversityTabNav({ activeTab, onTabChange, className = '' }: Props) {
  return (
    <div className={cn('sticky top-0 z-10 border-b border-neutral-200 bg-surface-neutral-100', className)}>
      <div className="flex gap-1">
        {UNIVERSITY_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors focus:outline-none',
                isActive ? '-mb-px rounded-t-lg border-b-2 border-primary-500 bg-white text-primary-500' : 'text-neutral-400 hover:text-neutral-600'
              )}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-primary-500' : 'text-neutral-400'} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
