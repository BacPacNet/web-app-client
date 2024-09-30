'use client'
import Loading from '@/app/v2/register/loading'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import PostCard from '@/components/molecules/PostCard'
import PostContainerPostTypeSelector from '@/components/molecules/PostContainerPostTypeSelector'
import { useGetTimelinePosts } from '@/services/community-timeline'
import { useGetCommunityGroupPost } from '@/services/community-university'
import { useUniStore } from '@/store/store'
import { PostType } from '@/types/constants'
import { usePathname } from 'next/navigation'
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

const PostContainer = ({ currSelectedGroup }: any) => {
  const pathname = usePathname()

  const { userData } = useUniStore()
  const { isLoading, data: TimelinePosts, error, isFetching } = useGetTimelinePosts(pathname == '/timeline')
  const timelinePosts = TimelinePosts?.timelinePosts
  const [isJoinedInGroup, setIsJoinedInGroup] = useState(false)
  const {
    data: communityGroupPost,
    isFetching: communityGroupPostLoading,
    isError,
  } = useGetCommunityGroupPost(currSelectedGroup?._id, isJoinedInGroup, pathname == '/community')
  const [imageCarasol, setImageCarasol] = useState<{
    isShow: boolean
    images: any
    currImageIndex: number | null
  }>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })

  const userVerifiedCommunityGroupIds = useMemo(() => {
    return userData?.userVerifiedCommunities?.flatMap((x) => x.communityGroups.map((y) => y.communityGroupId.toString())) || []
  }, [userData])

  const userUnverifiedVerifiedCommunityGroupIds = useMemo(() => {
    return userData?.userUnVerifiedCommunities?.flatMap((x) => x.communityGroups.map((y) => y.communityGroupId.toString())) || []
  }, [userData])

  useEffect(() => {
    if (pathname) {
      const communityGroupId = currSelectedGroup?._id?.toString()
      if (userVerifiedCommunityGroupIds.includes(communityGroupId) || userUnverifiedVerifiedCommunityGroupIds.includes(communityGroupId)) {
        setIsJoinedInGroup(true)
      } else {
        setIsJoinedInGroup(false)
      }
    }
  }, [currSelectedGroup, userVerifiedCommunityGroupIds, userUnverifiedVerifiedCommunityGroupIds])

  const renderPostWithRespectToPathName = () => {
    switch (pathname) {
      case '/timeline':
        return timelinePosts?.map((post: communityPostType, idx: number) => (
          <PostCard
            key={post._id}
            user={post?.user_id?.firstName + ' ' + post?.user_id?.lastName}
            university={post?.user_id?.university_name}
            year={post?.user_id?.study_year + ' Yr. ' + ' ' + post?.user_id?.degree}
            text={post?.content}
            date={post?.createdAt}
            avatarLink={post?.user_id?.profile_dp?.imageUrl}
            comments={post?.comments}
            likes={post.likeCount}
            postID={post?._id}
            type={PostType.Timeline}
            images={post?.imageUrl || []}
            setImageCarasol={setImageCarasol}
            idx={idx}
          />
        ))
      case '/community':
        return communityGroupPost?.communityPosts?.map((post: communityPostType, idx: number) => (
          <PostCard
            key={post._id}
            user={post?.user_id?.firstName + ' ' + post?.user_id?.lastName}
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
      {!isFetching && timelinePosts?.length > 0 && <PostContainerPostTypeSelector />}

      <div className="flex flex-col gap-6">
        <PostCardRender />
      </div>

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
