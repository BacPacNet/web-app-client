import { useUniStore } from '@/store/store'
import React, { Fragment, useEffect } from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import UserMessage from './UserMessage'
import MessageInputBox from './MessageInputBox'
import { useAcceptGroupRequest, useAcceptRequest, useGetUserMessages } from '@/services/Messages'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import { Message, messages, SocketEnums } from '@/types/constants'
import { useQueryClient } from '@tanstack/react-query'

dayjs.extend(relativeTime)
dayjs.extend(calendar)

type User = {
  userId: {
    _id: string
    firstName: string
  }
  isOnline?: boolean
}

type props = {
  name: string
  profileCover: string
  chatId: string
  users: User[]
  isRequest: boolean
  isGroupChat: boolean
}

const formatDate = (date: any) => dayjs(date).calendar()

const UserMessageContainer = ({ name, profileCover, chatId, users, isRequest, isGroupChat }: props) => {
  const { userData, userProfileData } = useUniStore()
  const { data: chatMessages } = useGetUserMessages(chatId)
  const { mutate: acceptRequest } = useAcceptRequest()
  const { mutate: acceptGroupRequest } = useAcceptGroupRequest()

  const user = users?.find((me) => me.userId._id !== userData?.id)
  let previousDate: any = ''

  const { socket } = useUniStore()
  const queryClient = useQueryClient()

  interface reactedMessage {
    message: {
      _id: string
      reactions: {
        userId: string
        emoji: string
      }[]
    }
  }

  const handleReactedMessage = (reactedMessage: reactedMessage) => {
    const chatData = queryClient.getQueryData<messages>(['chatMessages', chatId])

    if (!chatData) {
      console.error('No chat data found for this chatId')
      return
    }
    const messageIndex = chatData.findIndex((message) => message._id === reactedMessage?.message?._id)

    if (messageIndex !== -1) {
      const updatedMessages = [...chatData]
      updatedMessages[messageIndex] = {
        ...updatedMessages[messageIndex],
        reactions: reactedMessage?.message?.reactions,
      }
      queryClient.setQueryData(['chatMessages', chatId], updatedMessages)
    }
  }

  useEffect(() => {
    if (!socket) {
      console.log('Socket is not initialized')
      return
    }

    socket.on(SocketEnums.REACTED_SEND_MESSAGE, handleReactedMessage)

    return () => {
      if (socket) {
        socket.off(SocketEnums.REACTED_SEND_MESSAGE, handleReactedMessage)
      }
    }
  }, [socket])

  return (
    <div className=" w-full h-full flex flex-col justify-between">
      <div className="border-b-2 border-slate-500 flex justify-between ">
        <div className="flex gap-2 items-center ps-4 py-1">
          {profileCover ? (
            <div className="relative">
              <img className="min-w-[40px] h-10 rounded-full object-cover" src={profileCover} alt="user-pic" />
              {user?.isOnline && <p className="bg-green w-3 h-3 rounded-full absolute right-0 bottom-1"></p>}
            </div>
          ) : (
            <div className="relative">
              <div className="min-w-[40px] h-10 rounded-full bg-gray"></div>
              {user?.isOnline && <p className="bg-green w-3 h-3 rounded-full absolute right-0 bottom-1"></p>}
            </div>
          )}
          <p className="font-semibold text-sm">{name}</p>
        </div>
        <div className="flex items-center px-4">
          <HiOutlineInformationCircle size={20} />
        </div>
      </div>
      {/* //Messages  */}
      <div className="px-4 py-5 flex flex-col gap-10 overflow-y-scroll h-full">
        {chatMessages?.map((item: Message, idx: number) => {
          const currentDate = formatDate(item.createdAt)

          // Check if the date has changed
          const shouldShowDateDivider = !dayjs(item.createdAt).isSame(previousDate, 'day')
          previousDate = dayjs(item.createdAt)

          return (
            <Fragment key={idx}>
              {shouldShowDateDivider && (
                <div className="date-divider">
                  <span>{currentDate}</span>
                </div>
              )}
              <UserMessage
                profilePic={item?.senderProfile?.profile_dp?.imageUrl}
                name={item?.sender?.firstName}
                content={item?.content}
                myMessage={item?.sender?.id === userData?.id}
                date={item.createdAt}
                id={item?._id}
                reactions={item?.reactions}
                chatId={chatId}
                media={item?.media}
              />
            </Fragment>
          )
        })}
      </div>
      {/* // input box  */}
      {isRequest ? (
        <MessageInputBox chatId={chatId} userProfileId={userProfileData?._id || ''} />
      ) : (
        <div>
          <p>Accept request to message</p>
          {isGroupChat ? (
            <button onClick={() => acceptGroupRequest({ chatId })}>Accept group Request</button>
          ) : (
            <button onClick={() => acceptRequest({ chatId })}>Accept single</button>
          )}
        </div>
      )}
    </div>
  )
}

export default UserMessageContainer
