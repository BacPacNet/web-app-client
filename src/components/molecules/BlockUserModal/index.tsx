import React from 'react'
import Buttons from '@/components/atoms/Buttons'
import { useModal } from '@/context/ModalContext'

interface BlockUserModalProps {
  onConfirm: () => void
  pending?: boolean
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({ onConfirm, pending }) => {
  const { closeModal } = useModal()

  return (
    <div className="flex flex-col gap-6  text-center">
      <h3 className="font-poppins text-2xl font-bold text-neutral-700">Block User</h3>

      <div className="text-start">
        <p className="text-sm text-neutral-600 mb-3">What happens when you block a user:</p>
        <ul className="text-sm text-neutral-700 font-semibold list-disc list-outside space-y-2 px-4">
          <li>They can&apos;t interact with you. No posts, DMs, invitations, or searches.</li>
          <li>Their past content will appear as &quot;deleted.&quot;</li>
          <li>If they&apos;re an admin of any group you&apos;re in, you&apos;ll be removed from that group.</li>
          <li>If they&apos;re part of groups you are admin of, they will be removed.</li>
          <li>You can unblock them anytime in your settings.</li>
        </ul>
      </div>

      <div className="flex gap-4 justify-center mt-4">
        <Buttons size="large" disabled={pending} variant="danger" className="w-full" onClick={onConfirm}>
          {pending ? 'Blocking...' : 'Block User'}
        </Buttons>

        <Buttons size="large" variant="shade" disabled={pending} className="w-full" onClick={closeModal}>
          Cancel
        </Buttons>
      </div>
    </div>
  )
}

export default BlockUserModal
