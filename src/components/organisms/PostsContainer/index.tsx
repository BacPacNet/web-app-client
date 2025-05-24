'use client'
import Loading from '@/app/register/loading'
import Card from '@/components/atoms/Card'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'
import PostCard from '@/components/molecules/PostCard'
import { useGetUserPosts } from '@/services/community-timeline'
import { communityPostType } from '@/types/Community'
import { PostType } from '@/types/constants'
import React, { useEffect, useState } from 'react'

type Props = {
  userId?: string
  containerRef?: React.RefObject<HTMLDivElement> | any
  source: string
}
const ProfilePostContainer = ({ userId = '', containerRef, source }: Props) => {
  const [showCommentSection, setShowCommentSection] = useState('')

  const { data: userSelfPostsData, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading, error, status } = useGetUserPosts(userId, 10)

  const userSelfPosts = userSelfPostsData?.pages.flatMap((page) => page?.data) || []

  const [imageCarasol, setImageCarasol] = useState<{
    isShow: boolean
    images: any
    currImageIndex: number | null
  }>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current
        const bottom = scrollTop + clientHeight >= scrollHeight - 10

        if (bottom && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }
    }

    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [hasNextPage, isFetchingNextPage, userSelfPostsData])

  useEffect(() => {
    if (imageCarasol.isShow) {
      openImageModal(<PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} messageImage={true} />)
    }
  }, [imageCarasol])

  const renderPostWithRespectToPathName = () => {
    if (userSelfPosts?.length === 0) return <Card className="rounded-2xl px-4 text-center text-xs">No Post Available</Card>
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
        images={post?.imageUrl}
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
      />
    ))
  }

  const PostCardRender = () => {
    if (isLoading) {
      return (
        <div>
          <Loading />
        </div>
      )
    }

    if (error) return <div>{error.message || 'Error loading posts'}</div>

    return renderPostWithRespectToPathName()
  }

  return (
    <div className="py-8 post-container">
      <div className="flex flex-col gap-6">
        <PostCardRender />
      </div>
    </div>
  )
}

export default ProfilePostContainer
