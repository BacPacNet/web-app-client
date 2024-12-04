'use client'
import React, { useState, useCallback } from 'react'
import ModalWrapper from './ModalWrapper'

let setModalState: any = null
let setContentState: any = null

export const ModalManager = () => {
  const [isShown, setIsShown] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)

  if (setModalState === null) {
    setModalState = setIsShown
    setContentState = setModalContent
  }

  const showModal = (content: React.ReactNode) => {
    setModalContent(content)
    setIsShown(true)
  }

  const hideModal = () => {
    setIsShown(false)
    setModalContent(null)
  }

  const modalActions = {
    showModal,
    hideModal,
  }

  return isShown ? (
    <ModalWrapper setModal={hideModal} isShown={isShown} smallHeight={true} takingFullWidth={true} isMessage={true}>
      {modalContent}
    </ModalWrapper>
  ) : null
}

export const openModal = (content: React.ReactNode) => {
  if (setModalState) {
    setModalState(true)
    setContentState(content)
  }
}

export const closeModal = () => {
  if (setModalState) {
    setModalState(false)
    setContentState(null)
  }
}
