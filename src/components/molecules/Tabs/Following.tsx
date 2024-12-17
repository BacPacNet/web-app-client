import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import UserListItem from '@/components/Timeline/UserListItem'
import { useGetUserFollow } from '@/services/connection'
import { useUniStore } from '@/store/store'
import React, { useState } from 'react'
import { GoSearch } from 'react-icons/go'

interface Props {
  userFollowingIDs: string[]
}

export default function Following({ userFollowingIDs }: Props) {
  const [name, setName] = useState('')
  const { userProfileData } = useUniStore()
  const { data: userFollowing, isFetching: isFollowingLoading } = useGetUserFollow(name, true, userProfileData?.users_id || '')

  const renderUserFollowing = () => {
    if (isFollowingLoading) {
      return (
        <>
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
        </>
      )
    }
    return (
      <>
        {userFollowing?.profile?.map((userProfile, index: number) => (
          <UserListItem
            key={index}
            id={userProfile?.users_id.id}
            firstName={userProfile?.users_id?.firstName}
            lastName={userProfile?.users_id?.lastName}
            university={userProfile?.university || ''}
            study_year={userProfile.study_year || ''}
            degree={userProfile.degree || ''}
            major={userProfile.major || ''}
            occupation={userProfile.occupation || ''}
            imageUrl={userProfile.profile_dp?.imageUrl || ''}
            userFollowingIDs={userFollowingIDs || []}
            type={'Find People'}
            isSelfProfile={userProfileData?.users_id === userProfile?.users_id?.id}
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
      <div className="overflow-y-auto h-[85%]">{renderUserFollowing()}</div>
    </>
  )
}
