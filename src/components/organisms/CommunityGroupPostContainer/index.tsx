'use client'
import PostCard from '@/components/molecules/PostCard'
import notMember from '@/assets/notMember.svg'
import PostSkeleton from '@/components/Timeline/PostSkeleton'
import { useGetCommunityGroupPost } from '@/services/community-university'
import { communityPostType } from '@/types/Community'
import { PostType } from '@/types/constants'
import { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import EmptyStateCard from '@/components/molecules/EmptyStateCard'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import noPostGroup from '@/assets/noPostGroup.svg'

interface CommunityGroupPostContainerProps {
  containerRef: React.RefObject<HTMLDivElement>
  iscommunityGroups: boolean
}

interface ImageCarouselState {
  isShow: boolean
  images: any[]
  currImageIndex: number | null
}

function CommunityGroupPostContainer({ containerRef, iscommunityGroups }: CommunityGroupPostContainerProps) {
  const { communityId, groupId: communityGroupId }: { communityId: string; groupId: string } = useParams()
  const [imageCarasol, setImageCarousel] = useState<ImageCarouselState>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })
  const [showCommentSection, setShowCommentSection] = useState<string>('')

  const {
    data: communityGroupPost,
    fetchNextPage: communityPostNextpage,
    isFetchingNextPage: communityPostIsFetchingNextPage,
    hasNextPage: communityPostHasNextPage,
    isLoading,
    error,
  } = useGetCommunityGroupPost(communityId, communityGroupId, iscommunityGroups, 10)

  const communityGroupPostData = useMemo(() => communityGroupPost?.pages.flatMap((page) => page?.finalPost) || [], [communityGroupPost?.pages])

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const bottom = scrollTop + clientHeight >= scrollHeight - 10
      if (bottom && communityPostHasNextPage && !communityPostIsFetchingNextPage) {
        communityPostNextpage()
      }
    }
  }, [communityPostHasNextPage, communityPostIsFetchingNextPage, communityPostNextpage])

  useEffect(() => {
    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    if (imageCarasol.isShow) {
      openImageModal(<PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} messageImage={true} />)
    }
  }, [imageCarasol])

  const renderPostWithRespectToPathName = useCallback(() => {
    return communityGroupPostData.map((post: communityPostType, idx: number) => (
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
        setImageCarasol={setImageCarousel}
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
        isCommunityAdmin={post?.userProfile?.isCommunityAdmin}
      />
    ))
  }, [communityGroupPostData, showCommentSection, communityId, communityGroupId])

  if (isLoading && !communityPostIsFetchingNextPage) {
    return (
      <div className="space-y-6">
        <PostSkeleton count={3} />
      </div>
    )
  }

  if (error && (error as AxiosError).response?.status === 401) {
    return (
      <EmptyStateCard
        imageWidth={126}
        imageHeight={158}
        imageSrc={notMember}
        title="You are not a member of this group"
        description="This group is for members only. Become a member to access exclusive content and discussions."
      />
    )
  }

  if (communityGroupPostData?.length === 0) {
    return (
      <EmptyStateCard
        imageWidth={320}
        imageHeight={169}
        imageSrc={noPostGroup}
        title="No Posts from Group."
        description="No posts in this group yet. Once members start sharing, you’ll see them here."
      />
    )
  }

  return (
    <div className="py-8 post-container">
      <div className="flex flex-col gap-6">
        {renderPostWithRespectToPathName()}
        {communityPostIsFetchingNextPage && (
          <div className="space-y-6">
            <PostSkeleton count={2} />
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityGroupPostContainer
