'use client'

import SelectUniversityDropdown from '@/components/atoms/SelectUniversityDropDown'
import AdminDashboardShell from '../AdminDashboardShell'
import useCookie from '@/hooks/useCookie'
import {
  ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE,
  AdminDashboardSelectedUniversity,
  parseAdminDashboardSelectedUniversity,
  serializeAdminDashboardSelectedUniversity,
} from '@/utils/adminDashboard'
import { useEffect, useState } from 'react'

type UniversityOption = {
  _id: string
  name: string
  logo?: string | null
}

export default function AdminDashboardSelectUniversityScreen() {
  const [selectedUniversity, setSelectedUniversity] = useState<AdminDashboardSelectedUniversity | null>(null)
  const [selectedUniversityCookie, setSelectedUniversityCookie, deleteSelectedUniversityCookie] = useCookie(
    ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE
  )

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

  const handleUniversitySelect = (university: UniversityOption) => {
    const universityToPersist: AdminDashboardSelectedUniversity = {
      _id: university._id,
      name: university.name,
    }

    setSelectedUniversity(universityToPersist)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    setSelectedUniversityCookie(serializeAdminDashboardSelectedUniversity(universityToPersist), expiresAt)
  }

  return (
    <AdminDashboardShell title="Select University">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-neutral-200 p-5">
          <SelectUniversityDropdown
            label="University"
            value={selectedUniversity?.name || ''}
            onChange={handleUniversitySelect}
            placeholder="Search and select a university"
            icon="single"
            search={true}
          />

          {selectedUniversity && (
            <div className="mt-4 rounded-xl bg-primary-50 p-4">
              <p className="text-xs font-semibold text-primary-500">Selected</p>
              <p className="mt-1 text-sm font-medium text-neutral-900">{selectedUniversity.name}</p>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardShell>
  )
}
