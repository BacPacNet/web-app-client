import { useCallback, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { SocketEnums, Chat } from '@/types/constants'
import { useUniStore } from '@/store/store'
import { useUpdateMessageIsSeen } from '@/services/Messages'

export const useNewMessageHandler = (selectedChat?: Chat) => {
  const queryClient = useQueryClient()
  const { socket, userData } = useUniStore()
  const { mutate: updateIsSeen } = useUpdateMessageIsSeen()

  const handleNewMessage = useCallback(
    (newMessage: any) => {
      const chatId = newMessage.chat?._id
      const isActive = selectedChat?._id === chatId
      const chatData: Chat[] = queryClient.getQueryData(['userChats']) || []

      if (!isActive && chatData.some((c) => c._id === chatId)) {
        const updated = chatData.map((c) =>
          c._id === chatId ? { ...c, latestMessage: newMessage, unreadMessagesCount: (c.unreadMessagesCount || 0) + 1 } : c
        )
        updated.sort((a, b) => new Date(b.latestMessage?.createdAt || 0).getTime() - new Date(a.latestMessage?.createdAt || 0).getTime())
        queryClient.setQueryData(['userChats'], updated)
      } else if (isActive) {
        queryClient.setQueryData(['chatMessages', chatId], (old: any[]) => [...(old || []), newMessage])
        queryClient.setQueryData(
          ['userChats'],
          chatData.map((c) => (c._id === chatId ? { ...c, latestMessage: newMessage } : c))
        )

        if (!newMessage.readByUsers?.includes(userData?.id)) {
          updateIsSeen({
            chatId,
            messageId: newMessage._id,
            data: { readByUserId: userData?.id },
          })
        }
      } else {
        queryClient.invalidateQueries({ queryKey: ['userChats'] })
      }
    },
    [selectedChat, userData?.id, updateIsSeen, queryClient]
  )

  useEffect(() => {
    if (!socket) return

    socket.on(SocketEnums.RECEIVED_MESSAGE, handleNewMessage)

    return () => {
      socket.off(SocketEnums.RECEIVED_MESSAGE, handleNewMessage)
    }
  }, [socket, handleNewMessage])
}
