import Buttons from '@/components/atoms/Buttons'
import { useRouter } from 'next/navigation'
import React from 'react'
import { closeModal } from '../Modal/ModalManager'

const VerifyUniversityToJoinModal = () => {
  const router = useRouter()

  const handleRedirect = () => {
    closeModal()
    router.push('/setting')
  }
  return (
    <div className="flex flex-col gap-8">
      <h5 className="font-poppins text-md font-bold text-neutral-700 text-center">Verify your University</h5>
      <p className="text-sm text-neutral-700">To keep things secure and exclusive. </p>
      <Buttons onClick={() => handleRedirect()}>University Verification</Buttons>
    </div>
  )
}

export default VerifyUniversityToJoinModal
