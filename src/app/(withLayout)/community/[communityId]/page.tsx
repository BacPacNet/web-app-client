'use client'
import UniversityCard from '@/components/molecules/UniversityCard'
import CommunityCreatePost from '@/components/organisms/CommunityCreatePost'
import CommunityPostsContainer from '@/components/organisms/CommunityPostContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType, PostType } from '@/types/constants'
import { useRef, useState } from 'react'

export default function Page({ params }: { params: { communityId: string; groupId: string } }) {
  const { communityId, groupId: communityGroupID } = params
  const [isGroupAdmin, setIsGroupAdmin] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef} className="hideScrollbar h-with-navbar">
      <UniversityCard communityID={communityId} communityGroupID={communityGroupID} isGroupAdmin={isGroupAdmin} setIsGroupAdmin={setIsGroupAdmin} />
      {/*{isGroupAdmin && <UserPostContainer communityID={communityId} communityGroupID={communityGroupID} type={PostInputType.Community} />}*/}
      {isGroupAdmin && <CommunityCreatePost communityId={communityId} communityGroupId={communityGroupID} />}

      <CommunityPostsContainer communityID={communityId} communityGroupID={communityGroupID} containerRef={containerRef} />
    </div>
  )
}
