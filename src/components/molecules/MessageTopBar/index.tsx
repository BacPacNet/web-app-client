'use client'
import React, { useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import CreateGroupChat from '../CreateGroupChat'
import OneToChat from '../OneToOneChat'

type Props = {
  setCurrTab: (value: string) => void
  setSelectedChat: (value: undefined) => void
  currTab: string
  unreadChatsCount: number
  unreadNotAcceptedChatsCount: number
}

const MessageTopBar = ({ currTab, setCurrTab, unreadNotAcceptedChatsCount, setSelectedChat, unreadChatsCount }: Props) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showOneToOne, setShowOneToOne] = useState(false)

  return (
    <>
      <div className=" px-14 pt-12 pb-8 font-medium text-[20px] flex flex-col gap-9 relative">
        <div className=" flex gap-8 items-center">
          <div
            onClick={() => {
              setCurrTab('Inbox'), setSelectedChat(undefined)
            }}
            className={`${currTab == 'Inbox' ? 'text-primary-500' : 'text-neutral-500'} flex items-center gap-2 cursor-pointer`}
          >
            Inbox{' '}
            {unreadChatsCount > 0 && (
              <p className="bg-destructive-600 w-6 h-6 rounded-full text-white flex items-center justify-center  text-2xs font-semibold ">
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
              <p className="bg-destructive-600 w-6 h-6 rounded-full text-white flex items-center justify-center  text-2xs font-semibold ">
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

          <button onClick={() => setShowOneToOne(true)} className="bg-primary-500 px-3 py-2 text-xs font-medium text-white rounded-lg">
            Start a Chat
          </button>
          {/* <button onClick={() => setShowCreateGroup(true)} className="bg-primary-500 px-3 py-2 text-xs font-medium text-white rounded-lg">
            Start a Chat
          </button> */}
        </div>

        {/* <div className="relative w-full flex items-center gap-4 outline-none border border-neutral-300  py-2 px-5 rounded-[100px]">
          <IoIosSearch />
          <input
        
            type="text"
            placeholder="Search Messages"
            className=" outline-none w-full "
          />
        </div> */}
      </div>
      {showCreateGroup && <CreateGroupChat setShowCreateGroup={setShowCreateGroup} setShowOneToOne={setShowOneToOne} />}
      {showOneToOne && <OneToChat setShowOneToOne={setShowOneToOne} setShowCreateGroup={setShowCreateGroup} showOneToOne={showOneToOne} />}
    </>
  )
}

export default MessageTopBar
