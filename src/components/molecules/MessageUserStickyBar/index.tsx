import React, { useState, useCallback } from 'react'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import { IoIosArrowBack } from 'react-icons/io'

import { BiDotsHorizontalRounded } from 'react-icons/bi'
import {
  useAcceptGroupRequest,
  useAcceptRequest,
  useDeleteChatGroup,
  useLeaveGroup,
  useToggleBlockMessages,
  useToggleStarred,
} from '@/services/Messages'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'

import { HiOutlineLogin } from 'react-icons/hi'
import { FaCircleUser } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import { MdOutlineBlock } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'
import { userTypeEnum } from '@/types/RegisterForm'
import ChatGroupMembers from '../ChatGroupMembers'
import EditGroupChatModal from '../EditChatGroup'
import { ChatUser, CommunityChat } from '@/types/constants'
import { useModal } from '@/context/ModalContext'
type Props = {
  setSelectedChat: (value: any) => void
  yourID: string
  users: ChatUser[]
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
  communitySelected: CommunityChat
  id: string
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
  //  description,
  setAcceptedId,
  setCurrTab,
  isBlockedByYou,
  groupAdminId,
  communitySelected,
  id,
}: Props) => {
  const userName = users?.flat().filter((item) => item.userId._id != yourID) || []
  const [open, setOpen] = useState(false)
  const { openModal } = useModal()

  const { mutate: acceptRequest } = useAcceptRequest()
  const { mutate: acceptGroupRequest } = useAcceptGroupRequest()
  const { mutate: toggleStarred } = useToggleStarred()
  const { mutate: toggleBlockMessage } = useToggleBlockMessages(userName[0]?.userId?._id, isBlockedByYou)
  const { mutate: leaveGroup } = useLeaveGroup(chatId)
  const { mutate: mutateDeleteChatGroup } = useDeleteChatGroup(chatId)
  const router = useRouter()

  const isGroupAdmin = yourID === groupAdminId

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
    openModal(<ChatGroupMembers users={users} chatId={chatId} adminId={groupAdminId} />)
  }

  const handleEditGroupModal = () => {
    openModal(
      <EditGroupChatModal
        users={users}
        chatId={chatId}
        groupLogo={profileCover || ''}
        groupCurrentName={name}
        communitySelected={communitySelected}
      />
    )
  }

  const handleProfileClicked = useCallback((id: string) => {
    if (isGroupChat) return
    router.push(`/profile/${id}`)
  }, [])
  return (
    <div className="w-full top-0 p-4 z-10 flex justify-between border-b border-neutral-300 rounded-t-2xl bg-white pb-4">
      <div className="flex items-center gap-4">
        <p onClick={() => handleBack()}>
          <IoIosArrowBack className="w-6 h-6 text-[#6744FF] cursor-pointer" />
        </p>
        <div className="relative">
          <div className="w-10 h-10">
            <Image
              onClick={() => handleProfileClicked(id as string)}
              src={profileCover || avatar}
              alt="dp"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
            />
          </div>
          {/* <p
            className={`w-4 h-4 ${
              userName?.some((item) => item?.isOnline) ? 'bg-success-500' : 'bg-neutral-300'
            } rounded-full border-2 border-white absolute bottom-0 right-0 `}
          ></p> */}
        </div>
        <div>
          <h3 onClick={() => handleProfileClicked(id as string)} className="text-xs font-semibold text-neutral-700 cursor-pointer">
            {name}
          </h3>
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
          <PopoverContent className="relative px-0 py-2 drop-shadow-lg right-16 top-4 w-fit bg-white shadow-card border-none">
            {isGroupChat ? (
              <div className="text-sm text-neutral-700 font-medium">
                {isGroupAdmin && (
                  <div
                    onClick={() => {
                      setOpen(false)
                      handleEditGroupModal()
                    }}
                    className="flex px-4 gap-2 py-2 items-center cursor-pointer hover:bg-neutral-200"
                  >
                    <FaEdit size={20} className="text-primary-500" />
                    <p>Edit Group Chat</p>
                  </div>
                )}

                <div
                  onClick={() => {
                    setOpen(false)
                    handleShowModal()
                  }}
                  className="flex gap-2 px-4 py-2 items-center  cursor-pointer hover:bg-neutral-200"
                >
                  <FaCircleUser size={20} className="text-primary-500" />
                  <p>Show Members</p>
                </div>

                {isGroupAdmin ? (
                  <div onClick={() => mutateDeleteChatGroup()} className="flex gap-2 px-4  py-2 items-center   cursor-pointer hover:bg-neutral-200">
                    <HiOutlineLogin size={20} className="text-destructive-600" />
                    <p>Delete Group </p>
                  </div>
                ) : (
                  <div onClick={() => leaveGroup()} className="flex gap-2 px-4  py-2 items-center   cursor-pointer hover:bg-neutral-200">
                    <HiOutlineLogin size={20} className="text-destructive-600" />
                    <p>Leave </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs px-4 py-2 text-neutral-700 font-medium flex flex-col justify-evenly items-center hover:bg-neutral-200 ">
                <div onClick={() => toggleBlockMessage({ chatId })} className="flex gap-2 items-center cursor-pointer">
                  <MdOutlineBlock size={20} className="text-destructive-600" />
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
