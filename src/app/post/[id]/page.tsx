'use client'
import PostCard from '@/components/molecules/PostCard'

import Spinner from '@/components/atoms/spinner'
import useCookie from '@/hooks/useCookie'
import { useGetPost } from '@/services/community-university'
import { PostType } from '@/types/constants'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import PostImageSlider from '@/components/atoms/PostImageSlider'

const SinglePost = () => {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const Type = searchParams.get('isType')
  const { data, isFetching, isPending, isError } = useGetPost(id, Type)
  const item = data?.post

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

  return (
    <div className="w-full   flex justify-center ">
      <div className="w-10/12 shadow-xl rounded-lg mt-10">
        <PostCard
          key={item?._id}
          user={item?.user_id?.firstName + ' ' + item?.user_id?.lastName}
          adminId={item?.user_id?._id}
          university={item?.profiles[0]?.university_name}
          year={item?.profiles[0]?.study_year + ' Yr. ' + ' ' + item?.profiles[0]?.degree}
          text={item?.content}
          date={item?.createdAt}
          avatarLink={item?.profiles[0]?.profile_dp?.imageUrl}
          commentCount={item?.comments}
          likes={item?.likeCount}
          postID={item?._id}
          type={String(Type) == 'Timeline' ? PostType.Timeline : PostType.Community}
          images={item?.imageUrl || []}
          setImageCarasol={setImageCarasol}
          idx={1}
          showCommentSection={showCommentSection}
          setShowCommentSection={setShowCommentSection}
        />
      </div>
      {imageCarasol.isShow && (
        <div className="fixed h-screen w-full mx-auto flex items-center justify-center ">
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

export default SinglePost
