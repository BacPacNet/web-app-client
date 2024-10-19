import Image from 'next/image'
import React from 'react'
import avatar from '@assets/avatar.svg'
import { FaUsers } from 'react-icons/fa'
type User = {
  userId: {
    _id: string
    firstName: string
  }

  isOnline: boolean
  isRequestAccepted: boolean
}
type Props = {
  profilePic: string | undefined
  users: User[][]
  lastMessage: string
  date: string
  YourID: string | undefined
  groupName?: string
  isGroupChat: boolean
  isSeen: boolean
  unRead: number
}

const UserChatCard = ({ profilePic, users, lastMessage, isSeen, date, YourID, groupName, isGroupChat, unRead }: Props) => {
  const userName = users?.flat().filter((item) => item.userId._id != YourID)
  return (
    <>
      <div className="flex justify-between relative">
        {isGroupChat && !profilePic ? (
          <FaUsers className="w-14 h-14 rounded-full bg-neutral-200 p-2 text-primary-700" />
        ) : (
          <Image width={54} height={54} src={profilePic || avatar} alt="dp" objectFit="cover" className="w-14 h-14 rounded-full" />
        )}

        {unRead && unRead > 0 ? (
          <p className="bg-destructive-600 w-6 h-6 rounded-full absolute bottom-0 left-10 border-2 border-white text-white flex justify-center items-center text-[12px] font-semibold">
            {unRead > 9 ? '9+' : unRead}
          </p>
        ) : userName?.some((item) => item?.isOnline) ? (
          <p className="bg-success-500 w-6 h-6 rounded-full absolute bottom-0 left-10 border-2 border-white text-white flex justify-center items-center text-[12px] font-semibold"></p>
        ) : (
          <p className="bg-neutral-300 w-6 h-6 rounded-full absolute bottom-0 left-10 border-2 border-white text-white flex justify-center items-center text-[12px] font-semibold"></p>
        )}

        <p className="text-neutral-400 font-normal text-[12px]">{date}</p>
      </div>

      <div>
        <p className="text-neutral-600 font-medium text-sm">{isGroupChat ? groupName : userName[0]?.userId?.firstName}</p>
        <p className="text-neutral-500 font-normal text-[12px]">{lastMessage?.length > 20 ? lastMessage?.slice(0, 120) + '...' : lastMessage}</p>
      </div>
    </>
  )
}

export default UserChatCard
