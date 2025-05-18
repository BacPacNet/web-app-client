import { useEffect, useState } from 'react'
import { SocketConnectionEnums } from '@/types/constants'

export function useOnlineUsers(socket: any, userIds: string[] = []) {
  const [onlineUsersSet, setOnlineUsersSet] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!socket) return

    const updateOnlineStatus = (onlineUsers: string[]) => {
      setOnlineUsersSet(new Set(onlineUsers))
    }

    const handleUserDisconnect = (disconnected: string[]) => {
      setOnlineUsersSet((prev) => {
        const updated = new Set(prev)
        disconnected.forEach((id) => updated.delete(id))
        return updated
      })
    }

    socket.emit('requestOnlineUsers', userIds)

    socket.on(SocketConnectionEnums.ONLINEUSERS, updateOnlineStatus)
    socket.on(SocketConnectionEnums.ONLINEUSERS2, updateOnlineStatus)
    socket.on(SocketConnectionEnums.USER_DISCONNECT, handleUserDisconnect)

    return () => {
      socket.off(SocketConnectionEnums.ONLINEUSERS, updateOnlineStatus)
      socket.off(SocketConnectionEnums.ONLINEUSERS2, updateOnlineStatus)
      socket.off(SocketConnectionEnums.USER_DISCONNECT, handleUserDisconnect)
    }
  }, [socket, userIds])

  return onlineUsersSet
}
