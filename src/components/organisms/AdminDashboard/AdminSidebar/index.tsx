'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'
import { IconType } from 'react-icons'
import { HiOutlineShieldCheck, HiOutlineShieldExclamation, HiOutlineSquares2X2, HiOutlineUsers } from 'react-icons/hi2'
import { RiGraduationCapLine } from 'react-icons/ri'
import { useUniStore } from '@/store/store'
import unibuzzLogo from '@assets/unibuzz_dark_square.png'
export type AdminDashboardSidebarNavItem = {
  href: string
  label: string
  icon: IconType
}

const defaultNavItems: AdminDashboardSidebarNavItem[] = [
  { href: '/admin/students', label: 'Students', icon: HiOutlineUsers },
  { href: '/admin/faculty', label: 'Faculty', icon: RiGraduationCapLine },
  { href: '/admin/university', label: 'University', icon: HiOutlineSquares2X2 },
  { href: '/admin/accounts', label: 'Admin Accounts', icon: HiOutlineShieldCheck },
  { href: '/admin/moderation', label: 'Moderation', icon: HiOutlineShieldExclamation },
]

type Props = {
  items?: AdminDashboardSidebarNavItem[]
  userName?: string
  userEmail?: string
  userInitials?: string
}

function getInitials(firstName?: string, lastName?: string, fallback?: string) {
  const first = firstName?.trim().charAt(0) ?? ''
  const last = lastName?.trim().charAt(0) ?? ''

  if (first || last) {
    return `${first}${last}`.toUpperCase()
  }

  return fallback ?? 'A'
}

export default function AdminDashboardSidebar({ items = defaultNavItems, userName, userEmail, userInitials }: Props) {
  const pathname = usePathname()
  const { userData, userProfileData } = useUniStore()

  const displayName = useMemo(() => {
    if (userName) return userName

    const firstName = userData?.firstName ?? userProfileData?.firstName
    const lastName = userData?.lastName ?? userProfileData?.lastName
    const fullName = [firstName, lastName].filter(Boolean).join(' ')

    return fullName || 'Admin'
  }, [userData?.firstName, userData?.lastName, userName, userProfileData?.firstName, userProfileData?.lastName])

  const displayEmail = useMemo(() => {
    if (userEmail) return userEmail

    if (userData?.email) return userData.email
  }, [userData?.email, userEmail])

  const displayInitials = useMemo(() => {
    if (userInitials) return userInitials

    return getInitials(userData?.firstName ?? userProfileData?.firstName, userData?.lastName ?? userProfileData?.lastName, 'A')
  }, [userData?.firstName, userData?.lastName, userInitials, userProfileData?.firstName, userProfileData?.lastName])

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 self-start flex-col border-r border-neutral-200 bg-white">
      <div className="px-5 py-7 flex flex-col">
        <Link href="/timeline" className="flex items-center gap-3" aria-label="Go to timeline">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl ">
            <Image src={unibuzzLogo} alt="Unibuzz logo" className="h-8 w-8 object-contain rounded-xl" />
          </div>
          <p className="text-[20px] font-poppins font-bold text-[#111827]">Unibuzz</p>
        </Link>
        <div className="mt-[6px]">
          <p className="text-2xs text-[#9CA3AF]">Admin Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        <p className=" text-2xs font-semibold uppercase text-[#9CA3AF]">Navigation</p>

        <ul className="mt-3 flex flex-col gap-1">
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`) || (pathname === '/admin' && item.href === '/admin/students')
            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive ? 'bg-surface-primary-50  text-primary-500 font-semibold' : 'text-[#6B7280] hover:bg-neutral-50 hover:text-neutral-700'
                  }`}
                >
                  <Icon size={16} strokeWidth={isActive ? 3 : 1} className={isActive ? 'text-primary-500' : 'text-[#9CA3AF]'} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-neutral-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#4F46E5] text-3xs font-semibold text-white">
            {displayInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-2xs font-semibold text-[#111827]">{displayName}</p>
            {displayEmail ? <p className="truncate text-2xs text-[#6B7280]">{displayEmail}</p> : null}
          </div>
        </div>
      </div>
    </aside>
  )
}
