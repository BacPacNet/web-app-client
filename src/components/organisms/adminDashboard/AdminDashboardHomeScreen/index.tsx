'use client'

import AdminDashboardShell from '../AdminDashboardShell'
import useCookie from '@/hooks/useCookie'
import {
  ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE,
  AdminDashboardSelectedUniversity,
  parseAdminDashboardSelectedUniversity,
} from '@/utils/adminDashboard'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAdminDashboardStats } from '@/services/admin-dashboard-auth'

export default function AdminDashboardHomeScreen() {
  const [selectedUniversity, setSelectedUniversity] = useState<AdminDashboardSelectedUniversity | null>(null)
  const [selectedUniversityCookie, , deleteSelectedUniversityCookie] = useCookie(ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE)
  const { data: dashboardStats, isLoading, isError } = useAdminDashboardStats(selectedUniversity?.name || '')

  useEffect(() => {
    if (!selectedUniversityCookie) {
      setSelectedUniversity(null)
      return
    }

    const parsedUniversity = parseAdminDashboardSelectedUniversity(selectedUniversityCookie)
    if (!parsedUniversity) {
      deleteSelectedUniversityCookie()
      return
    }

    setSelectedUniversity(parsedUniversity)
  }, [deleteSelectedUniversityCookie, selectedUniversityCookie])

  return (
    <AdminDashboardShell title="Dashboard">
      <div className="mt-6 rounded-2xl border border-neutral-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">University Stats</p>

        {!selectedUniversity && <p className="mt-3 text-sm text-neutral-500">Select a university first to view dashboard statistics.</p>}

        {selectedUniversity && isLoading && <p className="mt-3 text-sm text-neutral-500">Loading dashboard statistics...</p>}

        {selectedUniversity && isError && <p className="mt-3 text-sm text-red-500">Failed to load dashboard statistics.</p>}

        {selectedUniversity && !isLoading && !isError && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-sm text-neutral-500">Total Users</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">{dashboardStats?.totalUsers ?? 0}</p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-sm text-neutral-500">Total Student Users</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">{dashboardStats?.totalStudentUsers ?? 0}</p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-sm text-neutral-500">Total Faculty Users</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">{dashboardStats?.totalFacultyUsers ?? 0}</p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-sm text-neutral-500">Total Groups</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">{dashboardStats?.totalGroups ?? 0}</p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-sm text-neutral-500">Total Official Groups</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">{dashboardStats?.totalOfficialGroups ?? 0}</p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4">
              <p className="text-sm text-neutral-500">Total Casual Groups</p>
              <p className="mt-2 text-2xl font-semibold text-neutral-900">{dashboardStats?.totalCasualGroups ?? 0}</p>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardShell>
  )
}
