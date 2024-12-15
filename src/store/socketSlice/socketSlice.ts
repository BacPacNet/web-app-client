import { StateCreator } from 'zustand'
import { io, Socket } from 'socket.io-client'
import { notificationRoleAccess } from '@/components/Navbar/constant'
import { SocketConnectionEnums } from '@/types/constants'

type Notification = {
  type: string
}

type SocketState = {
  socket: Socket | null
  isConnected: boolean
  type: string
}

type SocketActions = {
  initializeSocket: (
    userId: string,
    refetchUserData: () => void,
    refetchNotification: () => void,
    refetchUserProfileData: () => void,
    refetchMessageNotification: () => void,
    isRouteMessage: boolean
  ) => void

  disconnectSocket: () => void
  setIsRefetched: (value: string) => void
}

export type SocketSlice = SocketState & SocketActions

const initialState: SocketState = {
  socket: null,
  isConnected: false,
  type: '',
}

export const createSocketSlice: StateCreator<SocketSlice> = (set, get) => ({
  ...initialState,

  initializeSocket: (userId, refetchUserData, refetchNotification, refetchUserProfileData, refetchMessageNotification, isRouteMessage) => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000')

    newSocket.on('connect', () => {
      console.log('Connected to the server')
      newSocket.emit(SocketConnectionEnums.SETUP, userId)
      set({ socket: newSocket, isConnected: true })
    })

    newSocket.on(SocketConnectionEnums.DISCONNECT, () => {
      console.log('Disconnected from the server')
      set({ socket: null, isConnected: false })
    })

    newSocket.on(`notification_${userId}`, (notification: Notification) => {
      if (notification.type === notificationRoleAccess.ASSIGN) {
        refetchUserData()
        set({ type: notificationRoleAccess.ASSIGN })
      }
      if (notification.type === notificationRoleAccess.FOLLOW) {
        refetchUserProfileData()
        set({ type: notificationRoleAccess.FOLLOW })
      }

      refetchNotification()
    })

    newSocket.on(`message_notification_${userId}`, () => {
      if (isRouteMessage) {
        refetchMessageNotification()
      }
    })

    set({ socket: newSocket, isConnected: true })
  },

  disconnectSocket: () => {
    const socket = get().socket
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  setIsRefetched: (value: string) => set({ type: value }),
})
