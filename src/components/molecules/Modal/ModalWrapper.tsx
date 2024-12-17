import React from 'react'
import { IoClose } from 'react-icons/io5'

type ModalWrapperProps = {
  children: React.ReactNode
  setModal: (value: boolean) => void
  isShown: boolean
  smallHeight?: boolean
  takingFullWidth?: boolean
  isMessage?: boolean
}

const ModalWrapper = ({ children, setModal, isShown, smallHeight = false, takingFullWidth = false, isMessage = false }: ModalWrapperProps) => {
  if (!isShown) return null

  return (
    <div
      className={`fixed ${
        takingFullWidth
          ? `left-1/2 -translate-x-1/2 ${isMessage ? 'w-full' : 'w-[60%]'} max-lg:w-full top-1/2 -translate-y-1/2`
          : 'w-[60%] left-1/2 -translate-x-1/2'
      } ${smallHeight ? 'h-[99%]' : 'h-screen'} top-0 flex justify-center items-center z-50`}
    >
      <div onClick={() => setModal(false)} className="bg-black opacity-70 w-full h-screen fixed -z-10"></div>
      <div className="relative bg-white w-[550px] max-sm:w-11/12 max-md:w-2/3 min-w-[550px] min-h-[85%] max-h-[85%] overflow-y-auto rounded-2xl shadow-lg px-4 py-4">
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
