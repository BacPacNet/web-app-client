'use client'

import Buttons from '@/components/atoms/Buttons'
import AdminDashboardSidebar from '@/components/organisms/AdminDashboardSidebar'
import useCookie from '@/hooks/useCookie'
import {
  ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE,
  ADMIN_DASHBOARD_REFRESH_TOKEN_COOKIE,
  ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE,
  parseAdminDashboardSelectedUniversity,
} from '@/utils/adminDashboard'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useMemo } from 'react'

type Props = {
  title: string
  children: ReactNode
}

const navItems = [
  { href: '/admin-dashboard', label: 'Dashboard', requiresUniversity: true },
  { href: '/admin-dashboard/users', label: 'Users', requiresUniversity: true },
  { href: '/admin-dashboard/groups', label: 'Groups', requiresUniversity: true },
  { href: '/admin-dashboard/select-university', label: 'Select University' },
]

export default function AdminDashboardShell({ title, children }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [, , deleteAccessToken] = useCookie(ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE)
  const [, , deleteRefreshToken] = useCookie(ADMIN_DASHBOARD_REFRESH_TOKEN_COOKIE)
  const [selectedUniversityCookie, , deleteSelectedUniversity] = useCookie(ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE)

  const selectedUniversity = useMemo(() => {
    if (!selectedUniversityCookie) return null

    const parsedUniversity = parseAdminDashboardSelectedUniversity(selectedUniversityCookie)
    if (!parsedUniversity) {
      return null
    }

    return parsedUniversity
  }, [selectedUniversityCookie])

  const hasSelectedUniversity = useMemo(() => Boolean(selectedUniversity?._id || selectedUniversity?.name), [selectedUniversity])

  useEffect(() => {
    if (!selectedUniversityCookie) return

    const parsedUniversity = parseAdminDashboardSelectedUniversity(selectedUniversityCookie)
    if (!parsedUniversity) {
      deleteSelectedUniversity()
    }
  }, [deleteSelectedUniversity, selectedUniversityCookie])

  const handleLogout = () => {
    deleteAccessToken()
    deleteRefreshToken()
    deleteSelectedUniversity()
    router.replace('/admin-dashboard/login')
  }

  return (
    <div className="min-h-screen bg-surface-neutral-100 px-4 py-8 md:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <AdminDashboardSidebar pathname={pathname} hasSelectedUniversity={hasSelectedUniversity} items={navItems} />

            <Buttons variant="border" size="medium" onClick={handleLogout}>
              Sign out
            </Buttons>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Admin Dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold text-neutral-900">{title}</h1>
            {selectedUniversity?.name ? <p className="mt-1 text-sm text-neutral-500">{selectedUniversity.name}</p> : null}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
