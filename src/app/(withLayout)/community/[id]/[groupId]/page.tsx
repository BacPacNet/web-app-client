'use client'
import CommunityGroupBanner from '@/components/molecules/CommunityGroupBanner'
import EditCommunityGroupModal from '@/components/molecules/EditCommunityGroupModal'
import UniversityCard from '@/components/molecules/UniversityCard'
import CommunityGroupPostContainer from '@/components/organisms/CommunityGroupPostContainer'
import PostContainer from '@/components/organisms/PostsContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType, PostType } from '@/types/constants'
import { useRef, useState } from 'react'

export default function Page({ params }: { params: { id: string; groupId: string } }) {
  const { id: communityID, groupId: communityGroupID } = params
  const containerRef = useRef<HTMLDivElement>(null)
  const [isGroupAdmin, setIsGroupAdmin] = useState<boolean>(false)

  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll">
      <CommunityGroupBanner
        communityID={communityID}
        communityGroupID={communityGroupID}
        isGroupAdmin={isGroupAdmin}
        setIsGroupAdmin={setIsGroupAdmin}
      />
      {isGroupAdmin && <UserPostContainer communityID={communityID} communityGroupID={communityGroupID} type={PostInputType.Community} />}
      <CommunityGroupPostContainer containerRef={containerRef} />
    </div>
  )
}
