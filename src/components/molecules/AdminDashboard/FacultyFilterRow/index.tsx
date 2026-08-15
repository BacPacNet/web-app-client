'use client'

import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import { adminAndOther, occupationAndDepartment } from '@/types/RegisterForm'
import { RxCross2 } from 'react-icons/rx'

export const FACULTY_OCCUPATION_FILTER_OPTIONS = Object.keys(occupationAndDepartment)
export const FACULTY_AFFILIATION_FILTER_OPTIONS = adminAndOther

type Props = {
  selectedOccupations: string[]
  selectedAffiliations: string[]
  onOccupationChange: (occupations: string[]) => void
  onAffiliationChange: (affiliations: string[]) => void
  className?: string
}

function FilterSelectionTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="inline-flex h-7 w-fit shrink-0 items-center gap-2 rounded-md bg-primary-500 px-2 py-1 text-2xs text-white">
      <span className="whitespace-nowrap">{label}</span>
      <RxCross2 className="cursor-pointer text-sm" onClick={onRemove} />
    </div>
  )
}

export default function FacultyFilterRow({
  selectedOccupations,
  selectedAffiliations,
  onOccupationChange,
  onAffiliationChange,
  className = '',
}: Props) {
  const hasSelectedFilters = selectedOccupations.length > 0 || selectedAffiliations.length > 0

  return (
    <div className={`flex flex-col gap-2 rounded-xl ${className}`}>
      <div className="flex items-start gap-2">
        <MultiSelectDropdown
          options={FACULTY_OCCUPATION_FILTER_OPTIONS}
          value={selectedOccupations}
          onChange={onOccupationChange}
          placeholder="Occupation"
          err={false}
          search
          appearance="pill"
          hideSelectedTags
        />
        <MultiSelectDropdown
          options={FACULTY_AFFILIATION_FILTER_OPTIONS}
          value={selectedAffiliations}
          onChange={onAffiliationChange}
          placeholder="Affiliation"
          err={false}
          search
          appearance="pill"
          hideSelectedTags
        />
      </div>

      {hasSelectedFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedOccupations.map((occupation) => (
            <FilterSelectionTag
              key={`occupation-${occupation}`}
              label={occupation}
              onRemove={() => onOccupationChange(selectedOccupations.filter((item) => item !== occupation))}
            />
          ))}
          {selectedAffiliations.map((affiliation) => (
            <FilterSelectionTag
              key={`affiliation-${affiliation}`}
              label={affiliation}
              onRemove={() => onAffiliationChange(selectedAffiliations.filter((item) => item !== affiliation))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
