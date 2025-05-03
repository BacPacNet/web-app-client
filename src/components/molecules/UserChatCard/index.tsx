import Image from 'next/image'
import React from 'react'
import avatar from '@assets/avatar.svg'
import { FaUsers } from 'react-icons/fa'
import { formatRelativeTime } from '@/lib/utils'
type User = {
  userId: {
    _id: string
    firstName: string
    lastName: string
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
        <div className="flex justify-between py-4 px-2 overflow-hidden">
          <div className="flex gap-4 items-center relative w-full">
            <div className="w-12 h-12 flex-none flex flex-col gap-2 cursor-pointer">
              {isGroupChat && !profilePic ? (
                <FaUsers className="w-12 h-12 rounded-full bg-neutral-200 p-2 text-primary-700" />
              ) : (
                <Image width={48} height={48} src={profilePic || avatar} alt="dp" objectFit="cover" className="w-12 h-12 rounded-full object-cover" />
              )}

              {userName?.some((item) => item?.isOnline) ? (
                <p className="bg-success-500 w-4 h-4 rounded-full absolute bottom-0 left-8 border-2 border-white text-white flex justify-center items-center text-[12px] font-semibold"></p>
              ) : (
                <p className="bg-neutral-300 w-4 h-4 rounded-full absolute bottom-0 left-8 border-2 border-white text-white flex justify-center items-center text-[12px] font-semibold"></p>
              )}
            </div>

            <div className="w-[90%]">
              <div className="flex justify-between w-full">
                <div className="flex gap-2 items-center w-full">
                  <p className={`text-neutral-600  text-sm ${unRead > 0 ? 'font-semibold' : 'font-medium'}`}>
                    {isGroupChat ? groupName : userName[0]?.userId?.firstName + ' ' + userName[0]?.userId?.lastName}
                  </p>
                  <div className="text-right min-w-fit relative">
                    <p className="text-neutral-400 font-normal text-[12px] ">{date?.length ? formatRelativeTime(new Date(date)) : ''}</p>
                  </div>
                </div>
                {unRead && unRead > 0 ? (
                  <p className="bg-destructive-600 text-3xs w-5 h-5  rounded-full border-2 border-white text-white flex justify-center items-center font-semibold">
                    {unRead > 9 ? '9+' : unRead}
                  </p>
                ) : null}
              </div>

              <p
                className={`text-neutral-500  text-[12px] line-clamp-1 whitespace-pre-wrap break-words overflow-hidden text-ellipsis w-[90%] ${
                  unRead > 0 ? 'font-semibold' : 'font-medium'
                }`}
              >
                {lastMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserChatCard
