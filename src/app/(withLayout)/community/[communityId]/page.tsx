'use client'
import UniversityCard from '@/components/molecules/UniversityCard'
import CommunityCreatePost from '@/components/organisms/CommunityCreatePost'
import CommunityPostsContainer from '@/components/organisms/CommunityPostContainer'
import { TRACK_EVENT } from '@/content/constant'
import { useTimeTracking } from '@/hooks/useTimeTracking'
import { useGetCommunity } from '@/services/community-university'
import { useRef, useState } from 'react'

export default function Page({ params }: { params: { communityId: string; groupId: string } }) {
  const { communityId, groupId: communityGroupId } = params
  const [isGroupAdmin, setIsGroupAdmin] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: communityData, isLoading: isCommunityLoading } = useGetCommunity(communityId)
  useTimeTracking(TRACK_EVENT.UNIVERSITY_COMMUNITY_PAGE_VIEW_DURATION, {
    communityId,
    communityName: communityData?.name,
  })

  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll hideScrollbar pt-4">
      <UniversityCard
        communityID={communityId}
        communityGroupID={communityGroupId}
        isGroupAdmin={isGroupAdmin}
        setIsGroupAdmin={setIsGroupAdmin}
        communityData={communityData}
        isCommunityLoading={isCommunityLoading}
      />
      {isGroupAdmin && <CommunityCreatePost communityId={communityId} communityGroupId={communityGroupId} />}
      {!isCommunityLoading && communityData && (
        <CommunityPostsContainer
          communityID={communityId}
          communityGroupID={communityGroupId}
          containerRef={containerRef}
          isCommunityData={!!communityData}
        />
      )}
    </div>
  )
}
