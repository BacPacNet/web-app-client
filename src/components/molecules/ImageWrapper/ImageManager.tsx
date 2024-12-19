'use client'
import React, { useState, useCallback } from 'react'

let setModalState: any = null
let setContentState: any = null

export const ImageManager = () => {
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

  return isShown ? (
    <div className={`z-50 fixed  w-full h-screen top-0 flex items-center justify-center`}>
      <div onClick={() => setIsShown(false)} className="bg-black opacity-70 top-0 w-full h-screen fixed -z-10"></div>
      {modalContent}
    </div>
  ) : null
}

export const openImageModal = (content: React.ReactNode) => {
  if (setModalState) {
    setModalState(true)
    setContentState(content)
  }
}

export const closeImageModal = () => {
  if (setModalState) {
    setModalState(false)
    setContentState(null)
  }
}
