import React, { ReactNode } from 'react'
import { IoClose } from 'react-icons/io5'
type Props = {
  children: ReactNode
  setModal: (value: boolean) => void
  isShown: boolean
  smallHeight?: boolean
  takingFullWidth?: boolean
  isMessage?: boolean
}

const ModalWrapper = ({ children, setModal, isShown, smallHeight = false, takingFullWidth = false, isMessage = false }: Props) => {
  if (!isShown) {
    return
  }
  return (
    <div
      className={`fixed ${
        takingFullWidth
          ? `left-1/2 -translate-x-1/2 ${isMessage ? 'w-full' : ' w-[60%]'}  max-lg:w-full top-1/2 -translate-y-1/2`
          : 'w-[60%] left-1/2 -translate-x-1/2'
      }  ${smallHeight ? 'h-[99%]' : 'h-screen'}   top-0 flex justify-center items-center z-50 `}
    >
      <div onClick={() => setModal(false)} className="bg-secondary opacity-70 w-full h-screen fixed -z-10 rounded-2xl"></div>
      <div className="bg-white w-[450px] max-sm:w-11/12 max-md:w-2/3 min-w-[370px] max-h-[32rem] max-sm:h-[32rem] overflow-y-auto custom-scrollbar rounded-2xl drop-shadow-lg px-8 pb-4">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setModal(false), console.log('modal')
            }}
            className="p-2"
          >
            <IoClose size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default ModalWrapper
