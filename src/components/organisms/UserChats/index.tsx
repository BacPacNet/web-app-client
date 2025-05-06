import React from 'react'
import { Chat } from '@/types/constants'
import { useUniStore } from '@/store/store'

import UserChatCard from '@/components/molecules/UserChatCard'
import { useRouter } from 'next/navigation'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'

interface props {
  setSelectedChat: (value: Chat | undefined) => void
  setIsRequest: (value: boolean) => void
  selectedChat: Chat | undefined
  currTabb: string
  chats: any
  isChatLoading: boolean
}

const UserChats = ({ setSelectedChat, selectedChat, setIsRequest, currTabb, chats, isChatLoading }: props) => {
  const { userData } = useUniStore()
  const router = useRouter()
  const handleClick = (item: Chat) => {
    setSelectedChat(item)
    router.replace(`/messages?id=${item._id}`)
  }

  const RenderChats = () => {
    if (currTabb === 'Inbox') {
      const filteredChats = chats?.filter(
        (item: Chat) =>
          (item.users.find((user) => user?.userId._id.toString() === userData?.id && user?.isRequestAccepted) ||
            item.isRequestAccepted ||
            item.groupAdmin.toString() === userData?.id) &&
          (item.latestMessage || item.isGroupChat)
      )

      if (isChatLoading) {
        return (
          <div className="p-2">
            <UserListItemSkeleton />
            <UserListItemSkeleton />
            <UserListItemSkeleton />
          </div>
        )
      }
      if (!filteredChats) {
        return (
          <div className="p-4">
            <UserListItemSkeleton />
            <UserListItemSkeleton />
            <UserListItemSkeleton />
            <UserListItemSkeleton />
            <UserListItemSkeleton />
            <UserListItemSkeleton />
          </div>
        )
      }

      if (filteredChats.length === 0) {
        return <p className="text-neutral-500 text-center py-16">There are no chats in your Inbox yet.</p>
      }

      return filteredChats?.map((item: Chat) => (
        <div onClick={() => handleClick(item)} key={item?._id} className="flex flex-col gap-2 border-b-[1px] border-neutral-200 cursor-pointer">
          <UserChatCard
            profilePic={item?.isGroupChat ? item?.groupLogo?.imageUrl : item?.groupLogoImage}
            groupName={item?.chatName}
            isGroupChat={item?.isGroupChat}
            users={[item?.users]}
            isSeen={item?.latestMessage?.readByUsers?.includes(userData?.id || ' ')}
            lastMessage={item?.latestMessage?.content}
            date={item?.latestMessage?.createdAt}
            YourID={userData?.id}
            unRead={item?.unreadMessagesCount}
          />
        </div>
      ))
    } else if (currTabb === 'Requests') {
      const filteredChats = chats?.filter((item: Chat) =>
        item.isGroupChat
          ? item.users.some((user) => user.userId._id.toString() === userData?.id && !user.isRequestAccepted)
          : !item.isRequestAccepted && item.groupAdmin.toString() !== userData?.id
      )

      if (filteredChats.length === 0) {
        return <p className="text-neutral-500 text-center py-8">You have no message requests at the moment.</p>
      }

      return filteredChats.map((item: Chat) => (
        <div onClick={() => setSelectedChat(item)} key={item?._id} className="flex flex-col gap-2 border-t border-neutral-300">
          <UserChatCard
            profilePic={item?.isGroupChat ? item?.groupLogo?.imageUrl : item?.groupLogoImage}
            groupName={item?.chatName}
            isGroupChat={item?.isGroupChat}
            users={[item?.users]}
            isSeen={item?.latestMessage?.readByUsers?.includes(userData?.id || ' ')}
            lastMessage={item?.latestMessage?.content}
            date={item?.latestMessage?.createdAt}
            YourID={userData?.id}
            unRead={item?.unreadMessagesCount}
          />
        </div>
      ))
    } else {
      const filteredChats = chats?.filter((item: Chat) => item.users.find((user) => user?.userId._id.toString() === userData?.id && user?.isStarred))

      if (filteredChats.length === 0) {
        return <p className="text-neutral-500 text-center">You have no starred chats.</p>
      }

      return filteredChats.map((item: Chat) => (
        <div onClick={() => setSelectedChat(item)} key={item?._id} className="flex flex-col gap-2 border-t py-5 border-neutral-300">
          <UserChatCard
            profilePic={item?.isGroupChat ? item?.groupLogo?.imageUrl : item?.groupLogoImage}
            groupName={item?.chatName}
            isGroupChat={item?.isGroupChat}
            users={[item?.users]}
            isSeen={item?.latestMessage?.readByUsers?.includes(userData?.id || ' ')}
            lastMessage={item?.latestMessage?.content}
            date={item?.latestMessage?.createdAt}
            YourID={userData?.id}
            unRead={item?.unreadMessagesCount}
          />
        </div>
      ))
    }
  }

  return (
    <div className="flex flex-col h-[inherit] overflow-y-scroll custom-scrollbar">
      <RenderChats />
    </div>
  )
}

export default UserChats
