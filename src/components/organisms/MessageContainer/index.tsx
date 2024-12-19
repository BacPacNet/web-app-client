'use client'
import MessageTopBar from '@/components/molecules/MessageTopBar'
import React, { useEffect, useMemo, useState } from 'react'
import UserChats from '../UserChats'
import { Chat, ChatsArray, SocketConnectionEnums, SocketEnums } from '@/types/constants'
import MessageUserStickyBar from '@/components/molecules/MessageUserStickyBar'
import UserMessages from '@/components/molecules/UserMessages'
import { useUniStore } from '@/store/store'
import { useGetUserChats, useUpdateMessageIsSeen } from '@/services/Messages'
import { useQueryClient } from '@tanstack/react-query'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'

interface Message {
  _id: string
  chat: {
    _id: string
  }
  createdAt: string
  readByUsers?: string[]
}

const MessageContainer = () => {
  const [currTab, setCurrTab] = useState('Inbox')
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined)

  const { userData, socket } = useUniStore()
  const userName = selectedChat?.users?.find((item) => item?.userId._id !== userData?.id)
  const queryClient = useQueryClient()
  const { mutate: updateIsSeen } = useUpdateMessageIsSeen()
  const [isRequest, setIsRequest] = useState(true)
  const { data: chatsData, isLoading: isChatLoading } = useGetUserChats()
  const [chats, setChats] = useState<ChatsArray>([])
  const [onlineUsersSet, setOnlineUsersSet] = useState<Set<string>>(new Set())
  const [acceptedChatId, setAcceptedId] = useState('')

  const [imageCarasol, setImageCarasol] = useState<{
    isShow: boolean
    images: any
    currImageIndex: number | null
  }>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })

  const unreadChatsCount = chats.filter((item) => {
    if (item.isGroupChat) {
      return item.unreadMessagesCount > 0 && item.users.some((user) => user.userId._id == userData?.id && user.isRequestAccepted)
    } else {
      return item.unreadMessagesCount > 0 && item.isRequestAccepted
    }
  }).length
  const unreadNotAcceptedChatsCount = chats.filter((item) => {
    if (item.isGroupChat) {
      return item.unreadMessagesCount > 0 && item.users.some((user) => !user.isRequestAccepted)
    } else {
      return item.unreadMessagesCount > 0 && !item.isRequestAccepted
    }
  }).length

  const updateMessageSeen = () => {
    const isRead = selectedChat?.latestMessage?.readByUsers?.includes(userData?.id || '')

    if (!isRead && isRead !== undefined && selectedChat) {
      updateIsSeen({ chatId: selectedChat?._id, messageId: selectedChat?.latestMessage?._id, data: { readByUserId: userData?.id } })
    }
  }

  useEffect(() => {
    updateMessageSeen()
  }, [selectedChat])

  const handleNewMessage = (newMessage: Message) => {
    const { _id: chatMessageId, chat } = newMessage
    const messageChatId = chat?._id
    const isActiveChat = selectedChat?._id === messageChatId

    const chatData: ChatsArray = queryClient.getQueryData(['userChats']) || []

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

      updatedChats.sort((a, b) => {
        const dateA = a.latestMessage?.createdAt ? new Date(a.latestMessage.createdAt).getTime() : 0
        const dateB = b.latestMessage?.createdAt ? new Date(b.latestMessage.createdAt).getTime() : 0
        return dateB - dateA
      })
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

      if (!isRead && selectedChat?._id) {
        updateIsSeen({ chatId: selectedChat?._id, messageId: chatMessageId, data: { readByUserId: userData?.id } })
      }
    } else if (!chatData.some((chat) => chat._id == messageChatId)) {
      queryClient.invalidateQueries({ queryKey: ['userChats'] })
      return
    }
  }

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

    const updateCurrSelectedChat = () => {
      const toWrite = updatedChats.find((item) => item._id == selectedChat?._id)
      setSelectedChat(toWrite)
    }

    updateCurrSelectedChat()
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

  useEffect(() => {
    if (acceptedChatId.length > 0) {
      const chat = chats.find((item) => item._id == acceptedChatId)

      setSelectedChat(chat)
    }
  }, [acceptedChatId])

  useEffect(() => {
    if (imageCarasol.isShow) {
      openImageModal(<PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} messageImage={true} />)
    }
  }, [imageCarasol])

  const renderTab = () => {
    switch (currTab) {
      case 'Inbox':
        return (
          <UserChats
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
            currTabb={currTab}
            setIsRequest={setIsRequest}
            chats={chats}
            isChatLoading={isChatLoading}
          />
        )

      case 'Message Requests':
        return (
          <UserChats
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
            currTabb={currTab}
            setIsRequest={setIsRequest}
            chats={chats}
            isChatLoading={isChatLoading}
          />
        )

      case 'Starred':
        return (
          <UserChats
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
            currTabb={currTab}
            setIsRequest={setIsRequest}
            chats={chats}
            isChatLoading={isChatLoading}
          />
        )
    }
  }

  const renderChat = () => {
    if (selectedChat) {
      return (
        <>
          <MessageUserStickyBar
            setSelectedChat={setSelectedChat}
            name={selectedChat?.isGroupChat ? selectedChat?.chatName : userName?.userId.firstName ?? 'Unknown'}
            studyYear={userName?.userId.studyYear ?? 'Unknown'}
            degree={userName?.userId.degree ?? 'Unknown'}
            universitry={userName?.userId.universityName ?? 'Unknown'}
            users={selectedChat?.users}
            yourID={userData?.id || ''}
            isGroupChat={selectedChat?.isGroupChat}
            isRequestNotAccepted={currTab == 'Message Requests'}
            chatId={selectedChat?._id}
            profileCover={selectedChat?.isGroupChat ? selectedChat?.groupLogo?.imageUrl : selectedChat?.groupLogoImage}
            description={selectedChat?.groupDescription}
            setAcceptedId={setAcceptedId}
            setCurrTab={setCurrTab}
          />
          <UserMessages
            chatId={selectedChat._id}
            name={selectedChat.isGroupChat ? selectedChat.chatName : userName?.userId.firstName ?? 'Unknown'}
            users={selectedChat?.users}
            profileCover={selectedChat?.groupLogoImage ?? ''}
            isRequest={isRequest}
            isGroupChat={selectedChat?.isGroupChat}
            yourID={userData?.id || ''}
            setImageCarasol={setImageCarasol}
            isRequestNotAccepted={currTab == 'Message Requests'}
          />
        </>
      )
    } else {
      return renderTab()
    }
  }
  return (
    <div className="bg-white mt-4 rounded-2xl drop-shadow-lg h-with-navbar-space">
      <MessageTopBar
        currTab={currTab}
        setCurrTab={setCurrTab}
        setSelectedChat={setSelectedChat}
        unreadChatsCount={unreadChatsCount}
        unreadNotAcceptedChatsCount={unreadNotAcceptedChatsCount}
      />
      <div className={`${selectedChat ? 'h-[90%] relative' : 'h-[90%]'}  `}>{renderChat()}</div>
    </div>
  )
}

export default MessageContainer
