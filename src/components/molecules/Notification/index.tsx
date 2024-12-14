'use client'
import { useGetNotification, useUpdateIsSeenCommunityGroupNotification } from '@/services/notification'
import React, { useEffect, useRef } from 'react'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import { MdPersonAddAlt1 } from 'react-icons/md'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { MdOutlineNotificationImportant } from 'react-icons/md'
dayjs.extend(relativeTime)

type Notification = {
  _id: string
  sender_id: {
    _id: string
    firstName: string
    lastName: string
    profileDp?: string
  }
  message: string
  createdAt: string
}

type NotificationsProps = {
  notifications: Notification[]
}

const NotificationBox = ({ notifications }: NotificationsProps) => {
  const { fetchNextPage, isFetchingNextPage, hasNextPage } = useGetNotification(3, false)
  const { mutate: updateIsSeen } = useUpdateIsSeenCommunityGroupNotification()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleIsSeenGroup = (id: string) => {
    const dataToPush = {
      id: id,
    }
    updateIsSeen(dataToPush)
  }

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

  if (notifications.length < 1) {
    return (
      <div className="h-14 flex justify-center items-center gap-4">
        <MdOutlineNotificationImportant size={24} className="text-neutral-700" />
        <p className="text-sm font-bold text-neutral-700">No Notification</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="max-h-[300px] w-96 overflow-y-scroll">
      {notifications.map((item) => (
        <div key={item?._id} onClick={() => handleIsSeenGroup(item?._id)} className="py-2 px-3 border-b border-neutral-300 flex justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <MdPersonAddAlt1 size={18} className="text-green-400" />
              <Image
                className="shadow-lg rounded-full w-9 h-9 object-none"
                src={item?.sender_id?.profileDp || avatar}
                width={36}
                height={36}
                alt="avatar"
              />
            </div>
            <div>
              <p>{item?.sender_id?.firstName + ' ' + item?.sender_id?.lastName}</p>
              <p className="text-neutral-400 text-sm">{item?.message}</p>
            </div>
          </div>
          <div className="flex items-center text-neutral-400">{dayjs(new Date(item?.createdAt).toString()).fromNow()}</div>
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

export default NotificationBox
