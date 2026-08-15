'use client'

import Buttons from '@/components/atoms/Buttons'
import { useModal } from '@/context/ModalContext'
import { useDeActivateUserAccountByCommunityAdmin } from '@/services/user'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  userId: string
  userName: string
  avatarUrl?: string
  initials: string
  avatarColorClass: string
  detailOne?: string | null
  detailTwo?: string | null
  onSuccess?: () => void
}

export default function AdminDeactivateAccountModal({
  userId,
  userName,
  avatarUrl,
  initials,
  avatarColorClass,
  detailOne,
  detailTwo,
  onSuccess,
}: Props) {
  const { closeModal } = useModal()
  const [imageFailed, setImageFailed] = useState(false)
  const { mutate: deactivateAccount, isPending } = useDeActivateUserAccountByCommunityAdmin()

  const handleConfirm = () => {
    deactivateAccount(
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
    <div className="flex flex-col gap-6">
      <h3 className="text-center font-poppins text-md font-bold text-[#3A3B3C]">Deactivate Account</h3>

      <p className="text-sm font-inter text-[#3A3B3C]">
        Are you sure you want to deactivate this account? The user will lose access to Unibuzz, and others won&apos;t be able to interact with them
        anymore.
      </p>

      <div className="flex items-center gap-3">
        {avatarUrl && !imageFailed ? (
          <Image
            src={avatarUrl}
            alt={userName}
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
          <p className="truncate text-2xs font-semibold text-[#374151]">{userName}</p>
          {detailOne ? <p className="truncate text-3xs text-neutral-500">{detailOne}</p> : null}
          {detailTwo ? <p className="truncate text-3xs text-neutral-500">{detailTwo}</p> : null}
        </div>
      </div>

      <div className="flex gap-4">
        <Buttons size="large" variant="danger" className="w-full" onClick={handleConfirm} disabled={isPending}>
          {isPending ? 'Deactivating...' : 'Deactivate'}
        </Buttons>
        <Buttons size="large" variant="shade" className="w-full" onClick={closeModal} disabled={isPending}>
          Cancel
        </Buttons>
      </div>
    </div>
  )
}
