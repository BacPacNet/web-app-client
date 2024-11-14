'use client'
import UniversityCard from '@/components/molecules/UniversityCard'
import CommunityGroupPostContainer from '@/components/organisms/CommunityGroupPostContainer'
import PostContainer from '@/components/organisms/PostsContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType, PostType } from '@/types/constants'
import { useRef } from 'react'

export default function Page({ params }: { params: { id: string; groupId: string } }) {
  const { id: communityID, groupId: communityGroupID } = params
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll">
      <UniversityCard communityID={communityID} communityGroupID={communityGroupID} />
      <UserPostContainer communityID={communityID} communityGroupID={communityGroupID} type={PostInputType.Community} />
      <CommunityGroupPostContainer containerRef={containerRef} />
    </div>
  )
}
