import React from 'react'
import Buttons from '@/components/atoms/Buttons'
import { Spinner } from '@/components/spinner/Spinner'
import { RiErrorWarningLine } from 'react-icons/ri'
import { useRouter } from 'next/navigation'
import { useModal } from '@/context/ModalContext'

type DeleteModalProps = {
  entityName: string
  onDelete: () => void
  isLoading?: boolean
  redirectUrl?: string
}

const DeleteModal = ({ entityName, onDelete, isLoading, redirectUrl }: DeleteModalProps) => {
  const router = useRouter()
  const { closeModal } = useModal()

  const handleDelete = () => {
    onDelete()
    closeModal()
    if (redirectUrl) {
      router.push(redirectUrl)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <RiErrorWarningLine size={100} className="text-neutral-700" />
      <h3 className="text-base font-semibold font-poppins text-center">Are you sure you want to delete {entityName}?</h3>
      <div className="flex items-center gap-4 w-full px-5">
        <Buttons onClick={() => closeModal()} className="w-11/12" size="large">
          No
        </Buttons>
        <Buttons onClick={() => handleDelete()} className="w-11/12" size="large" variant="danger">
          {isLoading ? <Spinner /> : 'Yes'}
        </Buttons>
      </div>
    </div>
  )
}

export default DeleteModal
