import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { Spinner } from '@/components/spinner/Spinner'
import UserListItem from '@/components/Timeline/UserListItem'
import { useGetUserMutuals } from '@/services/connection'
import { useUsersProfileForConnections } from '@/services/user'
import { useUniStore } from '@/store/store'
import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa6'
import { GoSearch } from 'react-icons/go'

export default function Mutuals() {
  const [name, setName] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const { userProfileData } = useUniStore()
  const {
    data: userProfilesData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
  } = useGetUserMutuals(name, userProfileData?.users_id || '', 10, true)

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
            major={item?.profile?.major || ''}
            occupation={item?.profile?.occupation || ''}
            imageUrl={item?.profile?.profile_dp?.imageUrl || ''}
            type={'FIND_PEOPLE'}
            isFollowing={item?.isFollowing}
            role={item.profile?.role || ''}
            affiliation={item.profile?.affiliation || ''}
          />
        ))}
      </>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-4 justify-between items-center mb-2 px-6 flex-shrink-0">
        <div className="w-full  px-3 py-2 border border-neutral-200 shadow-sm rounded-lg flex items-center gap-4 h-10">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            className="text-xs w-full outline-none text-neutral-400"
            placeholder="Searching Mutuals"
          />
          <GoSearch className="text-neutral-500" size={20} />
        </div>
        {/* <div
          onClick={openModal}
          className="cursor-pointer bg-[#F3F2FF] border border-[#E9E8FF] text-primary-500 h-10 w-10 flex items-center justify-center rounded-lg"
        >
          <FaFilter className="text-primary-500" />
        </div> */}
      </div>
      <div ref={ref} className="overflow-y-auto flex-1 custom-scrollbar px-2">
        {renderUserProfileList()}
      </div>
      {isFetchingNextPage && (
        <div className="text-center pt-2 flex-shrink-0">
          {' '}
          <Spinner />
        </div>
      )}
    </div>
  )
}
