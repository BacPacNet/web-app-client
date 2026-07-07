'use client'

import Buttons from '@/components/atoms/Buttons'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import AutomationDashboardShell from '../AutomationDashboardShell'
import useCookie from '@/hooks/useCookie'
import {
  ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE,
  AdminDashboardSelectedUniversity,
  parseAdminDashboardSelectedUniversity,
} from '@/utils/adminDashboard'
import { getDaysInMonth } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { SemesterStart, useAdminDashboardStats, useSetSemesterStart } from '@/services/admin-dashboard-auth'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getMaxDaysInMonth(month: number) {
  if (month < 1 || month > 12) return 31
  return getDaysInMonth(new Date(2000, month - 1))
}

function getDayOptionsForMonth(monthName: string) {
  const month = MONTH_NAMES.indexOf(monthName) + 1
  if (!month) return []
  return Array.from({ length: getMaxDaysInMonth(month) }, (_, index) => String(index + 1))
}

function formatSemesterStart(semesterStart: SemesterStart) {
  const monthName = MONTH_NAMES[semesterStart.month - 1]
  if (!monthName) return `${semesterStart.day}/${semesterStart.month}`
  return `${monthName} ${semesterStart.day}`
}

function semesterStartToFormValues(semesterStart: SemesterStart) {
  const maxDays = getMaxDaysInMonth(semesterStart.month)
  const day = Math.min(semesterStart.day, maxDays)
  return {
    day: String(day),
    month: MONTH_NAMES[semesterStart.month - 1] || '',
  }
}

export default function AutomationDashboardHomeScreen() {
  const [selectedUniversity, setSelectedUniversity] = useState<AdminDashboardSelectedUniversity | null>(null)
  const [selectedUniversityCookie, , deleteSelectedUniversityCookie] = useCookie(ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE)
  const universityName = selectedUniversity?.name || ''
  const { data: dashboardStats, isLoading, isError } = useAdminDashboardStats(universityName)
  const { mutate: setSemesterStartMutation, isPending: isSettingSemesterStart } = useSetSemesterStart(universityName)

  const [isEditingSemesterStart, setIsEditingSemesterStart] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')

  const dayOptions = useMemo(() => getDayOptionsForMonth(selectedMonth), [selectedMonth])

  useEffect(() => {
    if (!selectedMonth || !selectedDay) return
    const month = MONTH_NAMES.indexOf(selectedMonth) + 1
    if (!month) return
    const maxDays = getMaxDaysInMonth(month)
    if (Number(selectedDay) > maxDays) {
      setSelectedDay(String(maxDays))
    }
  }, [selectedMonth, selectedDay])

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

  useEffect(() => {
    setIsEditingSemesterStart(false)
    setSelectedDay('')
    setSelectedMonth('')
  }, [universityName])

  const hasSemesterStart = Boolean(dashboardStats?.semesterStart?.day && dashboardStats?.semesterStart?.month)

  const openSemesterStartEditor = () => {
    if (dashboardStats?.semesterStart) {
      const formValues = semesterStartToFormValues(dashboardStats.semesterStart)
      setSelectedDay(formValues.day)
      setSelectedMonth(formValues.month)
    } else {
      setSelectedDay('')
      setSelectedMonth('')
    }
    setIsEditingSemesterStart(true)
  }

  const handleSaveSemesterStart = () => {
    const month = MONTH_NAMES.indexOf(selectedMonth) + 1
    const day = Number(selectedDay)
    const maxDays = getMaxDaysInMonth(month)

    if (!day || !month || day > maxDays) return

    setSemesterStartMutation(
      { day, month },
      {
        onSuccess: () => setIsEditingSemesterStart(false),
      }
    )
  }

  return (
    <AutomationDashboardShell title="Dashboard">
      <div className="mt-6 rounded-2xl border border-neutral-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">University Stats</p>

        {!selectedUniversity && <p className="mt-3 text-sm text-neutral-500">Select a university first to view dashboard statistics.</p>}

        {selectedUniversity && isLoading && <p className="mt-3 text-sm text-neutral-500">Loading dashboard statistics...</p>}

        {selectedUniversity && isError && <p className="mt-3 text-sm text-red-500">Failed to load dashboard statistics.</p>}

        {selectedUniversity && !isLoading && !isError && (
          <>
            <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-neutral-500">Semester Start</p>
                  {hasSemesterStart && dashboardStats?.semesterStart ? (
                    <p className="mt-1 text-lg font-semibold text-neutral-900">{formatSemesterStart(dashboardStats.semesterStart)}</p>
                  ) : (
                    <p className="mt-1 text-sm text-neutral-500">No semester start date set</p>
                  )}
                </div>

                {!isEditingSemesterStart && (
                  <Buttons variant="border_primary" size="medium" onClick={openSemesterStartEditor}>
                    {hasSemesterStart ? 'Change' : 'Set'}
                  </Buttons>
                )}
              </div>

              {isEditingSemesterStart && (
                <div className="mt-4 flex flex-col gap-3 border-t border-neutral-200 pt-4 sm:flex-row sm:items-end">
                  <div className="w-full max-w-[220px]">
                    <SelectDropdown
                      label="Month"
                      options={MONTH_NAMES}
                      value={selectedMonth}
                      onChange={setSelectedMonth}
                      placeholder="Month"
                      icon="single"
                      err={false}
                      isAllowedToRemove={false}
                    />
                  </div>
                  <div className="w-full max-w-[160px]">
                    <SelectDropdown
                      label="Day"
                      options={dayOptions}
                      value={selectedDay}
                      onChange={setSelectedDay}
                      placeholder="Day"
                      icon="single"
                      err={false}
                      isAllowedToRemove={false}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Buttons
                      variant="primary"
                      size="medium"
                      onClick={handleSaveSemesterStart}
                      disabled={!selectedDay || !selectedMonth || isSettingSemesterStart}
                    >
                      {isSettingSemesterStart ? 'Saving...' : 'Save'}
                    </Buttons>
                    <Buttons variant="border" size="medium" onClick={() => setIsEditingSemesterStart(false)} disabled={isSettingSemesterStart}>
                      Cancel
                    </Buttons>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-neutral-50 p-4">
                <p className="text-sm text-neutral-500">Total Users</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">{dashboardStats?.totalUsers ?? 0}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4">
                <p className="text-sm text-neutral-500">Total Applicants Users</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">{dashboardStats?.totalApplicantsUsers ?? 0}</p>
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
          </>
        )}
      </div>
    </AutomationDashboardShell>
  )
}
