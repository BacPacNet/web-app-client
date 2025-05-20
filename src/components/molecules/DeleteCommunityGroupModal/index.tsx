import Buttons from '@/components/atoms/Buttons'
import React from 'react'
import { Spinner } from '@/components/spinner/Spinner'
import { useDeleteCommunityGroup } from '@/services/community-group'
import { useRouter } from 'next/navigation'
import { RiErrorWarningLine } from 'react-icons/ri'
import { useModal } from '@/context/ModalContext'

type Props = {
  communityId?: string
  setIsUserJoinedCommunity?: (value: boolean) => void
  setIsUserJoinedCommunityGroup?: (value: boolean) => void
  communityGroupId?: string
}

const DeleteCommunityGroupModal = ({ communityGroupId, communityId }: Props) => {
  const router = useRouter()
  const { closeModal } = useModal()
  const { mutate: deleteCommunityGroup, isPending: isDeleteCommunityGroupPending } = useDeleteCommunityGroup()

  const handleDeleteCommunityGroup = () => {
    deleteCommunityGroup(communityGroupId as string)
    closeModal()
    router.push(`/community/${communityId}`)
  }
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <RiErrorWarningLine size={100} className="text-neutral-700" />
      <h3 className="text-base font-semibold font-poppins text-center">Are you sure you want to delete community group?</h3>
      <div className="flex items-center gap-4 w-full px-5">
        <Buttons onClick={() => closeModal()} className="w-11/12" size="small">
          No
        </Buttons>
        <Buttons onClick={() => handleDeleteCommunityGroup()} className="w-11/12" size="small" variant="danger">
          {isDeleteCommunityGroupPending ? <Spinner /> : 'Yes'}
        </Buttons>
      </div>
    </div>
  )
}

export default DeleteCommunityGroupModal
