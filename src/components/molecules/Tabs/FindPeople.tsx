import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { Spinner } from '@/components/spinner/Spinner'
import UserListItem from '@/components/Timeline/UserListItem'
import { useUsersProfileForConnections } from '@/services/user'
import { useUniStore } from '@/store/store'
import React, { useEffect, useRef, useState } from 'react'
import { GoSearch } from 'react-icons/go'

export default function FindPeople() {
  const [name, setName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const { userProfileData } = useUniStore()
  const {
    data: userProfilesData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
  } = useUsersProfileForConnections(name, 10, true)

  const userProfiles = userProfilesData?.pages.flatMap((page) => page.users).filter((user) => user._id !== userProfileData?.users_id) || []

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

  const renderUserProfileList = () => {
    if (isUserProfilesLoading) {
      return (
        <>
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
        {userProfiles?.map((item, index: number) => (
          <UserListItem
            key={index}
            id={item?._id}
            firstName={item?.firstName}
            lastName={item?.lastName}
            university={item?.profile?.university || ''}
            study_year={item?.profile?.study_year || ''}
            degree={item?.profile?.degree || ''}
            role={item?.profile?.role || ''}
            affiliation={item?.profile?.affiliation || ''}
            major={item?.profile?.major || ''}
            occupation={item?.profile?.occupation || ''}
            imageUrl={item?.profile?.profile_dp?.imageUrl || ''}
            type={'FIND_PEOPLE'}
            isFollowing={item?.isFollowing}
          />
        ))}
      </>
    )
  }

  return (
    <>
      <div className="px-3 py-2 border border-border rounded-2xl flex items-center gap-4 mb-2">
        <GoSearch className="text-neutral-500" size={20} />
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
          className="text-xs w-full outline-none"
          placeholder="Search People"
        />
      </div>
      <div ref={ref} className="overflow-y-auto h-[85%] custom-scrollbar">
        {renderUserProfileList()}
      </div>
      {isFetchingNextPage && (
        <div className="text-center pt-2">
          {' '}
          <Spinner />
        </div>
      )}
    </>
  )
}
