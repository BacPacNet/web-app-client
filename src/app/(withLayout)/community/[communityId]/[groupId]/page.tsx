'use client'
import CommunityGroupBanner from '@/components/molecules/CommunityGroupBanner'
import CommunityGroupPostContainer from '@/components/organisms/CommunityGroupPostContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType, PostType } from '@/types/constants'
import { useRef, useState } from 'react'

export default function Page({ params }: { params: { communityId: string; groupId: string } }) {
  const { communityId, groupId: communityGroupID } = params
  const containerRef = useRef<HTMLDivElement>(null)
  const [isGroupAdmin, setIsGroupAdmin] = useState<boolean>(false)

  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll">
      <CommunityGroupBanner
        communityID={communityId}
        communityGroupID={communityGroupID}
        isGroupAdmin={isGroupAdmin}
        setIsGroupAdmin={setIsGroupAdmin}
      />
      {isGroupAdmin && <UserPostContainer communityID={communityId} communityGroupID={communityGroupID} type={PostInputType.Community} />}
      <CommunityGroupPostContainer containerRef={containerRef} />
    </div>
  )
}
