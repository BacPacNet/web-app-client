import React, { useState } from 'react'
import { useModal } from '@/context/ModalContext'
import Buttons from '@/components/atoms/Buttons'
import { useNewUserTrue } from '@/services/user'
import Spinner from '@/components/atoms/spinner'

const UserGuidelinesModal: React.FC = () => {
  const [checked, setChecked] = useState(false)
  const { closeModal } = useModal()
  const { mutateAsync: newUserTrue, isPending: newUserTrueLoading } = useNewUserTrue()

  const handleClick = async () => {
    if (!checked) return
    await newUserTrue()
    closeModal()
  }

  return (
    <div className="flex flex-col gap-4">
      <h5 className="font-poppins text-md font-bold text-neutral-700 text-center mb-4">User Guidelines</h5>

      <div className="flex flex-col gap-4 text-sm text-neutral-700 font-semibold">
        <p>Please be professional while using this application. This community is regulated by the university.</p>
        <p>Do not engage in abuse, bullying, or any behavior that may violate community guidelines or harm the university’s image.</p>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700 mt-2 ">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="w-4 h-4" />I have read and understood the
        above.
      </label>

      <Buttons onClick={handleClick} className="mt-4 w-max mx-auto" size="large" disabled={!checked || newUserTrueLoading}>
        {newUserTrueLoading ? <Spinner /> : ' I Agree'}
      </Buttons>
    </div>
  )
}

export default UserGuidelinesModal
