'use client'

import Buttons from '@/components/atoms/Buttons'
import { useModal } from '@/context/ModalContext'
import { useDeleteCommunityGroupForCommunityAdmin } from '@/services/community-group'
import { RiErrorWarningLine } from 'react-icons/ri'
import { Spinner } from '@/components/spinner/Spinner'

type Props = {
  communityGroupId: string
  groupName: string
  onSuccess?: () => void
}

export default function RemoveModerationGroupModal({ communityGroupId, groupName, onSuccess }: Props) {
  const { closeModal } = useModal()
  const { mutateAsync: deleteCommunityGroup, isPending } = useDeleteCommunityGroupForCommunityAdmin()

  const handleConfirm = async () => {
    await deleteCommunityGroup(communityGroupId)
    onSuccess?.()
    closeModal()
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <RiErrorWarningLine size={80} className="text-neutral-700" />
      <div className="text-center">
        <h3 className="font-poppins text-md font-bold text-[#3A3B3C]">Remove Group</h3>
        <p className="mt-2 text-2xs text-neutral-500">
          Are you sure you want to remove <span className="font-semibold text-neutral-700">{groupName}</span>? This action cannot be undone.
        </p>
      </div>
      <div className="flex w-full gap-4 px-2">
        <Buttons onClick={() => closeModal()} className="w-full" size="large" variant="shade" disabled={isPending}>
          Cancel
        </Buttons>
        <Buttons onClick={handleConfirm} className="w-full" size="large" variant="danger" disabled={isPending}>
          {isPending ? <Spinner /> : 'Remove'}
        </Buttons>
      </div>
    </div>
  )
}
