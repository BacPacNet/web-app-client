import React, { useEffect, useRef, useState } from 'react'
import Buttons from '@/components/atoms/Buttons'
import { GoSearch } from 'react-icons/go'
import { BiChevronDown } from 'react-icons/bi'
import CreateChatModal from '../CreateChatModal'
import { useModal } from '@/context/ModalContext'

type Props = {
  setCurrTab: (value: string) => void
  setSelectedChat: (value: undefined) => void
  setSearchByNameText: (value: string) => void
  currTab: string
  searchByNameText: string
  unreadChatsCount: number
  unreadNotAcceptedChatsCount: number
}

const MessageTopBar = ({
  currTab,
  setCurrTab,
  unreadNotAcceptedChatsCount,
  setSelectedChat,
  unreadChatsCount,
  setSearchByNameText,
  searchByNameText,
}: Props) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const { openModal } = useModal()

  const handleShowModal = () => {
    openModal(<CreateChatModal setSelectedChat={setSelectedChat} />, ' bg-white rounded-xl  custom-scrollbar', false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <div className="flex justify-between items-center p-4 mb-2">
        <h6 className="font-poppins font-bold text-[20px]  ">Messages</h6>
        <Buttons className="block" size="extra_small_paddind_2" onClick={() => handleShowModal()}>
          Start a Chat
        </Buttons>
      </div>
      <div className="flex gap-4 justify-between items-center px-4 my-2">
        {/* // tabs  */}
        <div className="relative " ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={` flex justify-between items-center border 
                   border-neutral-200
                        rounded-lg py-3 px-4  text-xs font-semibold text-neutral-700 h-10 bg-white shadow-sm w-[106px]`}
          >
            {currTab}

            <BiChevronDown className="w-4 h-4 ml-2" />
          </button>
          {showDropdown && (
            <div className="absolute left-0 top-full mt-2 w-[149px] max-h-64 bg-white shadow-lg border border-neutral-300 rounded-lg z-50 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-4 py-3 bg-white rounded-lg hover:bg-gray-100 border-b border-neutral-200 last:border-b-0 text-black">
                <p
                  onClick={() => {
                    setCurrTab('Inbox')
                    setSelectedChat(undefined)
                    setShowDropdown(false)
                  }}
                  className={`${
                    currTab == 'Inbox' ? 'border-e-2 border-primary-500' : ''
                  } ps-2 cursor-pointer text-neutral-700 text-2xs font-medium flex items-center gap-2`}
                >
                  Inbox
                  {unreadChatsCount > 0 && (
                    <p
                      className={`bg-destructive-600  h-4 ${
                        unreadChatsCount > 9 ? 'px-1 min-w-4' : 'w-4'
                      }  rounded-full text-white flex items-center justify-center  text-2xs font-semibold `}
                    >
                      {unreadChatsCount}
                    </p>
                  )}
                </p>
                <p
                  onClick={() => {
                    setCurrTab('Requests')
                    setSelectedChat(undefined)
                    setShowDropdown(false)
                  }}
                  className={`${
                    currTab == 'Requests' ? 'border-e-2 border-primary-500' : ''
                  } ps-2 cursor-pointer text-neutral-700 text-2xs font-medium flex items-center gap-2`}
                >
                  Requests
                  {unreadNotAcceptedChatsCount > 0 && (
                    <p
                      className={`bg-destructive-600  h-4 ${
                        unreadNotAcceptedChatsCount > 9 ? 'px-1 min-w-4' : 'w-4'
                      }  rounded-full text-white flex items-center justify-center  text-2xs font-semibold `}
                    >
                      {unreadNotAcceptedChatsCount}
                    </p>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="w-full px-3 py-2 border border-neutral-200 shadow-sm rounded-lg flex items-center gap-4  h-10">
          <input
            type="text"
            value={searchByNameText}
            onChange={(e) => setSearchByNameText(e.target.value)}
            className="text-xs w-full outline-none text-neutral-700"
            placeholder="Search Messages"
          />
          <GoSearch className="text-neutral-700" size={20} />
        </div>
      </div>
    </>
  )
}

export default MessageTopBar
