import React, { ReactNode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { cn } from '@/lib/utils'
interface ModalProps {
  isOpen: boolean
  children: ReactNode
  onClose: () => void
  className?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, children, onClose, className }) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'))

    function keyListener(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', keyListener)

    return () => document.removeEventListener('keydown', keyListener)
  }, [onClose])

  if (!isOpen || !modalRoot) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className={cn('bg-white p-4 rounded-xl max-w-sm w-full space-y-4 relative', className)} onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 cursor-pointer text-4xl" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  )
}

export default Modal
