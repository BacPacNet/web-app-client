import React from 'react'
import { IoClose } from 'react-icons/io5'

type ModalWrapperProps = {
  children: React.ReactNode
  setModal: (value: boolean) => void
  isShown: boolean
  showCloseIcon: boolean
  isAllowScroll?: boolean
  style?: string
}

const ModalWrapper = ({ children, setModal, isShown, showCloseIcon, style = '', isAllowScroll = true }: ModalWrapperProps) => {
  if (!isShown) return null

  return (
    <div>
      <div onClick={() => setModal(false)} className="bg-black opacity-70 w-screen h-screen fixed z-20 top-0"></div>

      <div className={`fixed left-1/2 -translate-x-1/2  top-1/2 -translate-y-1/2 flex justify-center items-center z-50`}>
        <div
          className={`relative bg-white  ${style} mt-[68px]  max-h-[85%] ${
            isAllowScroll ? 'overflow-y-auto' : 'overflow-y-hidden'
          }  rounded-2xl shadow-lg p-6 `}
        >
          {showCloseIcon ? (
            <div className="absolute right-2 top-2 z-50">
              <button onClick={() => setModal(false)} className="p-2 hover:bg-neutral-200 rounded-md">
                <IoClose size={24} />
              </button>
            </div>
          ) : (
            ''
          )}

          {children}
        </div>
      </div>
    </div>
  )
}

export default ModalWrapper
