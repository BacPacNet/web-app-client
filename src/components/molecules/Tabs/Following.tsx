import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import UserListItem from '@/components/Timeline/UserListItem'
import { useGetUserFollowing } from '@/services/connection'
import { useUniStore } from '@/store/store'
import React, { useEffect, useRef, useState } from 'react'
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
      <div className="px-5 py-2 border border-border rounded-2xl flex items-center gap-4 mb-2">
        <GoSearch className="text-neutral-500" size={20} />
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
          className="text-sm w-full outline-none"
          placeholder="Search People"
        />
      </div>
      <div ref={ref} className="overflow-y-auto h-[85%]">
        {renderUserFollowing()}
      </div>
    </>
  )
}
