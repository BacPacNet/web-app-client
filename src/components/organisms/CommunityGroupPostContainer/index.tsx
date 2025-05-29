'use client'
import PostCard from '@/components/molecules/PostCard'
import notMember from '@/assets/notMember.svg'
import PostSkeleton from '@/components/Timeline/PostSkeleton'
import { useGetCommunityGroupPost } from '@/services/community-university'
import { communityPostType } from '@/types/Community'
import { PostType } from '@/types/constants'
import { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import EmptyStateCard from '@/components/molecules/EmptyStateCard'

function CommunityGroupPostContainer({ containerRef }: { containerRef: any }) {
  const { communityId, groupId: communityGroupId }: { communityId: string; groupId: string } = useParams()
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
    isFetching,
    //dataUpdatedAt,
  } = useGetCommunityGroupPost(communityId, communityGroupId, true, 10)

  const communityGroupPostData = useMemo(() => communityGroupPost?.pages.flatMap((page) => page?.finalPost) || null, [communityGroupPost?.pages])

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        const bottom = scrollTop + clientHeight >= scrollHeight - 10
        if (bottom && communityPostHasNextPage && !communityPostIsFetchingNextPage) {
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

  //  useEffect(() => {
  //    const communityDatas: any = communityGroupPost?.pages.flatMap((page) => page?.finalPost)
  //    setCommunityGroupPostDatas(communityDatas)
  //  }, [communityGroupPost, dataUpdatedAt])

  if ((isLoading && !communityPostIsFetchingNextPage) || communityGroupPost === null) {
    return <PostSkeleton count={3} />
  }

  if (error && (error as AxiosError).response!.status === 401) {
    return (
      <EmptyStateCard
        imageSrc={notMember}
        title="You are not a member of this group"
        description="This group is for members only. Become a member to access exclusive content and discussions."
      />
    )
  }
  if (communityGroupPostData?.length === 0) return <div className="text-center my-4 bg-white rounded-xl p-4">No posts found</div>

  return (
    <div className="py-8 flex flex-col gap-6 post-container">
      {communityGroupPostData?.map((post: communityPostType, idx: number) => (
        <PostCard
          key={post?._id}
          user={post?.user?.firstName + ' ' + post?.user?.lastName}
          adminId={post?.user?._id}
          university={post?.userProfile?.university_name}
          year={post?.userProfile?.study_year}
          text={post?.content}
          date={post?.createdAt}
          avatarLink={post?.userProfile?.profile_dp?.imageUrl}
          commentCount={post?.commentCount || 0}
          likes={post?.likeCount}
          postID={post?._id}
          type={PostType.Community}
          images={post?.imageUrl}
          setImageCarasol={setImageCarasol}
          idx={idx}
          showCommentSection={showCommentSection}
          setShowCommentSection={setShowCommentSection}
          communityId={communityId}
          communityGroupId={communityGroupId}
          major={post?.userProfile?.major}
          affiliation={post?.userProfile?.affiliation}
          occupation={post?.userProfile?.occupation}
          role={post?.userProfile?.role}
          isPostVerified={post?.isPostVerified}
          communityName={post?.communityName}
          communityGroupName={post?.communityGroupName}
        />
      ))}
    </div>
  )
}

export default CommunityGroupPostContainer
