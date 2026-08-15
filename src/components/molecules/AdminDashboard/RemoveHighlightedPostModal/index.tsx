'use client'

import Buttons from '@/components/atoms/Buttons'
import { useModal } from '@/context/ModalContext'
import { useDeleteUniversityHighlightPost } from '@/services/universitySearch'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  universityId: string
  postId: string
  authorName: string
  avatarUrl?: string
  initials: string
  avatarColorClass: string
  preview: string
  onSuccess?: () => void
}

export default function RemoveHighlightedPostModal({
  universityId,
  postId,
  authorName,
  avatarUrl,
  initials,
  avatarColorClass,
  preview,
  onSuccess,
}: Props) {
  const { closeModal } = useModal()
  const [imageFailed, setImageFailed] = useState(false)
  const { mutate: deleteHighlightPost, isPending } = useDeleteUniversityHighlightPost(universityId)

  const handleConfirm = () => {
    deleteHighlightPost(postId, {
      onSuccess: () => {
        onSuccess?.()
        closeModal()
      },
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-center font-poppins text-md font-bold text-[#3A3B3C]">Remove Post</h3>

      <div className="flex items-center gap-3">
        {avatarUrl && !imageFailed ? (
          <Image
            src={avatarUrl}
            alt={authorName}
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarColorClass}`}>
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-2xs font-semibold text-[#374151]">{authorName}</p>
          <p className="truncate text-2xs text-[#374151]">{preview || 'No content'}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Buttons size="large" variant="danger" className="w-full" onClick={handleConfirm} disabled={isPending}>
          {isPending ? 'Removing...' : 'Remove'}
        </Buttons>
        <Buttons size="large" variant="shade" className="w-full" onClick={closeModal} disabled={isPending}>
          Cancel
        </Buttons>
      </div>
    </div>
  )
}
