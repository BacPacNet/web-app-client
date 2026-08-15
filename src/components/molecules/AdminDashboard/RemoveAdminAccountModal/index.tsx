'use client'

import Buttons from '@/components/atoms/Buttons'
import { useModal } from '@/context/ModalContext'
import { useRemoveCommunityAdmin } from '@/services/communityAdminAccounts'
import { useUniStore } from '@/store/store'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  userId: string
  adminName: string
  avatarUrl?: string
  initials: string
  avatarColorClass: string
  detailOne?: string | null
  detailTwo?: string | null
  onSuccess?: () => void
}

export default function RemoveAdminAccountModal({
  userId,
  adminName,
  avatarUrl,
  initials,
  avatarColorClass,
  detailOne,
  detailTwo,
  onSuccess,
}: Props) {
  const { closeModal } = useModal()
  const [imageFailed, setImageFailed] = useState(false)
  const { mutate: removeAdmin, isPending } = useRemoveCommunityAdmin()
  const currentUserId = useUniStore((state) => state.userProfileData?.users_id)
  const isCurrentUser = userId === currentUserId

  const handleConfirm = () => {
    if (isCurrentUser) return

    removeAdmin(
      { userId },
      {
        onSuccess: () => {
          onSuccess?.()
          closeModal()
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-center font-poppins text-md font-bold text-[#3A3B3C]">Remove Admin</h3>

      <p className="text-sm font-inter text-[#3A3B3C]">
        Are you sure you want to remove this admin? They will lose admin rights for your university but keep their account.
      </p>

      <div className="flex items-center gap-3">
        {avatarUrl && !imageFailed ? (
          <Image
            src={avatarUrl}
            alt={adminName}
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarColorClass}`}>
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-2xs font-semibold text-[#3A3B3C]">{adminName}</p>
          {detailOne ? <p className="truncate text-3xs text-neutral-500">{detailOne}</p> : null}
          {detailTwo ? <p className="truncate text-3xs text-neutral-500">{detailTwo}</p> : null}
        </div>
      </div>

      <div className="flex gap-4">
        {!isCurrentUser ? (
          <Buttons size="large" variant="danger" className="w-full" onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Removing...' : 'Remove'}
          </Buttons>
        ) : null}
        <Buttons size="large" variant="shade" className="w-full" onClick={closeModal} disabled={isPending}>
          Cancel
        </Buttons>
      </div>
    </div>
  )
}
