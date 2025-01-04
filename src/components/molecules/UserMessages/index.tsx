import React, { Fragment, useEffect, useRef, useState } from 'react'
import UserMessageInput from '../userMessageInput'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import { Message, messages, SocketEnums } from '@/types/constants'
import { useUniStore } from '@/store/store'
import { useGetUserMessages, useReactMessageEmoji } from '@/services/Messages'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
import PostCardImageGrid from '@/components/atoms/PostCardImagesGrid'

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

const formatDate = (date: any) => dayjs(date).calendar()

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
}

const emojis = ['👍', '🧡', '😆', '😂', '😇']

const UserCard = ({ profilePic, name, content, date, myMessage, id, reactions, chatId, media, isOnline, setImageCarasol, idx }: Props) => {
  const [isReact, setIsReact] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  const { mutate: reactToMessage } = useReactMessageEmoji(chatId)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [content])

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
    <div ref={ref} className="flex gap-2 relative w-full last-of-type:mb-12">
      <div className="relative w-10 h-10 flex-none">
        <Image src={profilePic || avatar} alt="dp" width={40} height={40} className="w-10 h-10 rounded-full" />
        <p className={`w-4 h-4 ${isOnline ? 'bg-success-500' : 'bg-neutral-300'}  rounded-full border-2 border-white absolute bottom-0 right-0`}></p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-2 items-center">
          <p className="text-sm font-semibold text-neutral-700">{name}</p>
          <p className="text-xs font-normal text-neutral-400">{dayjs(new Date(date).toString()).fromNow()}</p>
        </div>
        <p className="text-2xs lg:text-xs text-neutral-900 font-poppins whitespace-pre-wrap">{content}</p>
        {/* {media.length
          ? media.map((item) => <Image key={item.publicId} src={item?.imageUrl} alt="media" width={140} height={140} className="w-40 " />)
          : ''} */}
        <div className={`${media.length > 1 ? 'w-9/12' : 'w-1/2'}`}>
          <PostCardImageGrid images={media} setImageCarasol={setImageCarasol} idx={idx} />
        </div>
      </div>
      {/* //reaction  */}
      {/*{isReact && (
        <div className="absolute -bottom-8 bg-slate-200 rounded-full w-44 h-8 z-20 flex justify-between text-2xl ">
          {emojis.map((emoji) => (
            <p key={emoji} className="cursor-pointer" onClick={() => reactToMessage({ data: { messageId: id, emoji } })}>
              {emoji}
            </p>
          ))}
        </div>
      )}*/}
      {/*{reactions && (
        <div className="absolute -bottom-8  rounded-full w-8 h-8  flex justify-between text-2xl ">
          {reactions.map((emoji) => (
            <p key={emoji.userId} className="cursor-pointer">
              {emoji.emoji}
            </p>
          ))}
        </div>
      )}*/}
    </div>
  )
}

const UserMessages = ({
  name,
  profileCover,
  chatId,
  users,
  isRequest,
  isGroupChat,
  yourID,
  setImageCarasol,
  isRequestNotAccepted,
  setAcceptedId,
  setCurrTab,
}: props) => {
  const userName = users?.flat().filter((item) => item.userId._id != yourID)

  const { userData, userProfileData } = useUniStore()
  const { data: chatMessages } = useGetUserMessages(chatId)

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
    <div className="relative h-full">
      <div className="flex flex-col h-[78%] overflow-y-auto custom-scrollbar px-4  gap-8 ">
        {chatMessages?.map((item: Message, idx: number) => {
          const currentDate = formatDate(item.createdAt)
          // Check if the date has changed
          const shouldShowDateDivider = !dayjs(item.createdAt).isSame(previousDate, 'day')
          previousDate = dayjs(item.createdAt)

          return (
            <Fragment key={idx}>
              {shouldShowDateDivider && (
                <div className="border-b border-neutral-300 relative">
                  <div className="absolute -top-3 flex justify-center items-center w-full">
                    <span className="   px-4 bg-white text-neutral-500">{currentDate}</span>
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
              />
            </Fragment>
          )
        })}
      </div>
      <div className="fixed w-full bottom-0">
        <UserMessageInput
          chatId={chatId}
          userProfileId={userProfileData?._id || ''}
          isRequestNotAccepted={isRequestNotAccepted}
          setAcceptedId={setAcceptedId}
          setCurrTab={setCurrTab}
        />
      </div>
    </div>
  )
}

export default UserMessages
