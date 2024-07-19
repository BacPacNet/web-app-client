/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react'
import UserListItem from '../UserListItem'
import { useGetUserFollow, useGetUserFollowers } from '@/services/connection'
import { useUniStore } from '@/store/store'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { FollowingItemProps } from '@/types/constants'

const ConnectionsModal = () => {
  const [content, setContent] = useState<'Following' | 'Followers'>('Following')
  const { userProfileData } = useUniStore()
  const userFollowingIDs = userProfileData.following.map((following) => following.userId)
  const { data: userFollow, isFetching: isFollowingLoading } = useGetUserFollow('', content == 'Following')
  const { data: userFollowers, isFetching: isFollowersLoading } = useGetUserFollowers('', content == 'Followers')

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
      </div>
      <div className="mx-auto min-w-[300px] bg-white rounded-lg shadow-md overflow-hidden overflow-y-auto ">
        {content === 'Following' && isFollowingLoading ? (
          <>
            <UserListItemSkeleton />
            <UserListItemSkeleton />
            <UserListItemSkeleton />
          </>
        ) : content === 'Following' && !userFollow?.profile?.length ? (
          <p className="text-center p-4">You are not Following anyone.</p>
        ) : (
          content === 'Following' &&
          userFollow?.profile?.map((item: FollowingItemProps, index: number) => (
            <UserListItem
              key={index}
              id={item?.users_id?.id}
              firstName={item?.users_id?.firstName}
              lastName={item?.users_id?.lastName}
              university={item?.university}
              study_year={item?.study_year}
              degree={item?.degree}
              major={item?.major}
              occupation={item?.occupation}
              imageUrl={item?.profile_dp?.imageUrl}
              type={content}
              userFollowingIDs={userFollowingIDs}
            />
          ))
        )}
        {content === 'Followers' && isFollowersLoading ? (
          <>
            <UserListItemSkeleton />
            <UserListItemSkeleton />
            <UserListItemSkeleton />
          </>
        ) : content === 'Followers' && !userFollow?.profile?.length ? (
          <p className="text-center p-4">You have 0 Followers</p>
        ) : (
          content === 'Followers' &&
          userFollowers?.profile?.map((item: FollowingItemProps, index: number) => (
            <UserListItem
              key={index}
              id={item?.users_id?.id}
              firstName={item?.users_id?.firstName}
              lastName={item?.users_id?.lastName}
              university={item?.university}
              study_year={item?.study_year}
              degree={item?.degree}
              major={item?.major}
              occupation={item?.occupation}
              imageUrl={item?.profile_dp?.imageUrl}
              type={content}
              userFollowingIDs={userFollowingIDs}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default ConnectionsModal
