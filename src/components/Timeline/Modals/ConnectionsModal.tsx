/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useRef, useState, useMemo } from 'react'
import UserListItem from '../UserListItem'
import { useGetUserFollowing, useGetUserFollowers } from '@/services/connection'
import { useUniStore } from '@/store/store'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { Spinner } from '@/components/spinner/Spinner'
import { usePathname } from 'next/navigation'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

type Props = {
  userId?: string
  defaultTab?: 'Following' | 'Followers'
}

type UserListRenderProps = {
  isLoading: boolean
  isFetchingNextPage: boolean
  userList: any[]
  isChat?: boolean
  content: 'Following' | 'Followers'
}

type TabType = 'Following' | 'Followers'

type TabsProps = {
  content: TabType
  setContent: (value: TabType) => void
}

const Tabs: React.FC<TabsProps> = ({ content, setContent }) => (
  <div className="flex items-center justify-start cursor-pointer">
    {(['Following', 'Followers'] as const).map((tab) => (
      <p
        key={tab}
        className={`px-4 py-2 hover:text-primary text-sm ${content === tab ? 'font-semibold text-primary' : 'font-medium'}`}
        onClickCapture={() => setContent(tab)}
      >
        {tab}
      </p>
    ))}
  </div>
)

const UserListRenderer: React.FC<UserListRenderProps> = ({ isLoading, userList, isFetchingNextPage, content }) => {
  const { userProfileData } = useUniStore()
  if (isLoading) return <UserListItemSkeleton count={7} />
  if (userList.length === 0) return <p className="text-center text-neutral-500 font-bold p-4">No User Found</p>

  return (
    <>
      {userList.map((item) => (
        <UserListItem
          key={item._id}
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
          isFollowing={item.isFollowing}
          role={item.profile?.role || ''}
          affiliation={item.profile?.affiliation || ''}
          isSelfProfile={userProfileData?.users_id === item._id}
        />
      ))}
      {isFetchingNextPage && <Spinner />}
    </>
  )
}

const ConnectionsModal = ({ defaultTab = 'Following', userId = '' }: Props) => {
  const [content, setContent] = useState<'Following' | 'Followers'>(defaultTab)
  const { userProfileData } = useUniStore()
  const pathName = usePathname()
  const currIdInPathName = useMemo(() => pathName.split('/')[2], [pathName])

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

  const containerRef = useRef<HTMLDivElement>(null)

  const userFollow = useMemo(() => {
    const followingIds = new Set(userProfileData?.following?.map((f) => f.userId))

    return (
      userFollowData?.pages.flatMap((page) =>
        page.users
          .filter((user) => (userProfileData?.users_id === currIdInPathName ? user._id !== userProfileData?.users_id : true))
          .map((user) => ({
            ...user,
            isFollowing: followingIds.has(user._id),
          }))
      ) || []
    )
  }, [userFollowData, userProfileData, currIdInPathName])

  const userFollowers = useMemo(() => {
    const followingIds = new Set(userProfileData?.following?.map((f) => f.userId))

    return (
      userFollowersData?.pages.flatMap((page) =>
        page.users
          .filter((user) => (userProfileData?.users_id === currIdInPathName ? user._id !== userProfileData?.users_id : true))
          .map((user) => ({
            ...user,
            isFollowing: followingIds.has(user._id),
          }))
      ) || []
    )
  }, [userFollowersData, userProfileData, currIdInPathName])

  useInfiniteScroll({
    containerRef,
    onBottomReach: () => {
      if (content === 'Following' && hasFollowingNextPage && !isFetchingFollowingNextPage) fetchNextFollowing()
      else if (content === 'Followers' && hasFollowersNextPage && !isFetchingFollowersNextPage) fetchNextFollowers()
    },
    deps: [content, hasFollowingNextPage, hasFollowersNextPage, isFetchingFollowingNextPage, isFetchingFollowersNextPage],
  })

  const isLoading = content === 'Following' ? isFollowingLoading : isFollowersLoading
  const userList = content === 'Following' ? userFollow : userFollowers
  const isFetchingNextPage = content === 'Following' ? isFetchingFollowingNextPage : isFetchingFollowersNextPage

  return (
    <div>
      <div className="flex items-center justify-start cursor-pointer">
        <Tabs content={content} setContent={setContent} />
      </div>

      <div className="mx-auto min-w-[300px] bg-white rounded-lg overflow-hidden">
        <div ref={containerRef} className="overflow-y-auto h-[60vh] custom-scrollbar">
          <UserListRenderer isLoading={isLoading} userList={userList} isFetchingNextPage={isFetchingNextPage} content={content} />
        </div>
      </div>
    </div>
  )
}

export default ConnectionsModal
