'use client'

import AdminSectionHeader from '@/components/molecules/AdminDashboard/AdminSectionHeader'
import Buttons from '@/components/atoms/Buttons'
import { FaCheck } from 'react-icons/fa'

type Props = {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  isSaving?: boolean
  isSaveDisabled?: boolean
}

function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export default function UniversityOverviewEditor({ value, onChange, onSave, isSaving = false, isSaveDisabled = false }: Props) {
  const wordCount = countWords(value)

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <AdminSectionHeader
        title="University Overview"
        description="The long-form description shown in the 'University Overview' section. Supports multiple paragraphs."
      />

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[240px] w-full resize-y rounded-lg border border-neutral-200 p-3 text-xs text-neutral-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        placeholder="Enter the university overview..."
      />

      <div className="flex items-center justify-between">
        <span className="text-2xs text-neutral-500">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
        <Buttons variant="primary" size="extra_small" leftIcon={<FaCheck size={12} />} onClick={onSave} disabled={isSaveDisabled || isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Buttons>
      </div>
    </div>
  )
}
