'use client'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import PostCard from '@/components/molecules/PostCard'
import { communityPostType } from '@/types/Community'
import { PostType } from '@/types/constants'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'
import notMember from '@/assets/notCommunityMember.svg'
import { useGetCommunityPost } from '@/services/community-university'
import { AxiosError } from 'axios'
import EmptyStateCard from '@/components/molecules/EmptyStateCard'
import PostSkeleton from '@/components/Timeline/PostSkeleton'

type Props = {
  communityID?: string
  communityGroupID?: string
  containerRef?: React.RefObject<HTMLDivElement> | any
  isCommunityData?: boolean
}

const CommunityPostsContainer = ({ communityID = '', communityGroupID = '', containerRef, isCommunityData }: Props) => {
  const [showCommentSection, setShowCommentSection] = useState('')

  const isEnabled = !!communityID && !!isCommunityData
  const {
    data: communityGroupPost,
    fetchNextPage: communityPostNextpage,
    isFetchingNextPage: communityPostIsFetchingNextPage,
    hasNextPage: communityPostHasNextPage,
    error: communityPostError,
    isLoading,
  } = useGetCommunityPost(communityID, isEnabled, 10)

  // Memoize flattened posts data
  const communityDatas = useMemo(() => communityGroupPost?.pages.flatMap((page) => page?.finalPost) || [], [communityGroupPost?.pages])

  const [imageCarasol, setImageCarasol] = useState<{
    isShow: boolean
    images: any
    currImageIndex: number | null
  }>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })

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
    return communityDatas?.map((post: communityPostType, idx: number) => (
      <PostCard
        key={post?._id}
        user={post?.user?.firstName + ' ' + post?.user?.lastName}
        adminId={post?.user?._id}
        university={post?.userProfile?.university_name}
        year={post?.userProfile?.study_year}
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
        communityId={communityID}
        communityGroupId={communityGroupID}
        major={post?.userProfile?.major}
        affiliation={post?.userProfile?.affiliation}
        occupation={post?.userProfile?.occupation}
        role={post?.userProfile?.role}
        communityName={post.communityName}
        communityGroupName={post.communityGroupName}
        isCommunityAdmin={post?.userProfile?.isCommunityAdmin}
      />
    ))
  }, [communityDatas, showCommentSection, communityID, communityGroupID])

  if (isLoading && !communityPostIsFetchingNextPage) {
    return (
      <div className="space-y-6">
        <PostSkeleton count={3} />
      </div>
    )
  }

  if (communityPostError && (communityPostError as AxiosError).response?.status === 401) {
    return (
      <EmptyStateCard
        imageWidth={320}
        imageHeight={171}
        imageSrc={notMember}
        title="Join University Community"
        description="Join this community to access its groups and connect with fellow university members"
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

export default CommunityPostsContainer
