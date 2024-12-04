import React from 'react'
import OneToChat from '../OneToOneChat'

import Buttons from '@/components/atoms/Buttons'

import { openModal } from '../Modal/ModalManager'

type Props = {
  setCurrTab: (value: string) => void
  setSelectedChat: (value: undefined) => void
  currTab: string
  unreadChatsCount: number
  unreadNotAcceptedChatsCount: number
}

const MessageTopBar = ({ currTab, setCurrTab, unreadNotAcceptedChatsCount, setSelectedChat, unreadChatsCount }: Props) => {
  const handleShowModal = () => {
    openModal(<OneToChat setSelectedChat={setSelectedChat} />)
  }

  return (
    <>
      <div className=" px-4 py-4 font-medium text-[20px] flex flex-col gap-9 relative border-b-[1px] border-neutral-200 font-poppins">
        <div className=" flex gap-8 items-center text-sm">
          <div
            onClick={() => {
              setCurrTab('Inbox'), setSelectedChat(undefined)
            }}
            className={`${currTab == 'Inbox' ? 'text-primary-500 font-semibold' : 'text-neutral-500'} flex items-center gap-2 cursor-pointer `}
          >
            Inbox
            {unreadChatsCount > 0 && (
              <p className="bg-destructive-600 w-4 h-4 rounded-full text-white flex items-center justify-center  text-2xs font-semibold ">
                {unreadChatsCount}
              </p>
            )}
          </div>
          <div
            onClick={() => {
              setCurrTab('Message Requests'), setSelectedChat(undefined)
            }}
            className={`${currTab == 'Message Requests' ? 'text-primary-500' : 'text-neutral-500'} flex items-center gap-2 cursor-pointer`}
          >
            Message Requests{' '}
            {unreadNotAcceptedChatsCount > 0 && (
              <p className="bg-destructive-600 w-4 h-4 rounded-full text-white flex items-center justify-center  text-2xs font-semibold ">
                {unreadNotAcceptedChatsCount}
              </p>
            )}
          </div>
          <p
            onClick={() => {
              setCurrTab('Starred'), setSelectedChat(undefined)
            }}
            className={`${currTab == 'Starred' ? 'text-primary-500' : 'text-neutral-500'} cursor-pointer `}
          >
            Starred
          </p>

          <Buttons size="extra_small" onClick={() => handleShowModal()}>
            Start a Chat
          </Buttons>
        </div>
      </div>
    </>
  )
}

export default MessageTopBar
