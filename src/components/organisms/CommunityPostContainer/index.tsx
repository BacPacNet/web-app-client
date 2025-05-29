'use client'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import PostCard from '@/components/molecules/PostCard'
import { communityPostType } from '@/types/Community'
import { PostType } from '@/types/constants'
import React, { useEffect, useMemo, useState } from 'react'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'
import PostSkeleton from '@/components/atoms/PostSkeleton'
import notMember from '@/assets/notMember.svg'
import { useGetCommunityPost } from '@/services/community-university'
import { AxiosError } from 'axios'
import EmptyStateCard from '@/components/molecules/EmptyStateCard'

type Props = {
  communityID?: string
  communityGroupID?: string
  containerRef?: React.RefObject<HTMLDivElement> | any
}
const CommunityPostsContainer = ({ communityID = '', communityGroupID = '', containerRef }: Props) => {
  const [showCommentSection, setShowCommentSection] = useState('')

  const {
    data: communityGroupPost,
    fetchNextPage: communityPostNextpage,
    isFetchingNextPage: communityPostIsFetchingNextPage,
    hasNextPage: communityPostHasNextPage,
    error: communityPostError,
    dataUpdatedAt,
    isLoading,
  } = useGetCommunityPost(communityID, true, 10)
  //  const [communityDatas, setCommunityDatas] = useState([])

  const communityDatas = communityGroupPost?.pages.flatMap((page) => page?.finalPost) || []

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

  //  useEffect(() => {
  //    const communityDatas: any = communityGroupPost?.pages.flatMap((page) => page?.finalPost)
  //    setCommunityDatas(communityDatas)
  //  }, [communityGroupPost, dataUpdatedAt])

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
        communityName={post.communityName}
        communityGroupName={post.communityGroupName}
      />
    ))
  }

  const PostCardRender = () => {
    if (isLoading) {
      return <PostSkeleton />
    }

    if (communityPostError && (communityPostError as AxiosError).response!.status === 401) {
      return (
        <EmptyStateCard
          imageSrc={notMember}
          title="You are not a member of this group"
          description="This group is for members only. Become a member to access exclusive content and discussions."
        />
      )
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
