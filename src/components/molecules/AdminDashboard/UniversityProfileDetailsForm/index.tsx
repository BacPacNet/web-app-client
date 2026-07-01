'use client'

import AdminSectionHeader from '@/components/molecules/AdminDashboard/AdminSectionHeader'
import Buttons from '@/components/atoms/Buttons'
import { FaCheck } from 'react-icons/fa'

type Props = {
  name: string
  description: string
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onSave: () => void
  isSaving?: boolean
  isSaveDisabled?: boolean
}

export default function UniversityProfileDetailsForm({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onSave,
  isSaving = false,
  isSaveDisabled = false,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <AdminSectionHeader title="University Name & Description" />

      <div className="flex flex-col gap-2">
        <label htmlFor="university-name" className="text-2xs font-semibold text-neutral-900">
          University Name
        </label>
        <input
          id="university-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-xs text-neutral-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="Enter university name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="university-description" className="text-2xs font-semibold text-neutral-900">
          Description
        </label>
        <textarea
          id="university-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="min-h-[120px] w-full resize-y rounded-lg border border-neutral-200 p-3 text-xs text-neutral-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          placeholder="Enter a short description for the university profile page"
        />
        <p className="text-2xs text-neutral-500">Displayed below the university name on the profile page.</p>
      </div>

      <div>
        <Buttons variant="primary" size="extra_small" leftIcon={<FaCheck size={12} />} onClick={onSave} disabled={isSaveDisabled || isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Buttons>
      </div>
    </div>
  )
}
