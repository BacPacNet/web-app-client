/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useRef, useState } from 'react'
import UserListItem from '../UserListItem'
import { useGetUserFollowing, useGetUserFollowers } from '@/services/connection'
import { useUniStore } from '@/store/store'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { Spinner } from '@/components/spinner/Spinner'

type Props = {
  isChat?: boolean
  setIsCreateGroupModalOpen?: (value: boolean) => void
  setIsModalOpen?: (value: boolean) => void
  userId?: string
  defaultTab?: 'Following' | 'Followers'
}

const ConnectionsModal = ({ isChat, setIsCreateGroupModalOpen, setIsModalOpen, defaultTab = 'Following', userId = '' }: Props) => {
  const [content, setContent] = useState<'Following' | 'Followers'>(defaultTab)
  const { userProfileData } = useUniStore()

  const {
    data: userFollowData,
    isLoading: isFollowingLoading,
    fetchNextPage: fetchNextFollowing,
    isFetchingNextPage: isFetchingFollowingNextPage,
    hasNextPage: hasFollowingNextPage,
  } = useGetUserFollowing('', userId, 10, content === 'Following')

  const {
    data: userFollowersData,
    isLoading: isFollowersLoading,
    fetchNextPage: fetchNextFollowers,
    isFetchingNextPage: isFetchingFollowersNextPage,
    hasNextPage: hasFollowersNextPage,
  } = useGetUserFollowers('', userId, 10, content === 'Followers')

  const userFollow = userFollowData?.pages.flatMap((page) => page.users).filter((user) => user._id !== userProfileData?.users_id) || []

  const userFollowers = userFollowersData?.pages.flatMap((page) => page.users).filter((user) => user._id !== userProfileData?.users_id) || []

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current

      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (content === 'Following' && hasFollowingNextPage && !isFetchingFollowingNextPage) {
          fetchNextFollowing()
        } else if (content === 'Followers' && hasFollowersNextPage && !isFetchingFollowersNextPage) {
          fetchNextFollowers()
        }
      }
    }

    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [
    content,
    hasFollowingNextPage,
    hasFollowersNextPage,
    isFetchingFollowingNextPage,
    isFetchingFollowersNextPage,
    fetchNextFollowing,
    fetchNextFollowers,
  ])

  const isLoading = content === 'Following' ? isFollowingLoading : isFollowersLoading
  const userList = content === 'Following' ? userFollow : userFollowers
  const isFetchingNextPage = content === 'Following' ? isFetchingFollowingNextPage : isFetchingFollowersNextPage

  return (
    <div>
      {/* Tab Selection */}
      <div className="flex items-center justify-start cursor-pointer">
        <p
          className={`px-4 py-2 hover:text-primary text-sm ${content === 'Following' ? 'font-semibold text-primary' : 'font-medium'}`}
          onClickCapture={() => setContent('Following')}
        >
          Following
        </p>
        <p
          className={`px-4 py-2 hover:text-primary text-sm ${content === 'Followers' ? 'font-semibold text-primary' : 'font-medium'}`}
          onClickCapture={() => setContent('Followers')}
        >
          Followers
        </p>
        {isChat && setIsCreateGroupModalOpen && setIsModalOpen && (
          <p
            className="px-4 py-2 hover:text-primary text-sm font-medium"
            onClick={() => {
              setIsCreateGroupModalOpen(true)
              setIsModalOpen(false)
            }}
          >
            create group
          </p>
        )}
      </div>

      <div className="mx-auto min-w-[300px] bg-white rounded-lg overflow-hidden">
        <div ref={containerRef} className="overflow-y-auto h-[60vh] custom-scrollbar">
          {isLoading ? (
            <>
              <UserListItemSkeleton />
              <UserListItemSkeleton />
              <UserListItemSkeleton />
            </>
          ) : userList.length === 0 ? (
            <p className="text-center p-4">{content === 'Following' ? 'You are not Following anyone.' : 'You have 0 Followers'}</p>
          ) : (
            <>
              {userList.map((item, index) => (
                <UserListItem
                  key={item._id || index}
                  id={item._id}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  university={item.profile?.university_name || ''}
                  study_year={item.profile?.study_year || ''}
                  degree={item.profile?.degree || ''}
                  major={item.profile?.major || ''}
                  occupation={item.profile?.occupation || ''}
                  imageUrl={item.profile?.profile_dp?.imageUrl || ''}
                  type={content}
                  isChat={isChat}
                  isFollowing={item.isFollowing}
                  role={item.profile?.role || ''}
                  affiliation={item.profile?.affiliation || ''}
                />
              ))}
              {isFetchingNextPage && <Spinner />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConnectionsModal
