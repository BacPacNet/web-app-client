'use client'
import UniversityCard from '@/components/molecules/UniversityCard'
import CommunityCreatePost from '@/components/organisms/CommunityCreatePost'
import CommunityPostsContainer from '@/components/organisms/CommunityPostContainer'
import { useGetCommunity } from '@/services/community-university'
import { useRef, useState } from 'react'

export default function Page({ params }: { params: { communityId: string; groupId: string } }) {
  const { communityId, groupId: communityGroupId } = params
  const [isGroupAdmin, setIsGroupAdmin] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: communityData, isLoading: isCommunityLoading } = useGetCommunity(communityId)

  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll noi pt-4">
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
