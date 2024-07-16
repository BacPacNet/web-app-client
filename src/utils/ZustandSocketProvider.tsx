'use client'

import { useGetNotification } from '@/services/notification'
import { useGetUserData } from '@/services/user'
import { useUniStore } from '@/store/store'
import React, { useEffect } from 'react'

type ZustandSocketProviderProps = {
  children: React.ReactNode
}

const ZustandSocketProvider: React.FC<ZustandSocketProviderProps> = ({ children }) => {
  const initializeSocket = useUniStore((state: any) => state.initializeSocket)
  const disconnectSocket = useUniStore((state: any) => state.disconnectSocket)
  const { userData, isRefetched, setUserUnVerifiedCommunities, setUserVerifiedCommunities, setIsRefetched } = useUniStore()
  const { refetch: refetchNotification } = useGetNotification()
  const { refetch: refetchUserData, data: RefetcheduserData } = useGetUserData()

  useEffect(() => {
    if (userData.id) {
      initializeSocket(userData.id, refetchUserData, refetchNotification)
    }

    return () => {
      disconnectSocket()
    }
  }, [userData.id, initializeSocket, disconnectSocket, refetchNotification])

  useEffect(() => {
    if (isRefetched) {
      setUserUnVerifiedCommunities(RefetcheduserData?.user?.userUnVerifiedCommunities)
      setUserVerifiedCommunities(RefetcheduserData?.user?.userVerifiedCommunities)
      setIsRefetched(false)
    }
  }, [RefetcheduserData])

  return <>{children}</>
}

export default ZustandSocketProvider
