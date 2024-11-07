'use client'
import Card from '@/components/atoms/Card'
import Tabs from '@/components/molecules/Tabs'
import FindPeople from '@/components/molecules/Tabs/FindPeople'
import Followers from '@/components/molecules/Tabs/Followers'
import Following from '@/components/molecules/Tabs/Following'
import { useUniStore } from '@/store/store'
import React, { useMemo, useRef } from 'react'

export default function ConnectionPage() {
  const { userProfileData } = useUniStore()

  const userFollowingIDs = useMemo(() => {
    return userProfileData?.following?.map((following: { userId: string }) => following.userId)
  }, [userProfileData])

  const userFollowerIDs = useMemo(() => {
    return userProfileData?.followers?.map((followers: { userId: string }) => followers.userId)
  }, [userProfileData])

  const tabs = [
    {
      label: 'Find People',
      content: <FindPeople />,
    },
    {
      label: `Following`,
      content: <Following userFollowingIDs={userFollowingIDs || []} />,
    },
    {
      label: `Follower`,
      content: <Followers userFollowingIDs={userFollowingIDs || []} />,
    },
  ]

  return (
    <div className="py-8 h-with-navbar">
      <Card className="rounded-2xl h-full overflow-hidden px-4">
        <Tabs tabs={tabs} className={'h-full'} />
      </Card>
    </div>
  )
}
