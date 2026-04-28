'use client'

import { FiLock } from 'react-icons/fi'
import Link from 'next/link'

type NavItem = {
  href: string
  label: string
  requiresUniversity?: boolean
}

type Props = {
  pathname: string
  hasSelectedUniversity: boolean
  items: NavItem[]
}

export default function AdminDashboardSidebar({ pathname, hasSelectedUniversity, items }: Props) {
  return (
    <aside className="rounded-2xl border border-neutral-200 bg-white p-4 md:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Navigation</p>

      <div className="mt-4 flex flex-col gap-2">
        {items.map((item) => {
          const isActive = pathname === item.href
          const isLocked = !!item.requiresUniversity && !hasSelectedUniversity

          if (isLocked) {
            return (
              <div
                key={item.href}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-400"
                title="Select university first"
              >
                <span>{item.label}</span>
                <FiLock size={14} />
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
