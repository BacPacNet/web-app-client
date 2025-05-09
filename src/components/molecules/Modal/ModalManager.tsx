'use client'
import React, { useState, useCallback } from 'react'
import ModalWrapper from './ModalWrapper'

let setModalState: any = null
let setContentState: any = null
let Style: any = null
let setShowCloseIconBool: any = null
let allowScroll: any = null

export const ModalManager = () => {
  const [isShown, setIsShown] = useState(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>(null)
  const [style, setStyle] = useState('')
  const [showCloseIcon, setShowCloseIcon] = useState(false)
  const [isAllowScroll, setIsAllowScroll] = useState(true)

  if (setModalState === null) {
    setModalState = setIsShown
    setContentState = setModalContent
    Style = setStyle
    setShowCloseIconBool = setShowCloseIcon
    allowScroll = setIsAllowScroll
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
    <ModalWrapper setModal={closeModal} isShown={isShown} style={style} showCloseIcon={showCloseIcon} isAllowScroll={isAllowScroll}>
      {modalContent}
    </ModalWrapper>
  ) : null
}

export const openModal = (
  content: React.ReactNode,
  style: string = ' h-[70vh] w-[350px] sm:w-[550px]   custom-scrollbar',
  showCloseIcon = true,
  isAllowedToScroll = true
) => {
  if (setModalState) {
    setModalState(true)
    setContentState(content)
    Style(style)
    setShowCloseIconBool(showCloseIcon)
    allowScroll(isAllowedToScroll)
  }
}

export const closeModal = () => {
  setModalState(false)
  setContentState(null)
}
