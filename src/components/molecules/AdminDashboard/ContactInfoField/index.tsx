'use client'

import Buttons from '@/components/atoms/Buttons'
import { FaCheck } from 'react-icons/fa'
import { FiEdit2 } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'
import { IconType } from 'react-icons'
import { useEffect, useState } from 'react'

type Props = {
  icon: IconType
  label: string
  value: string
  onSave: (value: string) => void
  isSaving?: boolean
  inputType?: 'text' | 'email' | 'url'
}

export default function ContactInfoField({ icon: Icon, label, value, onSave, isSaving = false, inputType = 'text' }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (!isEditing) setDraft(value)
  }, [value, isEditing])

  const handleSave = () => {
    onSave(draft)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setDraft(value)
    setIsEditing(false)
  }

  return (
    <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-[#F9FAFB] py-3 px-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEE9FF]">
        <Icon size={18} className="text-primary-500" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-3xs font-bold text-primary-500 font-inter">{label}</p>
        {isEditing ? (
          <div className="mt-1 flex items-center gap-2">
            <input
              type={inputType}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-primary-500 px-3 py-1 text-2xs text-neutral-900 outline-none focus:ring-1 focus:ring-primary-500"
              autoFocus
            />
            <div className="flex shrink-0 items-center gap-2">
              <Buttons
                variant="primary"
                size="extra_small"
                leftIcon={<FaCheck size={12} />}
                onClick={handleSave}
                disabled={isSaving || draft === value}
              >
                Save
              </Buttons>
              <Buttons variant="border" size="extra_small" onClick={handleCancel} disabled={isSaving} aria-label="Cancel">
                <RxCross2 size={14} />
              </Buttons>
            </div>
          </div>
        ) : (
          <p className="mt-1 break-words text-2xs font-inter text-neutral-900">{value || '—'}</p>
        )}
      </div>

      {!isEditing && (
        <div className="flex shrink-0 self-end">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex bg-[#F3F4F6] h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:border-primary-200 hover:text-primary-500"
            aria-label={`Edit ${label}`}
          >
            <FiEdit2 size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
