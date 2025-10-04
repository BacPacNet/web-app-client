'use client'
import PostCard from '@/components/molecules/PostCard'
import notMember from '@/assets/notMember.svg'
import notPendingNoPostPlaceholder from '@/assets/onboading-placeholder.svg'
import PostSkeleton from '@/components/Timeline/PostSkeleton'
import { useGetCommunityGroupPost } from '@/services/community-university'
import { communityPostType } from '@/types/Community'
import { communityPostUpdateStatus, PostType } from '@/types/constants'
import { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import EmptyStateCard from '@/components/molecules/EmptyStateCard'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import noPostGroup from '@/assets/noPostGroup.svg'
import PendingPostCard from '@/components/molecules/PeningPostCard'
import { AllFiltersCommunityGroupPost, communityPostStatus } from '@/types/CommuityGroup'
import { useUniStore } from '@/store/store'
import { userTypeEnum } from '@/types/RegisterForm'

interface CommunityGroupPostContainerProps {
  containerRef: React.RefObject<HTMLDivElement>
  iscommunityGroups: boolean
  filterPostBy: string
  communityGroupAdminId: string
  setPendingPostCount: (value: number) => void
}

interface ImageCarouselState {
  isShow: boolean
  images: any[]
  currImageIndex: number | null
}

function CommunityGroupPostContainer({
  containerRef,
  iscommunityGroups,
  filterPostBy,
  communityGroupAdminId,
  setPendingPostCount,
}: CommunityGroupPostContainerProps) {
  const { communityId, groupId: communityGroupId }: { communityId: string; groupId: string } = useParams()
  const { userData } = useUniStore()
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
  } = useGetCommunityGroupPost(communityId, communityGroupId, iscommunityGroups, 10, filterPostBy)
  const communityGroupPendingPostCount = useMemo(
    () => communityGroupPost?.pages.flatMap((page) => page?.pendingTotal) || 0,
    [communityGroupPost?.pages]
  )

  const communityGroupPostData = useMemo(() => {
    return communityGroupPost?.pages?.flatMap((page) => page?.finalPost) ?? []
  }, [communityGroupPost])

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
    if (Array.isArray(communityGroupPendingPostCount) && communityGroupPendingPostCount[0] > 0) {
      setPendingPostCount(communityGroupPendingPostCount[0])
    } else {
      setPendingPostCount(0)
    }
  }, [communityGroupPendingPostCount])

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
    if (filterPostBy === Object.keys(AllFiltersCommunityGroupPost)[1]) {
      return communityGroupPostData.map((post: communityPostType, idx: number) => (
        <PendingPostCard
          key={post?._id}
          user={post?.user?.firstName + ' ' + post?.user?.lastName}
          adminId={post?.user?._id}
          university={post?.userProfile?.university_name}
          year={post?.userProfile?.study_year}
          text={post?.content}
          date={post?.createdAt}
          avatarLink={post?.userProfile?.profile_dp?.imageUrl}
          postID={post?._id}
          type={PostType.Community}
          images={post?.imageUrl}
          setImageCarasol={setImageCarousel}
          idx={idx}
          communityId={communityId}
          communityGroupId={communityGroupId}
          major={post?.userProfile?.major}
          affiliation={post?.userProfile?.affiliation}
          occupation={post?.userProfile?.occupation}
          isPostVerified={post?.isPostVerified}
          communityName={post?.communityName}
          communityGroupName={post?.communityGroupName}
          isCommunityAdmin={post?.userProfile?.isCommunityAdmin}
          communityGroupAdminId={communityGroupAdminId}
          postStatus={post?.postStatus as communityPostStatus}
          isPostLive={post?.isPostLive}
          role={post?.userProfile?.role as userTypeEnum}
        />
      ))
    } else {
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
          filterPostBy={filterPostBy}
        />
      ))
    }
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

  if (
    communityGroupPostData?.length === 0 &&
    filterPostBy === Object.keys(AllFiltersCommunityGroupPost)[1] &&
    communityGroupAdminId.toString() == userData?.id?.toString()
  ) {
    return (
      <EmptyStateCard
        imageWidth={320}
        imageHeight={169}
        imageSrc={notPendingNoPostPlaceholder}
        title="You are all done!"
        description="No pending posts requests at the moment."
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
    <div className="py-4 post-container">
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
