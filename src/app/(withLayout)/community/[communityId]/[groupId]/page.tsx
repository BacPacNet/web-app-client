'use client'
import CommunityGroupBanner from '@/components/molecules/CommunityGroupBanner'
import CommunityCreatePost from '@/components/organisms/CommunityCreatePost'
import CommunityGroupPostContainer from '@/components/organisms/CommunityGroupPostContainer'
import { useGetCommunityGroup } from '@/services/community-university'
import { CommunityGroupType } from '@/types/CommuityGroup'
import { useRef, useState } from 'react'

// Types
interface PageParams {
  communityId: string
  groupId: string
}

export default function Page({ params: { communityId, groupId: communityGroupId } }: { params: PageParams }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isGroupAdmin, setIsGroupAdmin] = useState(false)
  const [isUserJoinedCommunityGroup, setIsUserJoinedCommunityGroup] = useState<boolean | null>(null)
  const { data: communityGroups, isLoading: isCommunityGroupsLoading, refetch } = useGetCommunityGroup(communityId, communityGroupId)

  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll hideScrollbar outline-none">
      <CommunityGroupBanner
        communityID={communityId}
        communityGroupID={communityGroupId}
        isGroupAdmin={isGroupAdmin}
        setIsGroupAdmin={setIsGroupAdmin}
        setIsUserJoinedCommunityGroup={setIsUserJoinedCommunityGroup}
        isUserJoinedCommunityGroup={isUserJoinedCommunityGroup}
        communityGroups={communityGroups as CommunityGroupType}
        isCommunityGroupsLoading={isCommunityGroupsLoading}
        refetch={refetch}
      />

      {(isUserJoinedCommunityGroup || isGroupAdmin) && <CommunityCreatePost communityId={communityId} communityGroupId={communityGroupId} />}
      {communityGroups && !isCommunityGroupsLoading && (
        <CommunityGroupPostContainer containerRef={containerRef} iscommunityGroups={!!communityGroups} />
      )}
    </div>
  )
}
