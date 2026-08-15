'use client'

import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import { degreeAndMajors } from '@/types/RegisterForm'
import { RxCross2 } from 'react-icons/rx'

export const STUDENT_YEAR_FILTER_OPTIONS = Object.keys(degreeAndMajors)
export const STUDENT_MAJOR_FILTER_OPTIONS = Array.from(new Set(Object.values(degreeAndMajors).flat()))

type Props = {
  selectedYears: string[]
  selectedMajors: string[]
  onYearChange: (years: string[]) => void
  onMajorChange: (majors: string[]) => void
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

export default function StudentFilterRow({ selectedYears, selectedMajors, onYearChange, onMajorChange, className = '' }: Props) {
  const hasSelectedFilters = selectedYears.length > 0 || selectedMajors.length > 0

  return (
    <div className={`flex flex-col gap-2 rounded-xl ${className}`}>
      <div className="flex items-start gap-2">
        <MultiSelectDropdown
          options={STUDENT_YEAR_FILTER_OPTIONS}
          value={selectedYears}
          onChange={onYearChange}
          placeholder="Year"
          err={false}
          search
          appearance="pill"
          hideSelectedTags
        />
        <MultiSelectDropdown
          options={STUDENT_MAJOR_FILTER_OPTIONS}
          value={selectedMajors}
          onChange={onMajorChange}
          placeholder="Major"
          err={false}
          search
          appearance="pill"
          hideSelectedTags
        />
      </div>

      {hasSelectedFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedYears.map((year) => (
            <FilterSelectionTag key={`year-${year}`} label={year} onRemove={() => onYearChange(selectedYears.filter((item) => item !== year))} />
          ))}
          {selectedMajors.map((major) => (
            <FilterSelectionTag
              key={`major-${major}`}
              label={major}
              onRemove={() => onMajorChange(selectedMajors.filter((item) => item !== major))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
