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
    <div
      className={`fixed w-full h-full
          left-1/2 -translate-x-1/2  top-1/2 -translate-y-1/2
         
       flex justify-center items-center z-50`}
    >
      {/* <div
      className={`fixed ${
        takingFullWidth
          ? `left-1/2 -translate-x-1/2 ${isMessage ? 'w-full' : 'w-[60%]'} max-lg:w-full top-1/2 -translate-y-1/2`
          : 'w-[60%] left-1/2 -translate-x-1/2'
      } ${smallHeight ? 'h-[99%]' : 'h-screen'} top-0 flex justify-center items-center z-50`}
    > */}
      <div onClick={() => setModal(false)} className="bg-black opacity-70 w-full h-screen fixed -z-10"></div>
      <div className={`relative bg-white  ${style}  max-sm:w-11/12 max-md:w-2/3  max-h-[85%] overflow-y-auto rounded-2xl shadow-lg px-4 py-4 `}>
        <div className="absolute right-0 top-0">
          <button onClick={() => setModal(false)} className="p-2">
            <IoClose size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default ModalWrapper
