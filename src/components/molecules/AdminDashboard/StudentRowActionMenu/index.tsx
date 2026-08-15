'use client'

import AdminDeactivateAccountModal from '@/components/molecules/AdminDashboard/AdminDeactivateAccountModal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useModal } from '@/context/ModalContext'
import { useActivateUserAccountByCommunityAdmin } from '@/services/user'
import { useState } from 'react'
import { FiExternalLink, FiMoreVertical, FiUserX } from 'react-icons/fi'

type Props = {
  userId: string
  studentName: string
  avatarUrl?: string
  initials: string
  avatarColorClass: string
  studyYear?: string | null
  major?: string | null
  onViewProfile?: () => void
  isActive?: boolean
}

export default function StudentRowActionMenu({
  userId,
  studentName,
  avatarUrl,
  initials,
  avatarColorClass,
  studyYear,
  major,
  onViewProfile,
  isActive = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { openModal } = useModal()
  const { mutate: activateStudentAccount, isPending: isActivating } = useActivateUserAccountByCommunityAdmin()

  const handleDeactivate = () => {
    setIsOpen(false)
    openModal(
      <AdminDeactivateAccountModal
        userId={userId}
        userName={studentName}
        avatarUrl={avatarUrl}
        initials={initials}
        avatarColorClass={avatarColorClass}
        detailOne={studyYear}
        detailTwo={major}
      />,
      'w-[350px] sm:w-[490px] hideScrollbar h-max',
      false
    )
  }

  const handleActivate = () => {
    activateStudentAccount(
      { userId },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      }
    )
  }

  const handleViewProfile = () => {
    onViewProfile?.()
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-5 w-5 items-center justify-center border border-[#E5E7EB] text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          aria-label="Student actions"
        >
          <FiMoreVertical size={16} className="text-primary-500" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-max border-none bg-white p-1 shadow-card">
        <div className="flex flex-col">
          {isActive ? (
            <button
              type="button"
              onClick={handleDeactivate}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-left font-inter text-2xs text-[#3A3B3C] transition-colors hover:bg-neutral-50"
            >
              <FiUserX size={12} color="#DC2626" />
              Deactivate
            </button>
          ) : (
            <button
              type="button"
              onClick={handleActivate}
              disabled={isActivating}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-left font-inter text-2xs text-[#3A3B3C] transition-colors hover:bg-neutral-50 disabled:opacity-50"
            >
              <FiUserX size={12} color="#15803D" />
              {isActivating ? 'Activating...' : 'Activate'}
            </button>
          )}

          {onViewProfile ? (
            <button
              type="button"
              onClick={handleViewProfile}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-left font-inter text-2xs text-[#3A3B3C] transition-colors hover:bg-neutral-50"
            >
              <FiExternalLink size={12} className="text-[#242526]" />
              View Profile
            </button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
