'use client'

import StudentFilterRow from '@/components/molecules/AdminDashboard/StudentFilterRow'
import StudentSearchBar from '@/components/molecules/AdminDashboard/StudentSearchBar'
import StudentSelectionActionBar from '@/components/molecules/AdminDashboard/StudentSelectionActionBar'

type Props = {
  searchTerm: string
  onSearchChange: (value: string) => void
  yearOptions: string[]
  majorOptions: string[]
  selectedYears: string[]
  selectedMajor: string
  onYearToggle: (year: string) => void
  onMajorChange: (major: string) => void
  selectedCount: number
  actionYear: string
  actionMajor: string
  onActionYearChange: (year: string) => void
  onActionMajorChange: (major: string) => void
  onApply: () => void
  onCancelSelection: () => void
  className?: string
}

export default function StudentFilterToolbar({
  searchTerm,
  onSearchChange,
  yearOptions,
  majorOptions,
  selectedYears,
  selectedMajor,
  onYearToggle,
  onMajorChange,
  selectedCount,
  actionYear,
  actionMajor,
  onActionYearChange,
  onActionMajorChange,
  onApply,
  onCancelSelection,
  className = '',
}: Props) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <StudentSearchBar value={searchTerm} onChange={onSearchChange} />

      <StudentFilterRow selectedYears={selectedYears} selectedMajor={selectedMajor} onYearToggle={onYearToggle} onMajorChange={onMajorChange} />

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
      />
    </div>
  )
}
