'use client'

import { notificationRoleAccess } from '@/components/Navbar/constant'
import { useGetMessageNotification, useGetNotification, useGetUserUnreadMessagesTotalCount } from '@/services/notification'
import { useGetUserData } from '@/services/user'
import { useGetUserProfileData } from '@/services/userProfile'
import { useUniStore } from '@/store/store'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

type ZustandSocketProviderProps = {
  children: React.ReactNode
}

const ZustandSocketProvider: React.FC<ZustandSocketProviderProps> = ({ children }) => {
  const initializeSocket = useUniStore((state) => state.initializeSocket)
  const disconnectSocket = useUniStore((state) => state.disconnectSocket)
  const { userData, type, setUserUnVerifiedCommunities, setUserVerifiedCommunities, setUserFollowers, setIsRefetched } = useUniStore()
  const { refetch: refetchNotification } = useGetNotification(3, true)
  const param = usePathname()
  //   const { refetch: refetchMessageNotification } = useGetMessageNotification(3, true)
  const { refetch: refetchMessageNotification } = useGetUserUnreadMessagesTotalCount()
  const { refetch: refetchUserData, data: RefetcheduserData, isSuccess: refectUserDataIsSuccess, isFetching } = useGetUserData(userData?.id as string)
  const {
    refetch: refetchUserProfileData,
    data: RefetcheduserProfileData,
    isSuccess: refectUserProfileDataIsSuccess,
    isFetching: userProfileRefething,
  } = useGetUserProfileData(type)

  useEffect(() => {
    if (userData?.id) {
      const routeSegment = param.split('/')[1]
      const isRouteMessage = routeSegment !== 'messages'
      initializeSocket(userData?.id, refetchUserData, refetchNotification, refetchUserProfileData, refetchMessageNotification, isRouteMessage)
    }

    // return () => {
    //   disconnectSocket()
    // }
    return () => {
      if (typeof disconnectSocket === 'function') {
        disconnectSocket()
      } else {
        console.warn('disconnectSocket is not defined or not a function')
      }
    }
  }, [userData?.id, initializeSocket, disconnectSocket, refetchNotification, param])

  useEffect(() => {
    if ((refectUserDataIsSuccess && !isFetching) || (refectUserProfileDataIsSuccess && !userProfileRefething)) {
      switch (type) {
        case notificationRoleAccess.ASSIGN:
          //  setUserUnVerifiedCommunities(RefetcheduserData?.user?.userUnVerifiedCommunities)
          //  setUserVerifiedCommunities(RefetcheduserData?.user?.userVerifiedCommunities)
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
