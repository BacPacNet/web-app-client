import React from 'react'
import { IoClose } from 'react-icons/io5'

type ModalWrapperProps = {
  children: React.ReactNode
  setModal: (value: boolean) => void
  isShown: boolean

  style?: string
}

const ModalWrapper = ({
  children,
  setModal,
  isShown,

  style = '',
}: ModalWrapperProps) => {
  if (!isShown) return null

  return (
    <div>
      <div onClick={() => setModal(false)} className="bg-black opacity-70 w-screen h-screen fixed z-10 top-0"></div>

      <div
        className={`fixed 
          left-1/2 -translate-x-1/2  top-1/2 -translate-y-1/2
         
       flex justify-center items-center z-50`}
      >
        <div className={`relative bg-white  ${style} w-11/12  sm:w-full  max-h-[85%] overflow-y-auto rounded-2xl shadow-lg p-4 lg:p-4 `}>
          <div className="absolute right-0 top-0">
            <button onClick={() => setModal(false)} className="p-2">
              <IoClose size={24} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default ModalWrapper
