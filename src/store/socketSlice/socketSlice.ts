import { StateCreator } from 'zustand'
import { io, Socket } from 'socket.io-client'

type Notification = {
  message: string
}

type SocketState = {
  socket: Socket | null
  isConnected: boolean
  isRefetched: boolean
}

type SocketActions = {
  initializeSocket: (userId: string, refetchUserData: () => void, refetchNotification: () => void) => void
  disconnectSocket: () => void
  setIsRefetched: (value: boolean) => void
}

export type SocketSlice = SocketState & SocketActions

const initialState: SocketState = {
  socket: null,
  isConnected: false,
  isRefetched: false,
}

export const createSocketSlice: StateCreator<SocketSlice> = (set, get) => ({
  ...initialState,

  initializeSocket: (userId, refetchUserData, refetchNotification) => {
    const newSocket = io('http://localhost:9000')

    newSocket.on('connect', () => {
      console.log('Connected to the server')
      set({ socket: newSocket, isConnected: true })
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from the server')
      set({ socket: null, isConnected: false })
    })

    newSocket.on(`notification_${userId}`, (notification: Notification) => {
      if (notification.message === 'You have a been assigned') {
        refetchUserData()
        set({ isRefetched: true })
      }

      refetchNotification()
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

  setIsRefetched: (value: boolean) => set({ isRefetched: value }),
})
