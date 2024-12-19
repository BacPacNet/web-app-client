'use client'
import Loading from '@/app/register/loading'
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
}
const ProfilePostContainer = ({ userId = '', containerRef }: Props) => {
  const [showCommentSection, setShowCommentSection] = useState('')

  const { data: userSelfPosts, isLoading, error } = useGetUserPosts(userId)

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
        //if (bottom && timelinePostHasNextPage && !timelinePostIsFetchingNextPage && type == PostType.Timeline) {
        //  timelinePostsNextpage()
        //}
      }
    }

    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (imageCarasol.isShow) {
      openImageModal(<PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} messageImage={true} />)
    }
  }, [imageCarasol])

  const renderPostWithRespectToPathName = () => {
    return userSelfPosts?.map((post: communityPostType, idx: number) => (
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
    <div className="py-8">
      <div className="flex flex-col gap-6">
        <PostCardRender />
      </div>
    </div>
  )
}

export default ProfilePostContainer
