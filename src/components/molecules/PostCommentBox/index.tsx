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

dayjs.extend(relativeTime)
type Props = {
  showCommentSec: boolean
  userComments: any
  postID: string
  type: PostType.Community | PostType.Timeline
  adminId: string
}

const PostCommentBox = ({ showCommentSec, userComments, postID, type, adminId }: Props) => {
  const { userData } = useUniStore()
  const { mutate: CreateGroupPostComment, isPending: CreateGroupPostCommentLoading } = useCreateGroupPostComment(
    type == PostType.Community ? true : false
  )
  const { mutate: likeGroupPostComment } = useLikeUnlikeGroupPostComment()
  const { mutate: CreateUserPostComment, isPending: CreateUserPostCommentLoading } = useCreateUserPostComment(
    type == PostType.Timeline ? true : false
  )
  const { mutate: likeUserPostComment } = useLikeUnlikeUserPostComment()
  const [comment, setComment] = useState('')
  const [ImageValue, setImageValue] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePostComment = async () => {
    if (comment.length <= 1) {
      return console.log('Please type something to comment!')
    }
    setIsLoading(true)
    if (ImageValue) {
      const imagedata: any = await replaceImage(ImageValue, '')

      const data: PostCommentData = {
        postID: postID,
        content: comment,
        imageUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId },
      }

      if (type === PostType.Timeline) {
        CreateUserPostComment(data)
      } else if (type === PostType.Community) {
        data.adminId = adminId
        CreateGroupPostComment(data)
      }
    } else {
      const data: PostCommentData = {
        postID: postID,
        content: comment,
      }

      if (type === PostType.Timeline) {
        CreateUserPostComment(data)
      } else if (type === PostType.Community) {
        data.adminId = adminId
        CreateGroupPostComment(data)
      }
    }
    setIsLoading(false)
    setImageValue(null)
    setComment('')
  }
  return (
    <div className={`${!showCommentSec ? 'h-0 overflow-y-hidden' : ''} xs:max-w-xs sm:max-w-max flex flex-col gap-2 `}>
      <div>
        <div className="w-11/12 border border-gray-light rounded-full py-2 pr-3 flex items-center">
          <input
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            type="text"
            placeholder="Add a comment..."
            className="flex-grow mx-1 sm:mx-4 p-1 border-none focus:outline-none w-full lg:min-w-[370px] xs:text-xs sm:text-sm"
          />

          {comment?.length > 1 && (
            <button onClick={() => handlePostComment()} className="text-white bg-primary px-3 my-[2px] sm:px-3 sm:py-2 rounded-full text-sm">
              {CreateGroupPostCommentLoading || CreateUserPostCommentLoading || isLoading ? <Spinner /> : <p>Post</p>}
            </button>
          )}
        </div>
      </div>
      {userComments?.map((comment: any) => (
        <div key={comment._id} className="my-4 xs:mr-4 sm:mr-0">
          {/* Comment Info */}
          <div className="flex gap-4">
            {comment?.commenterId?.profile_dp?.imageUrl ? (
              <img
                src={comment?.commenterId?.profile_dp?.imageUrl}
                alt={`${comment?.user}'s avatar`}
                width={14}
                height={14}
                className="rounded-full w-12 h-12 sm:w-14 sm:h-14"
              />
            ) : (
              <div className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-gray" />
            )}

            <div className="px-4 py-2 border border-gray rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-base text-gray-dark">{comment?.commenterId?.firstName}</p>
                  <p className="text-xs text-gray">{comment.createdAt && dayjs(new Date(comment?.createdAt).toString()).fromNow()}</p>
                </div>
                <SlOptions color="gray" />
              </div>
              {comment?.imageUrl?.imageUrl && <img className="w-full h-80 object-contain" src={comment?.imageUrl?.imageUrl} alt="" />}
              <p className="text-xs sm:text-sm pt-1 break-words lg:min-w-[450px] max-lg:min-w-[200px]">{comment?.content}</p>
            </div>
          </div>
          {/* Comment Actions */}
          <div className="flex justify-end mt-3 gap-10">
            <div className="flex items-center cursor-pointer">
              <AiOutlineLike color={comment?.likeCount?.some((like: any) => like.userId == userData?.id) ? '#6647FF' : ''} />
              <span className="mx-1 text-sm">{comment?.likeCount ? comment?.likeCount.length : 0}</span>
            </div>
            <div
              className="flex items-center cursor-pointer"
              //   onClick={() => {
              //     setModalContentType('ReplyModal')
              //     setIsModalOpen(true)
              //   }}
            >
              <HiReply size={20} className="text-gray-dark" />
              <span className="ml-2 text-sm">Reply</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PostCommentBox
