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
  user_id: {
    firstName: string
    lastName: string
    _id: string
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
}

type props = {
  communityID?: string
  communityGroupID?: string
  type: PostType.Community | PostType.Timeline
}
const PostContainer = ({ communityID = '', communityGroupID = '', type }: props) => {
  const { userData } = useUniStore()
  const { isLoading, data: TimelinePosts, error, isFetching } = useGetTimelinePosts(type == PostType.Timeline)

  const timelinePosts = TimelinePosts?.timelinePosts
  const [issJoined, setIsJoined] = useState(false)

  const {
    data: communityGroupPost,
    isFetching: communityGroupPostLoading,
    isError,
  } = useGetCommunityGroupPost(communityID, communityGroupID, issJoined, type == PostType.Community)

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

  const renderPostWithRespectToPathName = () => {
    switch (type) {
      case PostType.Timeline:
        return timelinePosts?.map((post: communityPostType, idx: number) => (
          <PostCard
            key={post._id}
            user={post?.user_id?.firstName + ' ' + post?.user_id?.lastName}
            adminId={post.user_id?._id}
            university={post?.user_id?.university_name}
            year={post?.user_id?.study_year + ' Yr. ' + ' ' + post?.user_id?.degree}
            text={post?.content}
            date={post?.createdAt}
            avatarLink={post?.user_id?.profile_dp?.imageUrl}
            comments={post?.comments}
            likes={post.likeCount}
            postID={post?._id}
            type={'communityId' in post ? PostType.Community : PostType.Timeline}
            images={post?.imageUrl || []}
            setImageCarasol={setImageCarasol}
            idx={idx}
          />
        ))
      case PostType.Community:
        return communityGroupPost?.communityPosts?.map((post: communityPostType, idx: number) => (
          <PostCard
            key={post._id}
            user={post?.user_id?.firstName + ' ' + post?.user_id?.lastName}
            adminId={post.user_id?._id}
            university={post?.user_id?.university_name}
            year={post?.user_id?.study_year + ' Yr. ' + ' ' + post?.user_id?.degree}
            text={post?.content}
            date={post?.createdAt}
            avatarLink={post?.user_id?.profile_dp?.imageUrl}
            comments={post?.comments}
            likes={post.likeCount}
            postID={post?._id}
            type={PostType.Community}
            images={post?.imageUrl}
            setImageCarasol={setImageCarasol}
            idx={idx}
          />
        ))
      default:
        return <div>No valid path selected</div>
    }
  }

  const PostCardRender = () => {
    if (isFetching) {
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
    <div className="py-10">
      {isFetching || timelinePosts?.length < 1 ? (
        ' '
      ) : communityGroupPostLoading || communityGroupPost?.communityPosts?.length < 1 ? (
        ' '
      ) : (
        <PostContainerPostTypeSelector />
      )}

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
