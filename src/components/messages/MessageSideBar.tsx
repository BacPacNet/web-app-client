'use client'
import React, { useEffect, useMemo, useState } from 'react'
import UserChat from './UserChat'
import { useUniStore } from '@/store/store'
import { IoChatboxEllipsesOutline } from 'react-icons/io5'
import Modal from '../Timeline/Modal'
import ConnectionsModal from '../Timeline/Modals/ConnectionsModal'
import { useGetUserChats, useUpdateMessageIsSeen } from '@/services/Messages'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import CreateGroup from './CreateGroup'
import { Chat, ChatsArray, SocketConnectionEnums, SocketEnums } from '@/types/constants'
import { useQueryClient } from '@tanstack/react-query'

dayjs.extend(relativeTime)

type props = {
  setSelectedChat: (value: Chat | undefined) => void
  setIsRequest: (value: boolean) => void
  selectedChat: Chat | undefined
  isRequest: boolean
}

interface Message {
  _id: string
  chat: {
    _id: string
  }
  readByUsers?: string[]
}

const MessageSideBar = ({ setSelectedChat, selectedChat, setIsRequest, isRequest }: props) => {
  const { userData, socket } = useUniStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [isRequest, setIsRequest] = useState(true)
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)
  const { data: chatsData } = useGetUserChats()
  const [chats, setChats] = useState<ChatsArray>([])
  const [onlineUsersSet, setOnlineUsersSet] = useState<Set<string>>(new Set())
  const { mutate: updateIsSeen } = useUpdateMessageIsSeen()
  const queryClient = useQueryClient()

  const userChatsId = useMemo(() => {
    return chatsData?.flatMap((chat) =>
      chat.users.map((user) => (user.userId._id !== userData?.id ? user.userId._id : null)).filter((id) => id !== null)
    )
  }, [chatsData, userData?.id])

  const uniqUserChatID = useMemo(() => new Set(userChatsId), [userChatsId])

  const updatedChats = () => {
    if (!chatsData) return

    const updatedChats = chatsData.map((chat) => ({
      ...chat,
      users: chat.users.map((user) => ({
        ...user,
        isOnline: onlineUsersSet?.has(user.userId._id) ?? false,
      })),
    }))

    setChats(updatedChats)
  }

  useEffect(() => {
    updatedChats()
  }, [chatsData, onlineUsersSet])

  useEffect(() => {
    if (!socket) return

    const requestOnlineUsers = () => {
      socket.emit('requestOnlineUsers', Array.from(uniqUserChatID))
    }

    requestOnlineUsers()
    // socket.on('connected', requestOnlineUsers)

    // return () => {
    //   socket.off('connected', requestOnlineUsers)
    // }
  }, [socket, uniqUserChatID])

  const updateOnlineStatus = (onlineUsers: string[]) => {
    setOnlineUsersSet((prevOnlineUsersSet: Set<string>) => {
      const updatedSet = new Set(prevOnlineUsersSet)
      onlineUsers.forEach((userId: string) => updatedSet.add(userId))
      return updatedSet
    })
  }

  const userDisconnected = (disconnectedUsers: string[]) => {
    setOnlineUsersSet((prevOnlineUsersSet) => {
      const updatedSet = new Set(prevOnlineUsersSet)

      disconnectedUsers.forEach((userId) => updatedSet.delete(userId))

      return updatedSet
    })
  }

  const handleNewMessage = (newMessage: Message) => {
    const { _id: chatMessageId, chat } = newMessage
    const messageChatId = chat?._id
    const isActiveChat = selectedChat?._id === messageChatId

    const chatData: ChatsArray = queryClient.getQueryData(['userChats']) || []

    // if (!chatData.some((chat) => chat._id == messageChatId)) {
    //   queryClient.invalidateQueries({ queryKey: ['userChats'] })
    //   return
    // }

    if (!isActiveChat && chatData.some((chat) => chat._id == messageChatId)) {
      const updatedChats = chatData.map((chat) =>
        chat._id === messageChatId
          ? {
              ...chat,
              latestMessage: newMessage,
              unreadMessagesCount: (chat.unreadMessagesCount || 0) + 1,
            }
          : chat
      )
      queryClient.setQueryData(['userChats'], updatedChats)
    } else if (isActiveChat) {
      queryClient.setQueryData(['chatMessages', selectedChat?._id], (oldMessages: Message[]) => [...(oldMessages || []), newMessage])

      const updatedChats = chatData.map((chat) =>
        chat._id === selectedChat?._id
          ? {
              ...chat,
              latestMessage: newMessage,
            }
          : chat
      )
      queryClient.setQueryData(['userChats'], updatedChats)

      const isRead = newMessage?.readByUsers?.includes(userData?.id || '')

      if (!isRead) {
        updateIsSeen({ chatId: selectedChat?._id, messageId: chatMessageId, data: { readByUserId: userData?.id } })
      }
    } else if (!chatData.some((chat) => chat._id == messageChatId)) {
      queryClient.invalidateQueries({ queryKey: ['userChats'] })
      return
    }
  }

  useEffect(() => {
    if (!socket) return

    socket.on(SocketConnectionEnums.ONLINEUSERS, updateOnlineStatus)
    socket.on(SocketConnectionEnums.ONLINEUSERS2, updateOnlineStatus)
    socket.on(SocketConnectionEnums.USER_DISCONNECT, userDisconnected)
    return () => {
      socket.off(SocketConnectionEnums.ONLINEUSERS2, updateOnlineStatus)
      socket.off(SocketConnectionEnums.ONLINEUSERS, updateOnlineStatus)
      socket.off(SocketConnectionEnums.USER_DISCONNECT, userDisconnected)
    }
  }, [socket])

  useEffect(() => {
    if (!socket) {
      console.log('Socket is not initialized')
      return
    }

    socket.on(SocketEnums.RECEIVED_MESSAGE, handleNewMessage)

    return () => {
      if (socket) {
        socket.off(SocketEnums.RECEIVED_MESSAGE, handleNewMessage)
      }
    }
  }, [socket, selectedChat])

  const ChatToShow = () => {
    if (isRequest) {
      return chats
        ?.filter(
          (item: Chat) =>
            item.users.find((user) => user.userId._id.toString() === userData?.id && user.isRequestAccepted) ||
            item.isRequestAccepted ||
            item.groupAdmin.toString() === userData?.id
        )
        .map((item: Chat) => (
          <div
            onClick={() => setSelectedChat(item)}
            key={item?._id}
            className={`first:border-t-2 border-slate-200 border-b-2 py-2 ${selectedChat?._id == item?._id && 'bg-slate-100'}`}
          >
            <UserChat
              profilePic={item?.isGroupChat ? item?.groupLogo?.imageUrl : item?.groupLogoImage}
              groupName={item?.chatName}
              isGroupChat={item?.isGroupChat}
              users={[item?.users]}
              isSeen={item?.latestMessage?.readByUsers?.includes(userData?.id ?? '')}
              lastMessage={item?.latestMessage?.content}
              date={item?.latestMessage?.createdAt && dayjs(new Date(item?.latestMessage?.createdAt).toString()).fromNow()}
              YourID={userData?.id}
              unRead={item?.unreadMessagesCount}
            />
          </div>
        ))
    } else {
      return chats
        ?.filter((item: Chat) =>
          item.isGroupChat
            ? item.users.some((user) => user.userId._id.toString() === userData?.id && !user.isRequestAccepted)
            : !item.isRequestAccepted && item.groupAdmin.toString() !== userData?.id
        )
        .map((item: Chat) => (
          <div
            onClick={() => setSelectedChat(item)}
            key={item?._id}
            className={`first:border-t-2 border-slate-200 border-b-2 py-2 ${selectedChat?._id == item?._id && 'bg-slate-100'}`}
          >
            <UserChat
              profilePic={item?.isGroupChat ? item?.groupLogo?.imageUrl : item?.groupLogoImage}
              groupName={item?.chatName}
              isGroupChat={item?.isGroupChat}
              users={[item?.users]}
              isSeen={item?.latestMessage?.readByUsers?.includes(userData?.id || ' ')}
              lastMessage={item?.latestMessage?.content}
              date={item?.latestMessage?.createdAt && dayjs(new Date(item?.latestMessage?.createdAt).toString()).fromNow()}
              YourID={userData?.id}
              unRead={item?.unreadMessagesCount}
            />
          </div>
        ))
    }
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ConnectionsModal isChat={true} setIsCreateGroupModalOpen={setIsCreateGroupModalOpen} setIsModalOpen={setIsModalOpen} />
      </Modal>

      <Modal isOpen={isCreateGroupModalOpen} onClose={() => setIsCreateGroupModalOpen(false)}>
        <CreateGroup />
      </Modal>

      <div className="border-r-2 border-slate-500 min-w-[250px] relative">
        <h3 className="border-b-2 py-3 px-5 font-semibold">Messages</h3>
        <div className="flex justify-center px-2 py-4">
          <input className="border border-slate-300 rounded-full ps-4 py-1 outline-none" type="text" placeholder="Search Messages" />
        </div>
        <div className="flex justify-between">
          <div
            className="w-1/2 text-center cursor-pointer"
            onClick={() => {
              setIsRequest(true), setSelectedChat(undefined)
            }}
          >
            Chats
          </div>
          <div
            className="w-1/2 text-center cursor-pointer"
            onClick={() => {
              setIsRequest(false), setSelectedChat(undefined)
            }}
          >
            Request
          </div>
        </div>
        <div className="flex flex-col ">
          <ChatToShow />
        </div>
        <div className="absolute bottom-10 left-6 bg-primary p-2 rounded-full hover:scale-125 transition-all " onClick={() => setIsModalOpen(true)}>
          <IoChatboxEllipsesOutline size={24} color="white" />
        </div>
      </div>
    </>
  )
}

export default MessageSideBar
