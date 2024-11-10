'use client'
import UniversityCard from '@/components/molecules/UniversityCard'
import PostContainer from '@/components/organisms/PostsContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { useGetCommunity } from '@/services/community-university'
import { useUniStore } from '@/store/store'
import { Community } from '@/types/Community'
import { PostInputType, PostType } from '@/types/constants'
import { useMemo, useRef } from 'react'

export default function Page({ params }: { params: { id: string } }) {
  const communityID = params.id[0]
  const communityGroupID = params.id[1]
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll">
      <UniversityCard communityID={communityID} communityGroupID={communityGroupID} />
      <UserPostContainer communityID={communityID} communityGroupID={communityGroupID} type={PostInputType.Community} />
      <PostContainer communityID={communityID} communityGroupID={communityGroupID} type={PostType.Community} containerRef={containerRef} />
    </div>
  )
}
