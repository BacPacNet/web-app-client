'use client'

import AdminUserSearchBar from '@/components/molecules/AdminDashboard/AdminUserSearchBar'
import FacultyFilterRow from '@/components/molecules/AdminDashboard/FacultyFilterRow'
import FacultySelectionActionBar from '@/components/molecules/AdminDashboard/FacultySelectionActionBar'

type Props = {
  searchTerm: string
  onSearchChange: (value: string) => void
  occupationOptions: string[]
  affiliationOptions: string[]
  selectedOccupations: string[]
  selectedAffiliations: string[]
  onOccupationChange: (occupations: string[]) => void
  onAffiliationChange: (affiliations: string[]) => void
  selectedCount: number
  actionOccupation: string
  actionAffiliation: string
  onActionOccupationChange: (occupation: string) => void
  onActionAffiliationChange: (affiliation: string) => void
  onApply: () => void
  onCancelSelection: () => void
  isApplying?: boolean
  className?: string
}

export default function FacultyFilterToolbar({
  searchTerm,
  onSearchChange,
  selectedOccupations,
  selectedAffiliations,
  onOccupationChange,
  onAffiliationChange,
  selectedCount,
  occupationOptions,
  affiliationOptions,
  actionOccupation,
  actionAffiliation,
  onActionOccupationChange,
  onActionAffiliationChange,
  onApply,
  onCancelSelection,
  isApplying = false,
  className = '',
}: Props) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <AdminUserSearchBar value={searchTerm} onChange={onSearchChange} placeholder="Search by name, email or affiliation..." />

      <FacultyFilterRow
        selectedOccupations={selectedOccupations}
        selectedAffiliations={selectedAffiliations}
        onOccupationChange={onOccupationChange}
        onAffiliationChange={onAffiliationChange}
      />

      <FacultySelectionActionBar
        selectedCount={selectedCount}
        occupationOptions={occupationOptions}
        affiliationOptions={affiliationOptions}
        actionOccupation={actionOccupation}
        actionAffiliation={actionAffiliation}
        onActionOccupationChange={onActionOccupationChange}
        onActionAffiliationChange={onActionAffiliationChange}
        onApply={onApply}
        onCancel={onCancelSelection}
        isApplying={isApplying}
      />
    </div>
  )
}
