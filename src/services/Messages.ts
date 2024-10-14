import useCookie from '@/hooks/useCookie'
import { client } from './api-Client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { ChatsArray, messages, SocketEnums } from '@/types/constants'
import { useUniStore } from '@/store/store'

export async function getUserChats(token: string) {
  const response: ChatsArray = await client(`/chat`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function createUserChat(token: string, data: any) {
  const response = await client(`/chat`, { headers: { Authorization: `Bearer ${token}` }, method: 'POST', data })
  return response
}
export async function createGroupChat(token: string, data: any) {
  const response = await client(`/chat/group`, { headers: { Authorization: `Bearer ${token}` }, method: 'POST', data })
  return response
}
export async function acceptRequest(token: string, data: any) {
  const response = await client(`/chat/acceptRequest`, { headers: { Authorization: `Bearer ${token}` }, method: 'PUT', data })
  return response
}
export async function acceptGroupRequest(token: string, data: any) {
  const response = await client(`/chat/acceptGroupRequest`, { headers: { Authorization: `Bearer ${token}` }, method: 'PUT', data })
  return response
}

export async function updateIsSeen(token: string, messageId: string, data: any) {
  const response = await client(`/message/${messageId}`, { headers: { Authorization: `Bearer ${token}` }, method: 'PUT', data })
  return response
}
export async function reactMessageEmoji(token: string, data: any) {
  const response = await client(`/message/react`, { headers: { Authorization: `Bearer ${token}` }, method: 'PUT', data })
  return response
}
export async function userFollowingAndFollowers(name: string, token: string) {
  const response: any = await client(`userprofile/following_and_followers?name=${name}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function getChatMessages(token: string, chatId: string) {
  const response: messages = await client(`/message/${chatId}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function createChatMessage(token: string, data: any) {
  const response = await client(`/message`, { headers: { Authorization: `Bearer ${token}` }, method: 'POST', data })
  return response
}

export function useGetUserChats() {
  const [cookieValue] = useCookie('uni_user_token')
  const state = useQuery({
    queryKey: ['userChats'],
    queryFn: () => getUserChats(cookieValue),
    enabled: !!cookieValue,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}
export function useGetUserFollowingAndFollowers(name: string) {
  const [cookieValue] = useCookie('uni_user_token')
  const state = useQuery({
    queryKey: ['userFollowingAndFollowers', name],
    queryFn: () => userFollowingAndFollowers(name, cookieValue),
    enabled: !!cookieValue,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export const useCreateUserChat = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => createUserChat(cookieValue, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userChats'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useCreateGroupChat = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => createGroupChat(cookieValue, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userChats'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useAcceptRequest = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => acceptRequest(cookieValue, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userChats'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useAcceptGroupRequest = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => acceptGroupRequest(cookieValue, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userChats'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

// Messages
export function useGetUserMessages(chatId: string) {
  const [cookieValue] = useCookie('uni_user_token')
  const state = useQuery({
    queryKey: ['chatMessages', chatId],
    queryFn: () => getChatMessages(cookieValue, chatId),
    enabled: !!cookieValue && !!chatId,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export const useCreateChatMessage = () => {
  const [cookieValue] = useCookie('uni_user_token')
  return useMutation({
    mutationFn: (data: any) => createChatMessage(cookieValue, data),
    onSuccess: () => {},
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
export const useUpdateMessageIsSeen = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  const chatData: ChatsArray = queryClient.getQueryData(['userChats']) || []

  return useMutation({
    mutationFn: ({ chatId, messageId, data }: { chatId: string; messageId: string; data: any }) => {
      return updateIsSeen(cookieValue, messageId, data).then((response) => ({ chatId, response }))
    },
    onSuccess: ({ chatId, response }: { chatId: string; response: any }) => {
      console.log(response)
      if (chatData) {
        const updatedChatData = chatData.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                latestMessage: response,
                unreadMessagesCount: 0,
              }
            : chat
        )
        queryClient.setQueryData(['userChats'], updatedChatData)
      }
      queryClient.invalidateQueries({ queryKey: ['message_notification'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useReactMessageEmoji = (chatId: string) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  const { socket } = useUniStore()
  return useMutation({
    mutationFn: ({ data }: { data: { messageId: string; emoji: string } }) => reactMessageEmoji(cookieValue, data),
    onSuccess: (response: any) => {
      const { _id, reactions } = response.message

      const chatData: messages = queryClient.getQueryData(['chatMessages', chatId]) || []

      if (chatData) {
        const messageIndex = chatData.findIndex((message) => message._id === _id)

        if (messageIndex !== -1) {
          const updatedMessages = [...chatData]
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            reactions: reactions,
          }
          queryClient.setQueryData(['chatMessages', chatId], updatedMessages)
          if (socket) {
            socket.emit(SocketEnums.REACTED_MESSAGE, response)
          }
        }
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
