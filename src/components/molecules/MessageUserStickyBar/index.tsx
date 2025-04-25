import React, { useState } from 'react'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import { IoIosArrowBack } from 'react-icons/io'

import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { useAcceptGroupRequest, useAcceptRequest, useLeaveGroup, useToggleBlockMessages, useToggleStarred } from '@/services/Messages'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'

import { HiOutlineLogin } from 'react-icons/hi'
import { FaCircleUser } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import { MdOutlineBlock } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import { userTypeEnum } from '@/types/RegisterForm'
import { openModal } from '../Modal/ModalManager'
import ChatGroupMembers from '../ChatGroupMembers'
import EditGroupChatModal from '../EditChatGroup'
type Props = {
  setSelectedChat: (value: any) => void
  yourID: string
  users: User[]
  name: string
  isRequestNotAccepted: boolean
  isGroupChat: boolean
  chatId: string
  profileCover: string | undefined
  description: string

  setAcceptedId: (value: string) => void
  setCurrTab: (value: string) => void
  isBlockedByYou: boolean
  groupAdminId: string
}

type User = {
  userId: {
    _id: string
    firstName: string
    lastName: string
    role: userTypeEnum
    occupation: string
    affiliation: string
    major: string
    studyYear: string
  }
  isOnline?: boolean
  isStarred: boolean
}

const MessageUserStickyBar = ({
  setSelectedChat,
  users,
  yourID,
  name,
  isRequestNotAccepted,
  isGroupChat,
  chatId,
  profileCover,
  description,

  setAcceptedId,
  setCurrTab,
  isBlockedByYou,
  groupAdminId,
}: Props) => {
  const userName = users?.flat().filter((item) => item.userId._id != yourID) || []
  const [open, setOpen] = useState(false)

  const { mutate: acceptRequest } = useAcceptRequest()
  const { mutate: acceptGroupRequest } = useAcceptGroupRequest()
  const { mutate: toggleStarred } = useToggleStarred()
  const { mutate: toggleBlockMessage } = useToggleBlockMessages(userName[0]?.userId?._id, isBlockedByYou)
  const { mutate: leaveGroup } = useLeaveGroup(chatId)
  const router = useRouter()

  const handleMoveToInbox = () => {
    if (isGroupChat) {
      acceptGroupRequest({ chatId })
    } else {
      acceptRequest({ chatId })
    }
    setCurrTab('Inbox')
    setAcceptedId(chatId)
  }

  const handleStarred = () => {
    toggleStarred({ chatId })
  }

  const handleBack = () => {
    setSelectedChat(undefined)
    router.push('/messages')
  }

  const handleShowModal = () => {
    openModal(
      <ChatGroupMembers users={users} chatId={chatId} adminId={groupAdminId} />,
      'relative w-full max-w-md bg-white rounded-2xl p-6 shadow-lg overflow-visible  custom-scrollbar',
      false
    )
  }

  const handleEditGroupModal = () => {
    openModal(
      <EditGroupChatModal chatId={chatId} groupLogo={profileCover || ''} groupCurrentName={name} />,
      'relative w-[400px] max-w-md bg-white rounded-2xl p-6 shadow-lg overflow-visible  custom-scrollbar ',
      false
    )
  }
  return (
    <div className="w-full top-0 z-10 flex justify-between border-b border-neutral-300 rounded-t-2xl bg-white pb-4 px-4">
      <div className="flex items-center gap-4">
        <p onClick={() => handleBack()}>
          <IoIosArrowBack className="w-6 h-6 text-[#6744FF] cursor-pointer" />
        </p>
        <div className="relative">
          <div className="w-10 h-10">
            <Image src={profileCover || avatar} alt="dp" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
          </div>
          <p
            className={`w-4 h-4 ${
              userName?.some((item) => item?.isOnline) ? 'bg-success-500' : 'bg-neutral-300'
            } rounded-full border-2 border-white absolute bottom-0 right-0 `}
          ></p>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-neutral-700">{name}</h3>
          {isGroupChat ? (
            <p className="text-2xs font-normal text-neutral-500">{description}</p>
          ) : (
            <>
              <p className="text-2xs font-normal text-neutral-500">
                {userName[0].userId.role == userTypeEnum.Student ? userName[0].userId.studyYear : userName[0].userId.occupation}
              </p>
              <p className="text-2xs font-normal text-neutral-500">
                {userName[0].userId.role == userTypeEnum.Student ? userName[0].userId.major : userName[0].userId.affiliation}
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-4 items-center ">
        {isRequestNotAccepted && (
          <button
            onClick={() => handleMoveToInbox()}
            className="bg-[#F3F2FF] border border-[#E9E8FF] text-primary-500 px-2 py-1 text-2xs font-medium rounded-lg drop-shadow-sm"
          >
            Move to inbox
          </button>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger onClick={() => setOpen(!open)}>
            <BiDotsHorizontalRounded className="w-8 h-8" />
          </PopoverTrigger>
          <PopoverContent className="p-0 relative drop-shadow-lg right-16 top-4 w-44 min-h-10 h-max bg-white shadow-card border-none">
            {isGroupChat ? (
              <div className="text-2xs h-32  text-neutral-700 font-medium flex flex-col justify-evenly items-center  w-full ps-10">
                <div
                  onClick={() => {
                    setOpen(false)
                    handleEditGroupModal()
                  }}
                  className="flex gap-1 items-center   w-40 cursor-pointer"
                >
                  <FaEdit size={16} className="text-primary-500" />
                  <p>Edit Group Chat</p>
                </div>
                <div
                  onClick={() => {
                    setOpen(false)
                    handleShowModal()
                  }}
                  className="flex gap-1 items-center   w-40 cursor-pointer"
                >
                  <FaCircleUser size={16} className="text-primary-500" />
                  <p>Show Members</p>
                </div>

                <div onClick={() => leaveGroup()} className="flex gap-1 items-center   w-40 cursor-pointer">
                  <HiOutlineLogin size={16} className="text-destructive-600" />
                  <p>Leave </p>
                </div>
              </div>
            ) : (
              <div className="text-2xs h-12  text-neutral-700 font-medium flex flex-col justify-evenly items-center  w-full ps-10">
                <div onClick={() => toggleBlockMessage({ chatId })} className="flex gap-1 items-center   w-40 cursor-pointer">
                  <MdOutlineBlock size={16} className="text-destructive-600" />
                  {isBlockedByYou ? <p>Un-Block Messages </p> : <p>Block Messages </p>}
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default MessageUserStickyBar
