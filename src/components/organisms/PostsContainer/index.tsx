'use client'
import Loading from '@/app/register/loading'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import PostCard from '@/components/molecules/PostCard'
import PostContainerPostTypeSelector from '@/components/molecules/PostContainerPostTypeSelector'
import { useGetTimelinePosts } from '@/services/community-timeline'
import { useGetCommunityGroupPost } from '@/services/community-university'
import { useUniStore } from '@/store/store'
import { PostType } from '@/types/constants'
import React, { useEffect, useMemo, useState } from 'react'

interface communityPostType {
  _id: string
  user: {
    firstName: string
    lastName: string
    _id: string
  }
  userProfile: {
    university_name: string
    study_year: string
    degree: string
    profile_dp: {
      imageUrl: string
    }
  }
  content: string
  createdAt: string
  likeCount: []
  comments: []
  imageUrl: []
  commentCount: number
}

type props = {
  communityID?: string
  communityGroupID?: string
  type: PostType.Community | PostType.Timeline
}
const PostContainer = ({ communityID = '', communityGroupID = '', type }: props) => {
  const { userData } = useUniStore()
  const {
    isLoading,
    data: TimelinePosts,
    error,
    fetchNextPage: timelinePostsNextpage,
    isFetchingNextPage: timelinePostIsFetchingNextPage,
    hasNextPage: timelinePostHasNextPage,
    isFetching: timelinePostIsFetching,
  } = useGetTimelinePosts(type == PostType.Timeline, 5)

  const timlineDatas = TimelinePosts?.pages.flatMap((page) => page?.allPosts) || []

  const [issJoined, setIsJoined] = useState(false)
  const [showCommentSection, setShowCommentSection] = useState('')
  const {
    data: communityGroupPost,
    fetchNextPage: communityPostNextpage,
    isFetchingNextPage: communityPostIsFetchingNextPage,
    hasNextPage: communityPostHasNextPage,
    isFetching: communityPostIsFetching,
  } = useGetCommunityGroupPost(communityID, communityGroupID, issJoined, type == PostType.Community, 2)
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

  const userVerifiedCommunityIds = useMemo(() => {
    return userData?.userVerifiedCommunities?.map((c) => c.communityId.toString()) || []
  }, [userData])

  const userUnverifiedVerifiedCommunityIds = useMemo(() => {
    return userData?.userUnVerifiedCommunities?.map((c) => c.communityId.toString()) || []
  }, [userData])

  const userVerifiedCommunityGroupIds = useMemo(() => {
    return userData?.userVerifiedCommunities?.flatMap((x) => x.communityGroups.map((y) => y.communityGroupId.toString())) || []
  }, [userData])

  const userUnverifiedVerifiedCommunityGroupIds = useMemo(() => {
    return userData?.userUnVerifiedCommunities?.flatMap((x) => x.communityGroups.map((y) => y.communityGroupId.toString())) || []
  }, [userData])

  useEffect(() => {
    if (communityID && !communityGroupID) {
      if (userVerifiedCommunityIds.includes(communityID) || userUnverifiedVerifiedCommunityIds.includes(communityID)) {
        setIsJoined(true)
      } else {
        setIsJoined(false)
      }
    }
    if (communityGroupID && communityID) {
      if (userVerifiedCommunityGroupIds.includes(communityGroupID) || userUnverifiedVerifiedCommunityGroupIds.includes(communityGroupID)) {
        setIsJoined(true)
      } else {
        setIsJoined(false)
      }
    }
  }, [
    communityID,
    communityGroupID,
    userVerifiedCommunityIds,
    userUnverifiedVerifiedCommunityIds,
    userUnverifiedVerifiedCommunityGroupIds,
    userVerifiedCommunityGroupIds,
  ])

  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10
      if (bottom && communityPostHasNextPage && !communityPostIsFetchingNextPage && type == PostType.Community) {
        communityPostNextpage()
      }
      if (bottom && timelinePostHasNextPage && !timelinePostIsFetchingNextPage && type == PostType.Timeline) {
        timelinePostsNextpage()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [
    communityPostHasNextPage,
    communityPostIsFetchingNextPage,
    communityPostNextpage,
    timelinePostHasNextPage,
    timelinePostIsFetchingNextPage,
    timelinePostsNextpage,
    type,
  ])

  const renderPostWithRespectToPathName = () => {
    switch (type) {
      case PostType.Timeline:
        return timlineDatas?.map((post: communityPostType, idx: number) => (
          <PostCard
            key={post._id}
            user={post?.user?.firstName + ' ' + post?.user?.lastName}
            adminId={post.user?._id}
            university={post?.userProfile?.university_name}
            year={post?.userProfile?.study_year + ' Yr. ' + ' ' + post?.userProfile?.degree}
            text={post?.content}
            date={post?.createdAt}
            avatarLink={post?.userProfile?.profile_dp?.imageUrl}
            commentCount={post?.commentCount}
            likes={post.likeCount}
            postID={post?._id}
            type={'communityId' in post ? PostType.Community : PostType.Timeline}
            images={post?.imageUrl || []}
            setImageCarasol={setImageCarasol}
            idx={idx}
            showCommentSection={showCommentSection}
            setShowCommentSection={setShowCommentSection}
          />
        ))
      case PostType.Community:
        return communityDatas?.map((post: communityPostType, idx: number) => (
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
      default:
        return <div>No valid path selected</div>
    }
  }

  const PostCardRender = () => {
    if (isLoading) {
      return (
        <div>
          <Loading />
        </div>
      )
    }

    if (error) {
      return <div>{error.message || 'Error loading posts'}</div>
    }

    return renderPostWithRespectToPathName()
  }

  return (
    <div className="py-8  overflow-y-scroll">
      {isLoading || timlineDatas?.length < 1 ? ' ' : communityPostIsFetching || communityDatas?.length < 1 ? ' ' : <PostContainerPostTypeSelector />}

      <div className="flex flex-col gap-6">{!issJoined && type !== PostType.Timeline ? '' : <PostCardRender />}</div>

      {imageCarasol.isShow && (
        <div className="relative h-screen w-full ">
          <div
            onClick={() =>
              setImageCarasol({
                isShow: false,
                images: [],
                currImageIndex: 0,
              })
            }
            className="bg-black w-full h-full fixed -top-0 -left-[0%] z-30 opacity-50"
          ></div>
          <PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} />
        </div>
      )}
    </div>
  )
}

export default PostContainer
