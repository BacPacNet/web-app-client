'use client'
import { useGetMessageNotification } from '@/services/notification'
import Image from 'next/image'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import avatar from '@assets/avatar.svg'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useUniStore } from '@/store/store'
import { TbMessage2Search } from 'react-icons/tb'

dayjs.extend(relativeTime)

type User = {
  _id: string
  firstName: string
  lastName: string
}

type ChatUser = {
  userId: User
  isRequestAccepted: boolean
}

type LatestMessage = {
  content: string
  media: string[]
  createdAt: string
}

export type MessageNotification = {
  _id: string
  chatName: string
  isGroupChat: boolean
  groupLogoImage?: string
  users: ChatUser[]
  latestMessage: LatestMessage
}

type MessageNotificationsProps = {
  message: MessageNotification[]
}

const MessageNotification = ({ message }: MessageNotificationsProps) => {
  const { fetchNextPage, isFetchingNextPage, hasNextPage } = useGetMessageNotification(3, false)
  const { userData } = useUniStore()

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current

        if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }
    }

    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (message.length < 1) {
    return (
      <div className="h-14 flex justify-center items-center gap-4">
        <TbMessage2Search size={24} className="text-neutral-700" />
        <p className="text-sm font-bold text-neutral-700">No Messages</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="max-h-[300px] w-96 overflow-y-scroll">
      {message.map((item) => (
        <div key={item?._id} className="py-2 px-3 border-b border-neutral-300 flex justify-between">
          <div className="flex gap-2">
            <div className="flex gap-2 items-center">
              <Image className="shadow-lg rounded-full" src={item?.groupLogoImage || avatar} width={36} height={36} alt="avatar" />
            </div>
            <div>
              <p>
                {item?.isGroupChat
                  ? item?.chatName
                  : `${item?.users?.find((user) => user?.userId._id.toString() !== userData?.id)?.userId.firstName || ''} ${
                      item?.users?.find((user) => user?.userId._id.toString() !== userData?.id)?.userId.lastName || ''
                    }`}
              </p>

              <p className="text-neutral-400 text-sm max-w-xs">
                {item?.latestMessage.content.length > 20 ? item?.latestMessage.content.slice(0, 20) + '...' : item?.latestMessage.content}
              </p>
              <p className="text-neutral-400 text-sm ">{item?.latestMessage.media.length ? 'Sent a media file' : ''}</p>
            </div>
          </div>
          <div className="flex items-center text-neutral-400">{dayjs(new Date(item?.latestMessage.createdAt).toString()).fromNow()}</div>
        </div>
      ))}
      {hasNextPage && (
        <div className="flex justify-center fixed rounded-b-md -bottom-6 bg-white w-11/12 ">
          <button className="p-2 text-primary ">See More</button>
        </div>
      )}
    </div>
  )
}

export default MessageNotification
