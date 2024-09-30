'use client'
import MessageSideBar from '@/components/messages/MessageSideBar'
import UserMessageContainer from '@/components/messages/UserMessageContainer'
import { useUpdateMessageIsSeen } from '@/services/Messages'
import { useUniStore } from '@/store/store'
import { Chat } from '@/types/constants'
import React, { useEffect, useState } from 'react'

const ChatScreen = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined)

  const { userData } = useUniStore()
  const userName = selectedChat?.users?.find((item) => item?.userId._id !== userData.id)

  const { mutate: updateIsSeen } = useUpdateMessageIsSeen()
  const [isRequest, setIsRequest] = useState(true)

  const updateMessageSeen = () => {
    const isRead = selectedChat?.latestMessage?.readByUsers?.includes(userData.id)

    if (!isRead && isRead !== undefined && selectedChat) {
      updateIsSeen({ chatId: selectedChat?._id, messageId: selectedChat?.latestMessage?._id, data: { readByUserId: userData.id } })
    }
  }

  useEffect(() => {
    updateMessageSeen()
  }, [selectedChat])

  return (
    <div className="p-8 flex  justify-center  h-[84.5vh]">
      <div className="border-2 border-slate-500 w-4/5 rounded-lg flex">
        <MessageSideBar setSelectedChat={setSelectedChat} selectedChat={selectedChat} isRequest={isRequest} setIsRequest={setIsRequest} />
        {selectedChat?._id && (
          <UserMessageContainer
            chatId={selectedChat._id}
            name={selectedChat.isGroupChat ? selectedChat.chatName : userName?.userId.firstName ?? 'Unknown'}
            users={selectedChat?.users}
            profileCover={selectedChat?.groupLogoImage ?? ''}
            isRequest={isRequest}
            isGroupChat={selectedChat?.isGroupChat}
          />
        )}
      </div>
    </div>
  )
}

export default ChatScreen
