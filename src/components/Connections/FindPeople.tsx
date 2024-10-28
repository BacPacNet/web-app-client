'use client'
import React, { useState } from 'react'
import UserListItem from '../Timeline/UserListItem'
import { GoSearch } from 'react-icons/go'
import { cn } from '@/lib/utils'
import { useGetAllUserWithProfileData, useGetUserFollow, useGetUserFollowers } from '@/services/connection'
import UserListItemSkeleton from './UserListItemSkeleton'
import { useUniStore } from '@/store/store'
import { FindUsers, FollowingItemProps } from '@/types/constants'
import { useUsersProfileForConnections } from '@/services/user'

type ContentType = 'Find People' | 'Following' | 'Followers'

interface TabButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
}
interface Tab {
  label: string
  value: ContentType
}
interface Filter {
  label: string
  value: string
  options: {
    label: string
    value: string
  }[]
}

const tabs: Tab[] = [
  { label: 'Find People', value: 'Find People' },
  { label: 'Following', value: 'Following' },
  { label: 'Followers', value: 'Followers' },
]
const filters: Filter[] = [
  {
    label: 'Year',
    value: 'year',
    options: [{ label: '2021`', value: '2021' }],
  },
  {
    label: 'Degree',
    value: 'degree',
    options: [{ label: 'BTech', value: 'btech' }],
  },
  {
    label: 'Major',
    value: 'major',
    options: [{ label: 'CS', value: 'cs' }],
  },
  {
    label: 'Occupation',
    value: 'occupation',
    options: [{ label: 'Student', value: 'student' }],
  },
  {
    label: 'Affilation',
    value: 'affilation',
    options: [{ label: 'Most Recent', value: 'recent' }],
  },
]

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button className={`px-4 py-[10px] hover:text-primary text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-1'}`} onClick={onClick}>
    {label}
  </button>
)

const FindPeople = ({ contentDivStyle }: { contentDivStyle?: string }) => {
  const [content, setContent] = useState<ContentType>('Find People')
  const [name, setName] = useState('')
  const { userProfileData } = useUniStore()
  const [page, setPage] = useState(0)
  const { data: userProfilesData } = useUsersProfileForConnections(name, page, false)

  const userFollowingIDs = userProfileData && userProfileData?.following?.map((following) => following.userId)
  const { data: allUserData, isFetching } = useGetAllUserWithProfileData(name, content == 'Find People')
  const { data: userFollow, isFetching: isFollowingLoading } = useGetUserFollow(name, content == 'Following')
  const { data: userFollowers, isFetching: isFollowersLoading } = useGetUserFollowers(name, content == 'Followers')

  return (
    <div className="border border-border rounded-lg py-4 px-0 md:px-6">
      {/* Controls */}
      <div>
        <div className="flex items-center justify-start cursor-pointer">
          {tabs.map((tab) => (
            <TabButton key={tab.value} label={tab.label} isActive={content === tab.value} onClick={() => setContent(tab.value)} />
          ))}
        </div>
        <div className="flex gap-3 my-3 px-3 flex-wrap">
          {filters.map((filter) => (
            <div key={filter.value} className="flex items-center px-3 py-2 border border-primary rounded-full">
              <span className="text-xs text-primary font-medium">{filter.label}</span>
            </div>
          ))}
        </div>
        <div className="mx-3 px-5 py-[10px] border border-border rounded-full flex items-center gap-4">
          <GoSearch size={24} />
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            className="text-sm w-full outline-none"
            placeholder="Search People"
          />
        </div>
      </div>
      <div className={cn('mx-auto bg-white rounded-lg overflow-hidden overflow-y-auto custom-scrollbar', contentDivStyle)}>
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
          userFollow?.profile?.map((item: FollowingItemProps) => (
            <UserListItem
              key={item?.users_id?.id}
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
              userFollowingIDs={userFollowingIDs || []}
            />
          ))
        )}
        {content === 'Followers' && isFollowersLoading ? (
          <>
            <UserListItemSkeleton />
            <UserListItemSkeleton />
            <UserListItemSkeleton />
          </>
        ) : content === 'Followers' && !userFollowers?.profile?.length ? (
          <p className="text-center p-4">You have 0 Followers</p>
        ) : (
          content === 'Followers' &&
          userFollowers?.profile?.map((item: FollowingItemProps, index: number) => (
            <UserListItem
              key={'Followers' + index}
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
              userFollowingIDs={userFollowingIDs || []}
            />
          ))
        )}
        {/* For testing Purposes */}
        {content === 'Find People' && isFetching ? (
          <>
            <UserListItemSkeleton />
            <UserListItemSkeleton />
            <UserListItemSkeleton />
          </>
        ) : content === 'Find People' && !allUserData?.user?.length ? (
          <p className="text-center p-4">No data!</p>
        ) : (
          content === 'Find People' &&
          allUserData?.user?.map((item: FindUsers, index: number) => (
            <UserListItem
              key={index}
              id={item?._id}
              firstName={item?.firstName}
              lastName={item?.lastName}
              university={item?.profile?.university}
              study_year={item?.profile?.study_year}
              degree={item?.profile?.degree}
              major={item?.profile?.major}
              occupation={item?.profile?.occupation}
              imageUrl={item?.profile?.profile_dp?.imageUrl}
              type={content}
              userFollowingIDs={userFollowingIDs || []}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default FindPeople
