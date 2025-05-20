import Buttons from '@/components/atoms/Buttons'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useModal } from '@/context/ModalContext'

const VerifyUniversityToJoinModal = () => {
  const router = useRouter()
  const { closeModal } = useModal()

  const handleRedirect = () => {
    closeModal()
    router.push('/setting')
  }
  return (
    <div className="flex flex-col gap-4">
      <h5 className="font-poppins text-md font-bold text-neutral-700 text-center mb-4">Oops! You’ve hit the limit. </h5>
      <p className="text-sm text-neutral-700">
        Looks like you’ve already joined a university without verifying your student status. You can only join one unverified university at a time.
      </p>
      <p className="text-sm text-neutral-700 font-semibold">To continue, verify your student email for either:</p>
      <ul className="list-disc list-inside text-sm text-neutral-700 font-semibold flex flex-col gap-2">
        <li>The university you’ve previously joined</li>
        <li>The one you are currently attempting to join</li>
      </ul>
      <Buttons onClick={() => handleRedirect()} className="mt-4 w-max mx-auto" size="large">
        Verify Student Email
      </Buttons>
    </div>
  )
}

export default VerifyUniversityToJoinModal
