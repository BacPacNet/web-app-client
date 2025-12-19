import React from 'react'
import Buttons from '@/components/atoms/Buttons'
import { useModal } from '@/context/ModalContext'

interface DeleteAccountModalProps {
  onConfirm: () => void
  pending?: boolean
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onConfirm, pending }) => {
  const { closeModal } = useModal()

  return (
    <div className="flex flex-col gap-6  text-center">
      <h3 className="font-poppins text-2xl font-bold text-neutral-700">Delete Account</h3>

      <p className="text-sm text-neutral-600 text-start">
        Are you sure you want to delete your account? All public and private profile information will be permanently removed. Personal messages cannot
        be deleted.
      </p>

      <p className="text-sm text-start font-bold text-neutral-700">This action is permanent.</p>

      <div className="flex gap-4 justify-center mt-4">
        <Buttons size="large" disabled={pending} variant="danger" className="w-full" onClick={onConfirm}>
          {pending ? 'Deleting...' : 'Delete Account'}
        </Buttons>

        <Buttons size="large" variant="shade" disabled={pending} className="w-full" onClick={closeModal}>
          Cancel
        </Buttons>
      </div>
    </div>
  )
}

export default DeleteAccountModal
