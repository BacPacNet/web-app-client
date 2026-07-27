'use client'

import Buttons from '@/components/atoms/Buttons'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { FiCheck } from 'react-icons/fi'

type Props = {
  selectedCount: number
  occupationOptions: string[]
  affiliationOptions: string[]
  actionOccupation: string
  actionAffiliation: string
  onActionOccupationChange: (occupation: string) => void
  onActionAffiliationChange: (affiliation: string) => void
  onApply: () => void
  onCancel: () => void
  isApplying?: boolean
  className?: string
}

export default function FacultySelectionActionBar({
  selectedCount,
  occupationOptions,
  affiliationOptions,
  actionOccupation,
  actionAffiliation,
  onActionOccupationChange,
  onActionAffiliationChange,
  onApply,
  onCancel,
  isApplying = false,
  className = '',
}: Props) {
  if (selectedCount === 0) return null

  const label = selectedCount === 1 ? ' Change 1 faculty member' : `Change ${selectedCount}  faculty members`

  return (
    <div
      className={`flex flex-col gap-4 rounded-xl border border-[#A5B4FC] bg-[#EEF2FF] py-2 px-4 lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <p className="shrink-0 text-xs font-inter font-semibold text-[#4338CA]">{label}</p>

        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[160px]">
            <SelectDropdown
              options={occupationOptions}
              value={actionOccupation}
              onChange={onActionOccupationChange}
              placeholder="Occupation"
              icon="single"
              err={false}
              isAllowedToRemove={false}
            />
          </div>

          <div className="min-w-[160px]">
            <SelectDropdown
              options={affiliationOptions}
              value={actionAffiliation}
              onChange={onActionAffiliationChange}
              placeholder="Affiliation"
              icon="single"
              err={false}
              isAllowedToRemove={false}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Buttons
          type="button"
          variant="primary"
          size="extra_small"
          leftIcon={<FiCheck size={16} />}
          onClick={onApply}
          disabled={isApplying}
          className="rounded-lg"
        >
          {isApplying ? 'Applying...' : 'Apply'}
        </Buttons>

        <Buttons type="button" variant="border" size="extra_small" onClick={onCancel} className="rounded-lg">
          Cancel
        </Buttons>
      </div>
    </div>
  )
}
