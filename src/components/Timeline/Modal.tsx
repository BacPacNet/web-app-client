import { ReactNode, useState, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [showModal, setShowModal] = useState(isOpen)
  // const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  // useEffect(() => {
  //   if (showModal) {
  //     const handleEscape = (event: KeyboardEvent) => {
  //       if (event.key === 'Escape') {
  //         handleClose();
  //       }
  //     };
  //     window.addEventListener('keydown', handleEscape);
  //     return () => window.removeEventListener('keydown', handleEscape);
  //   }
  // }, []);

  const handleClose = () => {
    setShowModal(false)
    onClose()
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-[black] bg-opacity-10">
          <div className="relative w-auto mx-auto rounded-xl shadow-lg bg-white p-6 my-5">
            <button
              className="absolute top-2 right-2 p-1 bg-transparent border-0 text-gray-600 text-lg font-bold leading-none outline-none focus:outline-none"
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mt-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 230px)' }}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
