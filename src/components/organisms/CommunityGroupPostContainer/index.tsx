'use client'
import PostCard from '@/components/molecules/PostCard'
import { Spinner } from '@/components/spinner/Spinner'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGetCommunityGroupPost } from '@/services/community-university'
import { communityPostType } from '@/types/Community'
import { PostType } from '@/types/constants'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

function CommunityGroupPostContainer({ containerRef }: { containerRef: any }) {
  const { communityId, groupId: communityGroupId }: { communityId: string; groupId: string } = useParams()
  const queryClient = useQueryClient()
  const [imageCarasol, setImageCarasol] = useState<{
    isShow: boolean
    images: any
    currImageIndex: number | null
  }>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })
  const [showCommentSection, setShowCommentSection] = useState('')

  const {
    data: communityGroupPost,
    fetchNextPage: communityPostNextpage,
    isFetchingNextPage: communityPostIsFetchingNextPage,
    hasNextPage: communityPostHasNextPage,
    isLoading,
    error,
    isFetching,
    dataUpdatedAt,
  } = useGetCommunityGroupPost(communityId, communityGroupId, true, 10)
  const [communityGroupPostDatas, setCommunityGroupPostDatas] = useState([])
  // const communityGroupPostData = communityGroupPost?.pages.flatMap((page) => page?.finalPost) || []

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
      setCommunityGroupPostDatas([])
    }
  }, [isFetching, queryClient])

  useEffect(() => {
    const communityDatas: any = communityGroupPost?.pages.flatMap((page) => page?.finalPost)
    setCommunityGroupPostDatas(communityDatas)
  }, [communityGroupPost, dataUpdatedAt])

  if (isLoading || isFetching)
    return (
      <div className="flex justify-center items-center py-10">
        <Spinner />
      </div>
    )

  if (error) {
    return <div className="text-center my-4 bg-white rounded-xl p-4">{(error as any)?.response?.data?.message || 'Something went wrong'}</div>
  }
  if (communityGroupPostDatas.length === 0 && !isFetching) return <div className="text-center my-4 bg-white rounded-xl p-4">No posts found</div>

  return (
    <div className="py-8 flex flex-col gap-6">
      {communityGroupPostDatas?.map((post: communityPostType, idx: number) => (
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
          communityId={communityId}
          communityGroupId={communityGroupId}
        />
      ))}
    </div>
  )
}

export default CommunityGroupPostContainer
