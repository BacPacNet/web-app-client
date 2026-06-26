'use client'

import Buttons from '@/components/atoms/Buttons'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import SubText from '@/components/atoms/SubText'
import { value } from '@/types/RegisterForm'

export const STUDENT_YEAR_FILTER_OPTIONS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Graduate']
export const STUDENT_MAJOR_FILTER_OPTIONS = value

type Props = {
  selectedYears: string[]
  selectedMajor: string
  onYearToggle: (year: string) => void
  onMajorChange: (major: string) => void
  className?: string
}

export default function StudentFilterRow({ selectedYears, selectedMajor, onYearToggle, onMajorChange, className = '' }: Props) {
  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3 ${className}`}>
      <SubText className="shrink-0 text-sm text-neutral-500">Year:</SubText>

      <div className="flex flex-wrap items-center gap-2">
        {STUDENT_YEAR_FILTER_OPTIONS.map((year) => {
          const isSelected = selectedYears.includes(year)

          return (
            <Buttons
              key={year}
              type="button"
              size="extra_small"
              variant={isSelected ? 'shade' : 'border'}
              className="h-8 rounded-full px-4 font-normal"
              onClick={() => onYearToggle(year)}
            >
              {year}
            </Buttons>
          )
        })}
      </div>

      <div className="hidden h-6 w-px bg-neutral-200 sm:block" aria-hidden />

      <div className="min-w-[140px]">
        <SelectDropdown
          options={STUDENT_MAJOR_FILTER_OPTIONS}
          value={selectedMajor}
          onChange={onMajorChange}
          placeholder="Major"
          icon="single"
          err={false}
          isAllowedToRemove={Boolean(selectedMajor)}
        />
      </div>
    </div>
  )
}
