'use client'
import Loading from '@/components/atoms/Loading'
import PostCard from '@/components/molecules/PostCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetCommunityGroupPost } from '@/services/community-university'
import { communityPostType } from '@/types/Community'
import { PostType } from '@/types/constants'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

function CommunityGroupPostContainer({ containerRef }: { containerRef: any }) {
  const { id: communityId, groupId: communityGroupId }: { id: string; groupId: string } = useParams()
  const [imageCarasol, setImageCarasol] = useState<{
    isShow: boolean
    images: any
    currImageIndex: number | null
  }>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })
  const [showCommentSection, setShowCommentSection] = useState('')

  const {
    data: communityGroupPost,
    fetchNextPage: communityPostNextpage,
    isFetchingNextPage: communityPostIsFetchingNextPage,
    hasNextPage: communityPostHasNextPage,
    isLoading,
    error,
  } = useGetCommunityGroupPost(communityId, communityGroupId, true, true, 2)
  const CommunityGroupPost = communityGroupPost?.pages.flatMap((page) => page?.finalPost) || []

  console.log(communityGroupPost, 'communityGroupPost')

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        console.log(scrollTop, scrollHeight, clientHeight)
        const bottom = scrollTop + clientHeight >= scrollHeight - 10
        if (bottom && communityPostHasNextPage && !communityPostIsFetchingNextPage) {
          console.log('true')
          communityPostNextpage()
        }
      }
    }

    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [communityPostHasNextPage, communityPostIsFetchingNextPage, communityPostNextpage])

  if (isLoading) return <Skeleton className="w-full h-60 bg-slate-300 my-8" />

  if (error) {
    return <div>{error.message || 'Error loading posts'}</div>
  }

  return (
    <div className="py-8 flex flex-col gap-6">
      {CommunityGroupPost?.map((post: communityPostType, idx: number) => (
        <PostCard
          key={post?._id}
          user={post?.user?.firstName + ' ' + post?.user?.lastName}
          adminId={post?.user?._id}
          university={post?.userProfile?.university_name}
          year={post?.userProfile?.study_year + ' Yr. ' + ' ' + post?.userProfile?.degree}
          text={post?.content}
          date={post?.createdAt}
          avatarLink={post?.userProfile?.profile_dp?.imageUrl}
          commentCount={post?.commentCount}
          likes={post?.likeCount}
          postID={post?._id}
          type={PostType.Community}
          images={post?.imageUrl}
          setImageCarasol={setImageCarasol}
          idx={idx}
          showCommentSection={showCommentSection}
          setShowCommentSection={setShowCommentSection}
        />
      ))}
    </div>
  )
}

export default CommunityGroupPostContainer
