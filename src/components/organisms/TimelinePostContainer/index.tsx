'use client'
import OnboardingPlaceholder from '@/components/atoms/OnboardingPlaceholder'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'
import PostCard from '@/components/molecules/PostCard'
import UserGuidelinesModal from '@/components/molecules/UserGuideLinesModal'
import GenericInfoModal from '@/components/molecules/VerifyUniversityToJoinModal/VerifyUniversityToJoinModal'
import PostSkeleton from '@/components/Timeline/PostSkeleton'
import { useModal } from '@/context/ModalContext'
import { useGetTimelinePosts } from '@/services/community-timeline'
import { useUniStore } from '@/store/store'
import { communityPostType } from '@/types/Community'
import { PostType } from '@/types/constants'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

type Props = {
  containerRef?: React.RefObject<HTMLDivElement> | any
}

const TimelinePostContainer = ({ containerRef }: Props) => {
  const {
    isLoading,
    data: TimelinePosts,
    error,
    fetchNextPage: timelinePostsNextpage,
    isFetchingNextPage: timelinePostIsFetchingNextPage,
    hasNextPage: timelinePostHasNextPage,
  } = useGetTimelinePosts(10)
  const { openModal } = useModal()
  const [showCommentSection, setShowCommentSection] = useState('')
  const [imageCarasol, setImageCarasol] = useState<{
    isShow: boolean
    images: any
    currImageIndex: number | null
  }>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })
  const { userData } = useUniStore()

  // Memoize flattened posts data
  const timlineDatas = useMemo(() => TimelinePosts?.pages.flatMap((page) => page?.allPosts) || null, [TimelinePosts?.pages])

  // Handle scroll for infinite loading
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const bottom = scrollTop + clientHeight >= scrollHeight - 10
      if (bottom && timelinePostHasNextPage && !timelinePostIsFetchingNextPage) {
        timelinePostsNextpage()
      }
    }
  }, [timelinePostHasNextPage, timelinePostIsFetchingNextPage, timelinePostsNextpage])

  useEffect(() => {
    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (imageCarasol.isShow) {
      openImageModal(<PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} messageImage={true} />)
    }
  }, [imageCarasol])

  const openNewUserModal = () => {
    openModal(<UserGuidelinesModal />, 'w-[350px] sm:w-[490px] hideScrollbar')
  }

  useEffect(() => {
    if (userData?.isNewUser) {
      openNewUserModal()
    }
  }, [userData?.isNewUser])

  // Memoize post rendering
  const renderPostWithRespectToPathName = useCallback(() => {
    return timlineDatas?.map((post: communityPostType, idx: number) => (
      <PostCard
        key={post._id}
        user={`${post?.user?.firstName} ${post?.user?.lastName}`}
        adminId={post.user?._id}
        university={post?.userProfile?.university_name}
        year={post?.userProfile?.study_year}
        major={post?.userProfile?.major}
        text={post?.content}
        date={post?.createdAt}
        avatarLink={post?.userProfile?.profile_dp?.imageUrl}
        commentCount={post?.commentCount}
        likes={post.likeCount}
        postID={post?._id}
        type={'community' in post ? PostType.Community : PostType.Timeline}
        images={post?.imageUrl || []}
        setImageCarasol={setImageCarasol}
        idx={idx}
        showCommentSection={showCommentSection}
        setShowCommentSection={setShowCommentSection}
        communityId={post?.communityId}
        isTimeline={true}
        affiliation={post?.userProfile?.affiliation}
        occupation={post?.userProfile?.occupation}
        role={post?.userProfile?.role}
        communityName={post.communityName}
        communityGroupName={post.communityGroupName}
        isPostVerified={post.isPostVerified}
        isCommunityAdmin={post?.userProfile?.isCommunityAdmin}
      />
    ))
  }, [timlineDatas, showCommentSection])

  if ((isLoading && !timelinePostIsFetchingNextPage) || timlineDatas === null) {
    return <PostSkeleton count={3} />
  }

  if (error) {
    return <div className="p-4 text-red-500">{error.message || 'Error loading posts'}</div>
  }

  if (timlineDatas.length === 0) {
    return <OnboardingPlaceholder />
  }

  return (
    <div className="py-8 post-container">
      <div className="flex flex-col gap-6">
        {renderPostWithRespectToPathName()}
        {timelinePostIsFetchingNextPage && <PostSkeleton count={2} />}
      </div>
    </div>
  )
}

export default TimelinePostContainer
