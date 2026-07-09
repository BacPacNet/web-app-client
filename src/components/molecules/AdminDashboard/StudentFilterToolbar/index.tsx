'use client'

import AdminUserSearchBar from '@/components/molecules/AdminDashboard/AdminUserSearchBar'
import StudentFilterRow from '@/components/molecules/AdminDashboard/StudentFilterRow'
import StudentSelectionActionBar from '@/components/molecules/AdminDashboard/StudentSelectionActionBar'

type Props = {
  searchTerm: string
  onSearchChange: (value: string) => void
  yearOptions: string[]
  majorOptions: string[]
  selectedYears: string[]
  selectedMajors: string[]
  onYearChange: (years: string[]) => void
  onMajorChange: (majors: string[]) => void
  selectedCount: number
  actionYear: string
  actionMajor: string
  onActionYearChange: (year: string) => void
  onActionMajorChange: (major: string) => void
  onApply: () => void
  onCancelSelection: () => void
  isApplying?: boolean
  className?: string
}

export default function StudentFilterToolbar({
  searchTerm,
  onSearchChange,
  selectedYears,
  selectedMajors,
  onYearChange,
  onMajorChange,
  selectedCount,
  yearOptions,
  majorOptions,
  actionYear,
  actionMajor,
  onActionYearChange,
  onActionMajorChange,
  onApply,
  onCancelSelection,
  isApplying = false,
  className = '',
}: Props) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <AdminUserSearchBar value={searchTerm} onChange={onSearchChange} placeholder="Search by name, email or major..." />

      <StudentFilterRow selectedYears={selectedYears} selectedMajors={selectedMajors} onYearChange={onYearChange} onMajorChange={onMajorChange} />

      <StudentSelectionActionBar
        selectedCount={selectedCount}
        yearOptions={yearOptions}
        majorOptions={majorOptions}
        actionYear={actionYear}
        actionMajor={actionMajor}
        onActionYearChange={onActionYearChange}
        onActionMajorChange={onActionMajorChange}
        onApply={onApply}
        onCancel={onCancelSelection}
        isApplying={isApplying}
      />
    </div>
  )
}
