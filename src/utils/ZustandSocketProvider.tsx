'use client'

import { notificationRoleAccess } from '@/components/Navbar/constant'
import { useGetNotification } from '@/services/notification'
import { useGetUserData } from '@/services/user'
import { useGetUserProfileData } from '@/services/userProfile'
import { useUniStore } from '@/store/store'
import React, { useEffect } from 'react'

type ZustandSocketProviderProps = {
  children: React.ReactNode
}

const ZustandSocketProvider: React.FC<ZustandSocketProviderProps> = ({ children }) => {
  const initializeSocket = useUniStore((state) => state.initializeSocket)
  const disconnectSocket = useUniStore((state) => state.disconnectSocket)
  const { userData, type, setUserUnVerifiedCommunities, setUserVerifiedCommunities, setUserFollowers, setIsRefetched } = useUniStore()
  const { refetch: refetchNotification } = useGetNotification()
  const { refetch: refetchUserData, data: RefetcheduserData, isSuccess: refectUserDataIsSuccess, isFetching } = useGetUserData(type)
  const {
    refetch: refetchUserProfileData,
    data: RefetcheduserProfileData,
    isSuccess: refectUserProfileDataIsSuccess,
    isFetching: userProfileRefething,
  } = useGetUserProfileData(type)

  useEffect(() => {
    if (userData.id) {
      initializeSocket(userData.id, refetchUserData, refetchNotification, refetchUserProfileData)
    }

    return () => {
      disconnectSocket()
    }
  }, [userData.id, initializeSocket, disconnectSocket, refetchNotification])

  useEffect(() => {
    if ((refectUserDataIsSuccess && !isFetching) || (refectUserProfileDataIsSuccess && !userProfileRefething)) {
      switch (type) {
        case notificationRoleAccess.ASSIGN:
          setUserUnVerifiedCommunities(RefetcheduserData?.user?.userUnVerifiedCommunities)
          setUserVerifiedCommunities(RefetcheduserData?.user?.userVerifiedCommunities)
          setIsRefetched('')
          break
        case notificationRoleAccess.FOLLOW:
          setUserFollowers(RefetcheduserProfileData?.profile?.followers)
          setIsRefetched('')
          break
        default:
          break
      }
    }
  }, [RefetcheduserData, RefetcheduserProfileData])

  return <>{children}</>
}

export default ZustandSocketProvider
