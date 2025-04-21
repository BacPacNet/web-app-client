'use client'
import Loading from '@/app/register/loading'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import PostCard from '@/components/molecules/PostCard'
import { useGetCommunityGroupPost } from '@/services/community-university'
import { useUniStore } from '@/store/store'
import { communityPostType } from '@/types/Community'
import { PostType } from '@/types/constants'
import React, { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'
import PostSkeleton from '@/components/atoms/PostSkeleton'
import Card from '@/components/atoms/Card'

type Props = {
  communityID?: string
  communityGroupID?: string
  containerRef?: React.RefObject<HTMLDivElement> | any
}
const CommunityPostsContainer = ({ communityID = '', communityGroupID = '', containerRef }: Props) => {
  const queryClient = useQueryClient()
  const [showCommentSection, setShowCommentSection] = useState('')

  const {
    data: communityGroupPost,
    fetchNextPage: communityPostNextpage,
    isFetchingNextPage: communityPostIsFetchingNextPage,
    hasNextPage: communityPostHasNextPage,
    error: communityPostError,
    dataUpdatedAt,
    isFetching,
    isLoading,
  } = useGetCommunityGroupPost(communityID, communityGroupID, true, 10)
  const [communityDatas, setCommunityDatas] = useState([])

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

  useEffect(() => {
    if (isFetching) {
      setCommunityDatas([])
    }
  }, [isFetching, queryClient])

  useEffect(() => {
    const communityDatas: any = communityGroupPost?.pages.flatMap((page) => page?.finalPost)
    setCommunityDatas(communityDatas)
  }, [communityGroupPost, dataUpdatedAt])

  useEffect(() => {
    if (imageCarasol.isShow) {
      openImageModal(<PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} messageImage={true} />)
    }
  }, [imageCarasol])

  const renderPostWithRespectToPathName = () => {
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
      />
    ))
  }

  const PostCardRender = () => {
    if (isLoading) {
      return <PostSkeleton />
    }

    if (communityPostError) {
      return <Card className="px-4 rounded-lg text-center">{(communityPostError as any).response.data.message || 'Error loading posts'}</Card>
    }

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

export default CommunityPostsContainer
