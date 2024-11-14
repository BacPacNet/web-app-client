import React, { ReactNode } from 'react'
import { IoClose } from 'react-icons/io5'
type Props = {
  children: ReactNode
  setModal: (value: null) => void
}

const SettingModalWrapper = ({ children, setModal }: Props) => {
  return (
    <div className="bg-white w-1/2 max-sm:w-11/12 max-md:w-2/3 max-h-[32rem] max-sm:h-[32rem] overflow-y-auto custom-scrollbar rounded-2xl drop-shadow-lg pb-5">
      <div className="flex justify-end">
        <button onClick={() => setModal(null)} className="p-2">
          <IoClose size={24} />
        </button>
      </div>
      {children}
    </div>
  )
}

export default SettingModalWrapper
