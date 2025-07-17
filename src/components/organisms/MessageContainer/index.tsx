'use client'
import MessageTopBar from '@/components/molecules/MessageTopBar'
import React, { useEffect, useMemo, useState } from 'react'
import UserChats from '../UserChats'
import { Chat, ChatsArray, CommunityChat, SocketConnectionEnums } from '@/types/constants'
import MessageUserStickyBar from '@/components/molecules/MessageUserStickyBar'
import UserMessages from '@/components/molecules/UserMessages'
import { useUniStore } from '@/store/store'
import { useGetUserChats, useUpdateMessageIsSeen } from '@/services/Messages'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'
import { useSearchParams } from 'next/navigation'
import Loading from '@/components/atoms/Loading'
import UserMessageInput from '@/components/molecules/userMessageInput'
import { useFilteredChats } from '@/hooks/useFilteredChats'
import { useNewMessageHandler } from '@/hooks/useNewMessageHandler'

const MessageContainer = () => {
  const searchQuery = useSearchParams()
  const [currTab, setCurrTab] = useState('Inbox')
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined)

  const { userData, socket, userProfileData } = useUniStore()
  const userName = selectedChat?.users?.find((item) => item?.userId._id !== userData?.id)
  const { mutate: updateIsSeen } = useUpdateMessageIsSeen()
  const [isRequest, setIsRequest] = useState(true)
  const { data: chatsData, isLoading: isChatLoading, isFetching } = useGetUserChats()
  const [chats, setChats] = useState<ChatsArray | null>(null)
  const [onlineUsersSet, setOnlineUsersSet] = useState<Set<string>>(new Set())
  const [acceptedChatId, setAcceptedId] = useState('')
  const selectedUserId = searchQuery.get('id')
  const [searchByNameText, setSearchByNameText] = useState('')
  const [imageCarasol, setImageCarasol] = useState<{
    isShow: boolean
    images: any
    currImageIndex: number | null
  }>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })
  useNewMessageHandler(selectedChat)

  const totalUnreadMessages = chats?.reduce((sum, item) => {
    if (item.isGroupChat) {
      const isUserInGroup = item.users.some((user) => user.userId._id === userData?.id && user.isRequestAccepted)

      return isUserInGroup ? sum + item.unreadMessagesCount : sum
    } else {
      return item.isRequestAccepted ? sum + item.unreadMessagesCount : sum
    }
  }, 0)

  const totalUnreadNotAcceptedMessages = chats?.reduce((sum, item) => {
    const shouldInclude = item.isGroupChat
      ? item.users.some((user) => user.userId._id.toString() === userData?.id && !user.isRequestAccepted)
      : !item.isRequestAccepted && item.groupAdmin.toString() !== userData?.id

    return shouldInclude ? sum + item.unreadMessagesCount : sum
  }, 0)

  const filteredChats = useFilteredChats(chats, searchByNameText, userData?.id as string)

  const updateMessageSeen = () => {
    const isRead = selectedChat?.latestMessage?.readByUsers?.includes(userData?.id || '')

    if (!isRead && isRead !== undefined && selectedChat) {
      updateIsSeen({ chatId: selectedChat?._id, messageId: selectedChat?.latestMessage?._id, data: { readByUserId: userData?.id } })
      //   refetchMessageNotification()
    }
  }

  useEffect(() => {
    if (!selectedChat?.latestMessage) return
    updateMessageSeen()
  }, [selectedChat?.latestMessage])

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
    if (acceptedChatId.length > 0) {
      const chat = chats?.find((item) => item._id == acceptedChatId)

      setSelectedChat(chat)
    }
  }, [acceptedChatId])

  useEffect(() => {
    if (selectedUserId) {
      const selectedChatBySearchQuery = chats?.find((item) => item._id.toString() == selectedUserId)
      if (selectedChatBySearchQuery) {
        setSelectedChat(selectedChatBySearchQuery)
      }
    }
  }, [selectedUserId, chats])

  useEffect(() => {
    if (imageCarasol.isShow) {
      openImageModal(<PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} messageImage={true} />)
    }
  }, [imageCarasol])

  const renderTab = () => {
    if (isFetching) {
      return <Loading />
    }

    switch (currTab) {
      case 'Inbox':
        return (
          <UserChats
            setSelectedChat={setSelectedChat}
            selectedChat={selectedChat}
            currTabb={currTab}
            setIsRequest={setIsRequest}
            chats={filteredChats}
            isChatLoading={isChatLoading}
          />
        )

      case 'Requests':
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
        <div className="flex flex-col gap-2">
          <MessageUserStickyBar
            setSelectedChat={setSelectedChat}
            name={selectedChat?.isGroupChat ? selectedChat?.chatName : userName?.userId.firstName ?? 'Unknown'}
            users={selectedChat?.users}
            yourID={userData?.id || ''}
            isGroupChat={selectedChat?.isGroupChat}
            isRequestNotAccepted={currTab == 'Requests'}
            chatId={selectedChat?._id}
            profileCover={selectedChat?.isGroupChat ? selectedChat?.groupLogo?.imageUrl : selectedChat?.groupLogoImage}
            description={selectedChat?.groupDescription}
            setAcceptedId={setAcceptedId}
            setCurrTab={setCurrTab}
            isBlockedByYou={selectedChat.blockedBy.some((id) => id.toString() == userData?.id)}
            groupAdminId={selectedChat?.groupAdmin}
            communitySelected={selectedChat?.community as CommunityChat}
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
            isRequestNotAccepted={currTab == 'Requests'}
            setAcceptedId={setAcceptedId}
            setCurrTab={setCurrTab}
          />
          <div className=" w-full px-4 absolute bottom-4">
            <UserMessageInput
              chatId={selectedChat._id}
              userProfileId={userProfileData?._id || ''}
              isRequestNotAccepted={currTab == 'Requests'}
              isBlocked={selectedChat?.isBlock}
              setAcceptedId={setAcceptedId}
              setCurrTab={setCurrTab}
              isGroupChat={selectedChat?.isGroupChat}
            />
          </div>
        </div>
      )
    } else {
      return renderTab()
    }
  }
  return (
    <div className="flex flex-col h-full">
      {!selectedChat ? (
        <MessageTopBar
          currTab={currTab}
          setCurrTab={setCurrTab}
          setSelectedChat={setSelectedChat}
          unreadChatsCount={totalUnreadMessages || 0}
          unreadNotAcceptedChatsCount={totalUnreadNotAcceptedMessages || 0}
          setSearchByNameText={setSearchByNameText}
          searchByNameText={searchByNameText}
        />
      ) : null}

      <div className="flex-1 relative overflow-y-auto custom-scrollbar">{renderChat()}</div>
    </div>
  )
}

export default MessageContainer
