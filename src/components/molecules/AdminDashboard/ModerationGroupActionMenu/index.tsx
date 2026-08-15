'use client'

import RemoveModerationGroupModal from '@/components/molecules/AdminDashboard/RemoveModerationGroupModal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useModal } from '@/context/ModalContext'
import { useState } from 'react'
import { FiExternalLink, FiMoreVertical, FiTrash2 } from 'react-icons/fi'

type Props = {
  communityGroupId: string
  groupName: string
  communityId: string
  onRemoved?: () => void
}

export default function ModerationGroupActionMenu({ communityGroupId, groupName, communityId, onRemoved }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { openModal } = useModal()

  const handleRemove = () => {
    setIsOpen(false)
    openModal(
      <RemoveModerationGroupModal communityGroupId={communityGroupId} groupName={groupName} onSuccess={onRemoved} />,
      'w-[350px] sm:w-[490px] hideScrollbar h-max',
      false
    )
  }

  const handleViewGroup = () => {
    setIsOpen(false)
    window.open(`/community/${communityId}/${communityGroupId}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600"
          aria-label="Group actions"
        >
          <FiMoreVertical size={16} />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-44 border-none bg-white p-1 shadow-card">
        <div className="flex flex-col">
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-neutral-50"
          >
            <FiTrash2 size={14} className="text-destructive-600" />
            <span className="text-2xs font-semibold text-destructive-600">Remove</span>
          </button>

          <button
            type="button"
            onClick={handleViewGroup}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-neutral-50"
          >
            <FiExternalLink size={14} className="text-[#242526]" />
            <span className="text-2xs font-semibold text-[#374151]">View Group</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
