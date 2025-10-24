'use client'
import Card from '@/components/atoms/Card'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'
import PostCard from '@/components/molecules/PostCard'
import PostSkeleton from '@/components/Timeline/PostSkeleton'
import { useGetUserPosts } from '@/services/community-timeline'
import { communityPostType } from '@/types/Community'
import { PostType } from '@/types/constants'
import React, { useEffect, useState, useCallback, useMemo } from 'react'

type Props = {
  userId?: string
  containerRef?: React.RefObject<HTMLDivElement> | any
  source: string
}

const ProfilePostContainer = ({ userId = '', containerRef, source }: Props) => {
  const [showCommentSection, setShowCommentSection] = useState('')

  const { data: userSelfPostsData, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading, error } = useGetUserPosts(userId, 10)

  // Memoize flattened posts data
  const userSelfPosts = useMemo(() => userSelfPostsData?.pages.flatMap((page) => page?.data) || [], [userSelfPostsData?.pages])

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

      if (bottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }
  }, [containerRef, hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef, handleScroll])

  useEffect(() => {
    if (imageCarasol.isShow) {
      openImageModal(<PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} messageImage={true} />)
    }
  }, [imageCarasol])

  const renderPostWithRespectToPathName = useCallback(() => {
    if (userSelfPosts?.length === 0) return <Card className="rounded-lg px-4 text-center text-xs">No Post Available</Card>
    return userSelfPosts?.map((post: communityPostType, idx: number) => (
      <PostCard
        key={post?._id}
        source={source}
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
        type={'communityId' in post ? PostType.Community : PostType.Timeline}
        images={post?.imageUrl || []}
        setImageCarasol={setImageCarasol}
        idx={idx}
        showCommentSection={showCommentSection}
        setShowCommentSection={setShowCommentSection}
        major={post?.userProfile?.major}
        affiliation={post?.userProfile?.affiliation}
        occupation={post?.userProfile?.occupation}
        role={post?.userProfile?.role}
        communityName={post.communityName}
        communityGroupName={post.communityGroupName}
        isCommunityAdmin={post?.userProfile?.isCommunityAdmin}
        communities={post?.userProfile?.communities}
      />
    ))
  }, [userSelfPosts, showCommentSection, source])

  if (isLoading && !isFetchingNextPage) {
    return <PostSkeleton count={3} />
  }

  if (error) {
    return <div className="p-4 text-red-500">{error.message || 'Error loading posts'}</div>
  }

  return (
    <div className="py-8 post-container">
      <div className="flex flex-col gap-6">
        {renderPostWithRespectToPathName()}
        {isFetchingNextPage && <PostSkeleton count={2} />}
      </div>
    </div>
  )
}

export default ProfilePostContainer
