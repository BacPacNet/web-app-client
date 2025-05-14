'use client'
import React, { useEffect, useRef } from 'react'
import { useGetUserNotification, useMarkAllNotificationAsRead } from '@/services/notification'

import NotificationCard from '@/components/Notification/NotificationCard'
import Buttons from '@/components/atoms/Buttons'

export const notificationRoleAccess = {
  GROUP_INVITE: 'GROUP_INVITE',
  FOLLOW: 'FOLLOW',
  COMMENT: 'COMMENT',
  COMMUNITY_COMMENT: 'COMMUNITY_COMMENT',
  REACTED_TO_POST: 'REACTED_TO_POST',
  REACTED_TO_COMMUNITY_POST: 'REACTED_TO_COMMUNITY_POST',

  OFFICIAL_GROUP_REQUEST: 'OFFICIAL_GROUP_REQUEST',
  PRIVATE_GROUP_REQUEST: 'PRIVATE_GROUP_REQUEST',
  REJECTED_OFFICIAL_GROUP_REQUEST: 'REJECTED_OFFICIAL_GROUP_REQUEST',
  ACCEPTED_OFFICIAL_GROUP_REQUEST: 'ACCEPTED_OFFICIAL_GROUP_REQUEST',
  ACCEPTED_PRIVATE_GROUP_REQUEST: 'ACCEPTED_PRIVATE_GROUP_REQUEST',
  REJECTED_PRIVATE_GROUP_REQUEST: 'REJECTED_PRIVATE_GROUP_REQUEST',
}

const NotificationTab = () => {
  const { data: notificationData, fetchNextPage, isFetchingNextPage, hasNextPage } = useGetUserNotification(10, true)
  const { mutate } = useMarkAllNotificationAsRead()
  const notifications = notificationData?.pages.flatMap((page) => page.notifications) || []

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current

        if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }
    }

    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  console.log('data', notifications)
  return (
    <div ref={containerRef} className="overflow-y-scroll custom-scrollbar flex flex-col h-[inherit] ">
      <div className="flex justify-between items-center">
        <h6 className="text-[20px] text-neutral-700 font-bold font-poppins p-4">Notifications</h6>
        <Buttons size="extra_small_paddind_2" onClick={() => mutate()}>
          Read All
        </Buttons>
      </div>
      {notifications?.map((item) => {
        return <NotificationCard key={item?._id} data={item} />
      })}
    </div>
  )
}

export default NotificationTab
