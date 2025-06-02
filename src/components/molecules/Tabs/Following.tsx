import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import UserListItem from '@/components/Timeline/UserListItem'
import { useGetUserFollowing } from '@/services/connection'
import { useUniStore } from '@/store/store'
import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa6'
import { GoSearch } from 'react-icons/go'

export default function Following() {
  const [name, setName] = useState('')
  const { userProfileData } = useUniStore()
  const ref = useRef<HTMLDivElement>(null)

  const {
    data: userFollowingData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isFollowingLoading,
  } = useGetUserFollowing(name, userProfileData?.users_id || '', 10, true)

  const userFollowing = userFollowingData?.pages.flatMap((page) => page.users).filter((user) => user._id !== userProfileData?.users_id) || []

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { scrollTop, scrollHeight, clientHeight } = ref.current

        if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }
    }

    const container = ref.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const renderUserFollowing = () => {
    if (isFollowingLoading) {
      return (
        <>
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
        </>
      )
    }
    return (
      <>
        {userFollowing?.map((userProfile, index: number) => (
          <UserListItem
            key={index}
            id={userProfile?._id}
            firstName={userProfile?.firstName}
            lastName={userProfile?.lastName}
            university={userProfile?.profile?.university || ''}
            study_year={userProfile?.profile?.study_year || ''}
            degree={userProfile?.profile?.degree || ''}
            major={userProfile?.profile?.major || ''}
            occupation={userProfile?.profile?.occupation || ''}
            imageUrl={userProfile?.profile?.profile_dp?.imageUrl || ''}
            type={'FOLLOWING'}
            isFollowing={userProfile?.isFollowing}
            role={userProfile.profile?.role || ''}
            affiliation={userProfile.profile?.affiliation || ''}
          />
        ))}
      </>
    )
  }

  return (
    <>
      <div className="flex gap-4 justify-between items-center mb-2 px-6">
        <div className="w-full px-3 py-2 border border-neutral-200 shadow-sm rounded-lg flex items-center gap-4  h-10">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            className="text-xs w-full outline-none text-neutral-400"
            placeholder="Searching Following"
          />
          <GoSearch className="text-neutral-500" size={20} />
        </div>
        {/* <div className="bg-[#F3F2FF] border border-[#E9E8FF] text-primary-500 h-10 w-10 flex items-center justify-center rounded-lg">
          <FaFilter className="text-primary-500" />
        </div> */}
      </div>
      <div ref={ref} className="overflow-y-auto h-[85%] px-2">
        {renderUserFollowing()}
      </div>
    </>
  )
}
