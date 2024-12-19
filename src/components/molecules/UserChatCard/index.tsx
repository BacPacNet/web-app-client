import Image from 'next/image'
import React from 'react'
import avatar from '@assets/avatar.svg'
import { FaUsers } from 'react-icons/fa'
import { format } from 'date-fns'
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
      <div className=" hover:bg-secondary">
        <div className="flex justify-between p-4">
          <div className="flex gap-4 items-center relative">
            <div className="w-12 h-12 flex-none">
              {isGroupChat && !profilePic ? (
                <FaUsers className="w-12 h-12 rounded-full bg-neutral-200 p-2 text-primary-700" />
              ) : (
                <Image width={48} height={48} src={profilePic || avatar} alt="dp" objectFit="cover" className="w-12 h-12 rounded-full" />
              )}

              {unRead && unRead > 0 ? (
                <p className="bg-destructive-600  w-4 h-4  rounded-full absolute bottom-0 left-8 border-2 border-white text-white flex justify-center items-center text-[8px] font-semibold">
                  {unRead > 9 ? '9+' : unRead}
                </p>
              ) : userName?.some((item) => item?.isOnline) ? (
                <p className="bg-success-500 w-4 h-4 rounded-full absolute bottom-0 left-8 border-2 border-white text-white flex justify-center items-center text-[12px] font-semibold"></p>
              ) : (
                <p className="bg-neutral-300 w-4 h-4 rounded-full absolute bottom-0 left-8 border-2 border-white text-white flex justify-center items-center text-[12px] font-semibold"></p>
              )}
            </div>

            <div>
              <p className={`text-neutral-600  text-sm ${unRead > 0 ? 'font-semibold' : 'font-medium'}`}>
                {isGroupChat ? groupName : userName[0]?.userId?.firstName}
              </p>
              <p className={`text-neutral-500  text-[12px] ${unRead > 0 ? 'font-semibold' : 'font-medium'}`}>
                {lastMessage?.length > 20 ? lastMessage?.slice(0, 120) + '...' : lastMessage}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-neutral-400 font-normal text-[12px] ">{date && format(new Date(date), 'hh:mm a')}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserChatCard
