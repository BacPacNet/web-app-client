import React, { useState } from 'react'
import { AiOutlineLike } from 'react-icons/ai'
import { HiReply } from 'react-icons/hi'
import { SlOptions } from 'react-icons/sl'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useUniStore } from '@/store/store'
import { useCreateUserPostComment, useLikeUnlikeUserPostComment } from '@/services/community-timeline'
import { useCreateGroupPostComment, useLikeUnlikeGroupPostComment } from '@/services/community-university'
import { PostCommentData, PostType } from '@/types/constants'
import { replaceImage } from '@/services/uploadImage'
import { Spinner } from '@/components/spinner/Spinner'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { FaPlusCircle } from 'react-icons/fa'
import NewPostComment from '../NewPostComment'

dayjs.extend(relativeTime)
type Props = {
  showCommentSec: boolean
  userComments: any
  postID: string
  type: PostType.Community | PostType.Timeline
  adminId: string
  data: {
    user: string
    avatarLink: string
    date: string
    university: string
    year: string
    text: string
    type: PostType.Community | PostType.Timeline
    adminId: string
  }
}

const PostCommentBox = ({ showCommentSec, userComments, postID, type, adminId, data }: Props) => {
  const { userData, userProfileData } = useUniStore()

  const { mutate: likeGroupPostComment } = useLikeUnlikeGroupPostComment()
  const { mutate: likeUserPostComment } = useLikeUnlikeUserPostComment()

  const [newPost, setNewPost] = useState(false)

  const likePostCommentHandler = (commentId: string) => {
    if (type === PostType.Timeline) {
      likeUserPostComment(commentId)
    } else if (type === PostType.Community) {
      likeGroupPostComment(commentId)
    }
  }

  return (
    <div className={`${!showCommentSec ? 'h-0 overflow-y-hidden' : ''}  flex flex-col gap-2 px-4 w-full`}>
      <div>
        <div className="w-11/12  rounded-full py-2 pr-3 flex items-center">
          <Image
            src={userProfileData.cover_dp?.imageUrl || avatar}
            alt={`${userData?.firstName}'s avatar`}
            width={44}
            height={44}
            objectFit="cover"
            className="rounded-full w-12 h-12 sm:w-14 sm:h-14"
          />
          <button onClick={() => setNewPost(true)} className="border-2 border-primary py-2 px-3 text-xs rounded-lg flex items-center gap-3 ms-2">
            {' '}
            <span>
              <FaPlusCircle color="#6647ff" />
            </span>{' '}
            <span className="text-primary"> Add a comment</span>
          </button>
        </div>
      </div>
      <p className="text-xs text-neutral-400">
        <span className="text-neutral-900">Top Comment</span> / <span>Most Recent</span>
      </p>
      {userComments?.map((comment: any) => (
        <div key={comment._id} className="my-4 xs:mr-4 sm:mr-0 w-full">
          <div>
            <div className="flex  p-4 gap-4">
              <Image src={comment?.commenterId?.profile_dp?.imageUrl || avatar} width={56} height={56} className="rounded-full" alt="avatar.png" />
              <div>
                <h3 className="font-medium text-sm text-neutral-600">{comment?.commenterId?.firstName}</h3>
                <p className="text-[12px] text-neutral-500">{comment?.commenterId?.university_name}</p>
                <p className="text-[12px] text-neutral-500">{comment?.commenterId?.study_year + 'nd' + ' Yr ' + comment?.commenterId?.degree}</p>
              </div>
              <p className="ml-auto text-xs text-gray">
                {comment.createdAt && dayjs(new Date(comment?.createdAt).toString()).format('h:mm A · MMM D, YYYY')}
              </p>
            </div>
          </div>
          {/* Comment Info */}
          <div className="flex gap-4 px-[90px]">
            <p className="text-xs sm:text-sm pt-1 break-words lg:min-w-[450px] max-lg:min-w-[200px]">{comment?.content}</p>
            {/* </div> */}
          </div>
          {/* Comment Actions */}
          <div className="flex justify-start px-[90px] mt-3 gap-5 text-xs">
            <div className="flex items-center cursor-pointer">
              <AiOutlineLike
                onClick={() => likePostCommentHandler(comment._id)}
                color={comment?.likeCount?.some((like: any) => like.userId == userData?.id) ? '#6647FF' : ''}
              />
              <span className="mx-1 ">{comment?.likeCount ? comment?.likeCount.length : 0}</span>
            </div>
            <div className="flex items-center cursor-pointer">
              <HiReply className="text-gray-dark" />
              <span className="ml-2 ">Reply</span>
            </div>
          </div>
        </div>
      ))}
      {newPost && <NewPostComment setNewPost={setNewPost} data={data} postId={postID} />}
    </div>
  )
}

export default PostCommentBox
