import React, { Fragment, useEffect, useRef, useState } from 'react'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import { Message, messages, SocketEnums } from '@/types/constants'
import { useUniStore } from '@/store/store'
import { useGetUserMessages, useReactMessageEmoji } from '@/services/Messages'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import calendar from 'dayjs/plugin/calendar'
import { format } from 'date-fns'
import UserMessageImageGrid from '../UserMessageImageGrid'

dayjs.extend(relativeTime)
dayjs.extend(calendar)
dayjs.extend(updateLocale)

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few sec',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy',
  },
})

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
  yourID: string
  setImageCarasol: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean
      images: any
      currImageIndex: number | null
    }>
  >
  isRequestNotAccepted: boolean
  setAcceptedId: (value: string) => void
  setCurrTab: (value: string) => void
}

type Props = {
  profilePic: string | undefined
  name: string
  content: string
  date: string
  myMessage: boolean
  id: string
  reactions: {
    userId: string
    emoji: string
  }[]
  chatId: string
  media: { imageUrl: string; publicId: string }[]
  isOnline: boolean
  setImageCarasol: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean
      images: any
      currImageIndex: number | null
    }>
  >
  idx: number
  role: string
  affiliation: string
  occupation: string
}

const emojis = ['👍', '🧡', '😆', '😂', '😇']

const UserCard = ({ role, affiliation, occupation, profilePic, name, content, date, chatId, media, isOnline, setImageCarasol, idx }: Props) => {
  const [isReact, setIsReact] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const { mutate: reactToMessage } = useReactMessageEmoji(chatId)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseDown = () => {
    timeoutRef.current = setTimeout(() => {
      setIsReact(!isReact)
    }, 1000)
  }

  const handleMouseUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  return (
    <div ref={ref} className="flex gap-2 relative w-full last-of-type:mb-2">
      <div className="relative w-10 h-10 flex-none">
        <Image src={profilePic || avatar} alt="dp" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        <p className={`w-4 h-4 ${isOnline ? 'bg-success-500' : 'bg-neutral-300'}  rounded-full border-2 border-white absolute bottom-0 right-0`}></p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-2 items-center">
          <p className="text-sm font-semibold text-neutral-700">{name}</p>
          <p className="text-xs font-normal text-neutral-400">{dayjs(new Date(date).toString()).fromNow()}</p>
        </div>
        <p className="text-2xs lg:text-xs text-neutral-900 font-inter whitespace-pre-wrap break-words overflow-hidden text-ellipsis">{content}</p>

        {media.length > 0 && (
          <div className="w-full">
            <UserMessageImageGrid images={media} />
          </div>
        )}
      </div>
    </div>
  )
}

const UserMessages = ({ chatId, users, yourID, setImageCarasol }: props) => {
  const userName = users?.flat().filter((item) => item.userId._id != yourID)

  const { userData } = useUniStore()
  const { data: chatMessages } = useGetUserMessages(chatId)
  const bottomRef = useRef<HTMLDivElement | null>(null)
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
      console.warn('Socket is not initialized')
      return
    }

    socket.on(SocketEnums.REACTED_SEND_MESSAGE, handleReactedMessage)

    return () => {
      if (socket) {
        socket.off(SocketEnums.REACTED_SEND_MESSAGE, handleReactedMessage)
      }
    }
  }, [socket])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  return (
    <div className="flex flex-col h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar py-4  gap-6 ">
      {chatMessages?.map((item: Message, idx: number) => {
        const currentDate = format(new Date(item.createdAt), 'EEE hh:mm a')
        const shouldShowDateDivider = !dayjs(item.createdAt).isSame(previousDate, 'day')
        previousDate = dayjs(item.createdAt)

        return (
          <Fragment key={idx}>
            {shouldShowDateDivider && (
              <div className="border-b border-neutral-300 relative">
                <div className="absolute -top-3 flex justify-center items-center w-full">
                  <span className="px-4 bg-white text-neutral-500 text-2xs"> {currentDate}</span>
                </div>
              </div>
            )}
            <UserCard
              profilePic={item?.senderProfile?.profile_dp?.imageUrl}
              name={item?.sender?.firstName}
              content={item?.content}
              myMessage={item?.sender.id === userData?.id}
              date={item.createdAt}
              id={item?._id}
              reactions={item?.reactions}
              chatId={chatId}
              media={item?.media}
              isOnline={userName?.some((item) => item?.isOnline)}
              setImageCarasol={setImageCarasol}
              idx={idx}
              role={item?.sender?.role}
              affiliation={item?.sender?.affiliation}
              occupation={item?.sender?.occupation}
            />
          </Fragment>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}

export default UserMessages
