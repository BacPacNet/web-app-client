'use client'
import React, { useState, useCallback } from 'react'
import ModalWrapper from './ModalWrapper'

let setModalState: any = null
let setContentState: any = null
let Style: any = null

export const ModalManager = () => {
  const [isShown, setIsShown] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)
  const [style, setStyle] = useState('')

  if (setModalState === null) {
    setModalState = setIsShown
    setContentState = setModalContent
    Style = setStyle
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
    <ModalWrapper setModal={hideModal} isShown={isShown} style={style}>
      {modalContent}
    </ModalWrapper>
  ) : null
}

export const openModal = (content: React.ReactNode, style: string = ' h-[500px] w-[550px]') => {
  if (setModalState) {
    setModalState(true)
    setContentState(content)
    Style(style)
  }
}

export const closeModal = () => {
  if (setModalState) {
    setModalState(false)
    setContentState(null)
  }
}
