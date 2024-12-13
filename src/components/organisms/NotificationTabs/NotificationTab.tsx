'use client'
import StartedFollowingYouNotification from '@/components/Notifiaction/StartedFollowingYouNotification'

import ReactionToPostNotification from '@/components/Notifiaction/ReactionToPostNotification'
import React, { useEffect, useRef } from 'react'
import CommunityAndCommunityGroupJoinNotification from '@/components/Notifiaction/CommunityAndCommunityGroupJoinNotification'
import { useGetNotification, useGetUserNotification, useUpdateIsSeenCommunityGroupNotification } from '@/services/notification'

const NotificationTab = () => {
  const { data: notificationData, fetchNextPage, isFetchingNextPage, hasNextPage } = useGetUserNotification(5, true)
  const { mutate: updateIsSeen } = useUpdateIsSeenCommunityGroupNotification()

  const notifications = notificationData?.pages.flatMap((page) => page.notifications) || []

  const containerRef = useRef<HTMLDivElement>(null)

  // const handleIsSeenGroup = (id: string) => {
  //   const dataToPush = {
  //     id: id,
  //   }
  //   updateIsSeen(dataToPush)
  // }

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        console.log('yest')

        if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
          console.log('next')
        }
      }
    }

    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  console.log('noti', notifications)

  return (
    // <div className="flex flex-col  py-4 px-0  max-md:px-4 gap-10 ">
    <div ref={containerRef} className=" overflow-y-scroll custom-scrollbar flex flex-col  py-4 px-0  max-md:px-4 gap-10   h-[550px]">
      {notifications?.map((item) => {
        if (item.type == 'GROUP_INVITE') {
          return <CommunityAndCommunityGroupJoinNotification key={item?._id} data={item} />
        }
        if (item.type == 'FOLLOW') {
          return <StartedFollowingYouNotification key={item?._id} data={item} />
        }
      })}
      {/* <StartedFollowingYouNotification />
      <ReactionToPostNotification />
      <CommunityAndCommunityGroupJoinNotification />
      <CommunityAndCommunityGroupJoinNotification />
      <CommunityAndCommunityGroupJoinNotification /> */}

      {/* </div> */}
    </div>
  )
}

export default NotificationTab
