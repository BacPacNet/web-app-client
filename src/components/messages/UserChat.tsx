import React from 'react'

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

const UserChat = ({ profilePic, users, lastMessage, isSeen, date, YourID, groupName, isGroupChat, unRead }: Props) => {
  const userName = users?.flat().filter((item) => item.userId._id != YourID)

  return (
    <div className="flex gap-2 px-4">
      {profilePic ? (
        <div className="relative">
          <img className="min-w-[48px] h-12 rounded-full" src={profilePic} alt="user-pic" />
          {userName?.some((item) => item?.isOnline) && <div className="absolute top-0 w-4 h-4 rounded-full bg-green-300 "></div>}
          {unRead && unRead > 0 ? (
            <div className="absolute bottom-0 right-0 text-xs text-center text-white w-4 h-4 rounded-full bg-red-500 ">
              {unRead > 9 ? '9+' : unRead}
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="min-w-[48px] h-12 rounded-full bg-gray"></div>
          {userName?.some((item) => item?.isOnline) && <div className="absolute top-0 w-4 h-4 rounded-full bg-green "></div>}
          {unRead && unRead > 0 ? (
            <div className="absolute bottom-0 right-0 text-xs text-center text-white w-4 h-4 rounded-full bg-red-500 ">
              {unRead > 9 ? '9+' : unRead}
            </div>
          ) : (
            ''
          )}
        </div>
      )}
      <div className="w-full ">
        <div className="flex justify-between">
          <p className="font-semibold text-sm">{isGroupChat ? groupName : userName[0]?.userId?.firstName}</p>
          <p className="text-xs">{date}</p>
        </div>
        <p className={`text-xs ${isSeen ? 'text-slate-500' : 'text-black font-semibold'} `}>
          {lastMessage.length > 20 ? lastMessage.slice(0, 20) + '...' : lastMessage}
        </p>
      </div>
    </div>
  )
}

export default UserChat
