// ModalContext.tsx
'use client'
import ModalWrapper from '@/components/molecules/Modal/ModalWrapper'
import React, { createContext, useContext, useState } from 'react'

interface ModalContextType {
  openModal: (content: React.ReactNode, style?: string, showCloseIcon?: boolean, isAllowedToScroll?: boolean) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isShown, setIsShown] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)
  const [style, setStyle] = useState('')
  const [showCloseIcon, setShowCloseIcon] = useState(false)
  const [isAllowScroll, setIsAllowScroll] = useState(true)

  const openModal = (
    content: React.ReactNode,
    style = 'h-[70vh] w-[350px] sm:w-[550px] hideScrollbar',
    showCloseIcon = true,
    isAllowedToScroll = true
  ) => {
    setStyle(style)
    setModalContent(content)
    setShowCloseIcon(showCloseIcon)
    setIsAllowScroll(isAllowedToScroll)
    setIsShown(true)
  }

  const closeModal = () => {
    setIsShown(false)
    setModalContent(null)
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isShown && (
        <ModalWrapper setModal={closeModal} isShown={isShown} style={style} showCloseIcon={showCloseIcon} isAllowScroll={isAllowScroll}>
          {modalContent}
        </ModalWrapper>
      )}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) throw new Error('useModal must be used within a ModalProvider')
  return context
}
