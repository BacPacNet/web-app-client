'use client'
import RewardsTimelineCard from '@/components/molecules/Rewards/rewardsTimelineCard'
import TimelineCreatePost from '@/components/organisms/TimelineCreatePost'
import TimelinePostContainer from '@/components/organisms/TimelinePostContainer'
import { useUniStore } from '@/store/store'
import React, { useRef } from 'react'

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { userEligibleForRewards } = useUniStore()
  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll hideScrollbar outline-none pt-4">
      {userEligibleForRewards?.eligible && <RewardsTimelineCard />}
      <TimelineCreatePost />
      <TimelinePostContainer containerRef={containerRef} />
    </div>
  )
}
