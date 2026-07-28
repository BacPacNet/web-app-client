'use client'

import AdminSectionHeader from '@/components/molecules/AdminDashboard/AdminSectionHeader'
import Buttons from '@/components/atoms/Buttons'
import { cn } from '@/lib/utils'
import { FaCheck } from 'react-icons/fa'

const MAX_DESCRIPTION_LENGTH = 350

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
  const isDescriptionOverLimit = description.length > MAX_DESCRIPTION_LENGTH

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
          disabled={true}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label htmlFor="university-description" className="text-2xs font-semibold text-neutral-900">
            Description
          </label>
          <span className={cn('text-2xs', isDescriptionOverLimit ? 'text-red-500' : 'text-neutral-500')}>
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <textarea
          id="university-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className={cn(
            'min-h-[120px] w-full resize-y rounded-lg border p-3 text-xs text-neutral-900 outline-none',
            isDescriptionOverLimit
              ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
              : 'border-neutral-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
          )}
          placeholder="Enter a short description for the university profile page"
        />
        {isDescriptionOverLimit ? (
          <p className="text-2xs text-red-500">Description cannot exceed {MAX_DESCRIPTION_LENGTH} characters.</p>
        ) : (
          <p className="text-2xs text-neutral-500">Displayed below the university name on the profile page.</p>
        )}
      </div>

      <div>
        <Buttons
          variant="primary"
          size="extra_small"
          leftIcon={<FaCheck size={12} />}
          onClick={onSave}
          disabled={isSaveDisabled || isSaving || isDescriptionOverLimit}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Buttons>
      </div>
    </div>
  )
}
