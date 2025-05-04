'use client'
import CommunityGroupBanner from '@/components/molecules/CommunityGroupBanner'
import CommunityCreatePost from '@/components/organisms/CommunityCreatePost'
import CommunityGroupPostContainer from '@/components/organisms/CommunityGroupPostContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType, PostType } from '@/types/constants'
import { useRef, useState } from 'react'

export default function Page({ params }: { params: { communityId: string; groupId: string } }) {
  const { communityId, groupId: communityGroupID } = params
  const containerRef = useRef<HTMLDivElement>(null)
  const [isGroupAdmin, setIsGroupAdmin] = useState<boolean>(false)
  const [isUserJoinedCommunityGroup, setIsUserJoinedCommunityGroup] = useState<boolean | null>(null)

  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll">
      <CommunityGroupBanner
        communityID={communityId}
        communityGroupID={communityGroupID}
        isGroupAdmin={isGroupAdmin}
        setIsGroupAdmin={setIsGroupAdmin}
        setIsUserJoinedCommunityGroup={setIsUserJoinedCommunityGroup}
        isUserJoinedCommunityGroup={isUserJoinedCommunityGroup}
      />

      {/*{isUserJoinedCommunityGroup && (
        <UserPostContainer communityID={communityId} communityGroupID={communityGroupID} type={PostInputType.Community} />
      )}*/}
      {(isUserJoinedCommunityGroup || isGroupAdmin) && <CommunityCreatePost communityId={communityId} communityGroupId={communityGroupID} />}
      <CommunityGroupPostContainer containerRef={containerRef} />
    </div>
  )
}
