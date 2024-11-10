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
        <div className="fixed w-screen inset-0 z-50 flex items-center justify-center  bg-[black] bg-opacity-[0.4]">
          <div className="relative xs:max-w-sm sm:max-w-max w-auto mx-auto my-14 rounded-xl shadow-lg overflow-x-hidden overflow-y-auto bg-white px-8 py-4 min-w-[40%]  h-[-webkit-fill-available]">
            <button
              className="absolute top-2 right-2 p-1 bg-transparent border-0 text-neutral-500 text-lg font-bold leading-none outline-none focus:outline-none"
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
            <div className="overflow-y-auto min-w-[40%]">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal
