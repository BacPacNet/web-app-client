'use client'

import RemoveAdminAccountModal from '@/components/molecules/AdminDashboard/RemoveAdminAccountModal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useModal } from '@/context/ModalContext'
import { useUniStore } from '@/store/store'
import Link from 'next/link'
import { useState } from 'react'
import { FiExternalLink, FiMoreVertical, FiUserMinus } from 'react-icons/fi'

type Props = {
  userId: string
  adminName: string
  avatarUrl?: string
  initials: string
  avatarColorClass: string
  detailOne?: string | null
  detailTwo?: string | null
  onViewProfile?: () => void
}

export default function AdminAccountsRowActionMenu({
  userId,
  adminName,
  avatarUrl,
  initials,
  avatarColorClass,
  detailOne,
  detailTwo,
  onViewProfile,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { openModal } = useModal()
  const currentUserId = useUniStore((state) => state.userProfileData?.users_id)
  const isCurrentUser = userId === currentUserId

  const handleRemove = () => {
    if (isCurrentUser) return

    setIsOpen(false)
    openModal(
      <RemoveAdminAccountModal
        userId={userId}
        adminName={adminName}
        avatarUrl={avatarUrl}
        initials={initials}
        avatarColorClass={avatarColorClass}
        detailOne={detailOne}
        detailTwo={detailTwo}
      />,
      'w-[350px] sm:w-[490px] hideScrollbar h-max',
      false
    )
  }

  const handleViewProfile = () => {
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-5 w-5 items-center justify-center border border-[#E5E7EB] text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          aria-label="Admin account actions"
        >
          <FiMoreVertical size={16} className="text-primary-500" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-max border-none bg-white p-1 shadow-card">
        <div className="flex flex-col">
          {!isCurrentUser ? (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-left font-inter text-2xs text-[#3A3B3C] transition-colors hover:bg-neutral-50"
            >
              <FiUserMinus size={12} color="#DC2626" />
              Remove
            </button>
          ) : null}

          {onViewProfile ? (
            <Link
              href={`/profile/${userId}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleViewProfile}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-left font-inter text-2xs text-[#3A3B3C] transition-colors hover:bg-neutral-50"
            >
              <FiExternalLink size={12} className="text-[#242526]" />
              View Profile
            </Link>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
