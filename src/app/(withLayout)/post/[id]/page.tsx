'use client'
import PostCard from '@/components/molecules/PostCard'

import Spinner from '@/components/atoms/spinner'
import { useGetPost } from '@/services/community-university'
import { PostType } from '@/types/constants'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'

const SinglePost = () => {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const Type = searchParams.get('isType')
  const commentID = searchParams.get('commentId')
  const { data, isFetching, isPending, isError } = useGetPost(id, Type, commentID || ' ')
  const item = data?.post
  const comment = data?.comment

  const [showCommentSection, setShowCommentSection] = useState('')

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
    if (imageCarasol.isShow) {
      openImageModal(<PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} messageImage={true} />)
    }
  }, [imageCarasol])

  if (isError) {
    return <div className="h-screen flex justify-center items-center">Not Allowed</div>
  }

  if (isFetching || (!data?.post && !isError)) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Spinner />
      </div>
    )
  }

  const { _id, user, user_id, profile, content, createdAt, imageUrl, likeCount, commentCount, communityName, communityGroupName } = item
  return (
    <div className="w-full flex justify-center py-4 post-container">
      <div className="w-full shadow-card rounded-2xl">
        <PostCard
          key={_id}
          user={user?.firstName + ' ' + user?.lastName}
          adminId={user_id}
          university={profile?.university_name}
          year={profile?.study_year}
          text={content}
          date={createdAt}
          avatarLink={profile?.profile_dp?.imageUrl}
          commentCount={commentCount}
          likes={likeCount}
          postID={_id}
          type={String(Type) == 'Timeline' ? PostType.Timeline : PostType.Community}
          images={imageUrl || []}
          setImageCarasol={setImageCarasol}
          idx={1}
          showCommentSection={showCommentSection}
          setShowCommentSection={setShowCommentSection}
          major={profile?.major}
          affiliation={profile.affiliation}
          occupation={profile.occupation}
          role={profile.role}
          initialComment={comment}
          communityName={communityName}
          communityGroupName={communityGroupName}
        />
      </div>
    </div>
  )
}

export default SinglePost
