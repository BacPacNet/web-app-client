/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react'
import UserListItem from '../UserListItem'
import { useGetUserFollowing, useGetUserFollowers } from '@/services/connection'
import { useUniStore } from '@/store/store'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'

type props = {
  isChat?: boolean
  setIsCreateGroupModalOpen?: (value: boolean) => void
  setIsModalOpen?: (value: boolean) => void
  userId?: string
}
const ConnectionsModal = ({ isChat, setIsCreateGroupModalOpen, setIsModalOpen, userId = '' }: props) => {
  const [content, setContent] = useState<'Following' | 'Followers'>('Following')
  const { userProfileData } = useUniStore()
  const userFollowingIDs = userProfileData && userProfileData?.following?.map((following) => following.userId)
  const { data: userFollowData, isFetching: isFollowingLoading } = useGetUserFollowing('', userId, 10, content == 'Following')
  const { data: userFollowersData, isFetching: isFollowersLoading } = useGetUserFollowers('', userId, 10, content == 'Followers')

  const userFollow = userFollowData?.pages.flatMap((page) => page.users).filter((user) => user._id !== userProfileData?.users_id) || []
  const userFollowers = userFollowersData?.pages.flatMap((page) => page.users).filter((user) => user._id !== userProfileData?.users_id) || []

  return (
    <div>
      <div className="flex items-center justify-start cursor-pointer">
        <p
          className={`px-4 py-2 hover:text-primary text-sm ${content === 'Following' ? 'font-semibold' : 'font-medium'}`}
          onClickCapture={() => setContent('Following')}
        >
          Following
        </p>

        <p
          className={`px-4 py-2 hover:text-primary text-sm ${content === 'Followers' ? 'font-semibold' : 'font-medium'}`}
          onClickCapture={() => setContent('Followers')}
        >
          Followers
        </p>
        {isChat && setIsCreateGroupModalOpen && setIsModalOpen && (
          <p
            className={`px-4 py-2 hover:text-primary text-sm ${content === 'Followers' ? 'font-semibold' : 'font-medium'}`}
            onClick={() => (setIsCreateGroupModalOpen(true), setIsModalOpen(false))}
          >
            create group
          </p>
        )}
      </div>
      <div className="mx-auto min-w-[300px] bg-white rounded-lg overflow-hidden overflow-y-auto ">
        {content === 'Following' && isFollowingLoading ? (
          <>
            <UserListItemSkeleton />
            <UserListItemSkeleton />
            <UserListItemSkeleton />
          </>
        ) : content === 'Following' && !userFollow?.length ? (
          <p className="text-center p-4">You are not Following anyone.</p>
        ) : (
          content === 'Following' &&
          userFollow?.map((item, index: number) => (
            <UserListItem
              key={index}
              id={item?._id}
              firstName={item?.firstName}
              lastName={item?.lastName}
              university={item?.profile?.university_name || ''}
              study_year={item?.profile?.study_year || ''}
              degree={item?.profile?.degree || ''}
              major={item?.profile?.major || ''}
              occupation={item?.profile?.occupation || ''}
              imageUrl={item?.profile?.profile_dp?.imageUrl || ''}
              type={content}
              isChat={isChat}
              isFollowing={item?.isFollowing}
              role={item.profile?.role || ''}
              affiliation={item.profile?.affiliation || ''}
            />
          ))
        )}
        {content === 'Followers' && isFollowersLoading ? (
          <>
            <UserListItemSkeleton />
            <UserListItemSkeleton />
            <UserListItemSkeleton />
          </>
        ) : content === 'Followers' && !userFollowers?.length ? (
          <p className="text-center p-4">You have 0 Followers</p>
        ) : (
          content === 'Followers' &&
          userFollowers?.map((item, index: number) => (
            <UserListItem
              key={index}
              id={item?._id}
              firstName={item?.firstName}
              lastName={item?.lastName}
              university={item?.profile?.university_name || ''}
              study_year={item?.profile?.study_year || ''}
              degree={item?.profile?.degree || ''}
              major={item?.profile?.major || ''}
              occupation={item?.profile?.occupation || ''}
              imageUrl={item?.profile?.profile_dp?.imageUrl || ''}
              type={content}
              isChat={isChat}
              isFollowing={item.isFollowing}
              role={item.profile?.role || ''}
              affiliation={item.profile?.affiliation || ''}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default ConnectionsModal
