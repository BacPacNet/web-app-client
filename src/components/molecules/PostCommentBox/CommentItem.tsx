import React from 'react'
import UserCard from '@/components/atoms/UserCard'
import { AiOutlineLike } from 'react-icons/ai'
import { HiReply } from 'react-icons/hi'
import { FiMessageCircle, FiMoreHorizontal } from 'react-icons/fi'
import { format } from 'date-fns'
import PostCardImageGrid from '@/components/atoms/PostCardImagesGrid'
import avatar from '@assets/avatar.svg'
import { useDeleteUserPostComment } from '@/services/community-timeline'
import { PostType } from '@/types/constants'
import { useDeleteCommunityPostComment } from '@/services/community-university'
import CommentCardOption from '@/components/atoms/CommentCardOption'

const CommentItem = ({
  key,
  comment,
  currentUserId,
  postID,
  type,
  setImageCarasol,
  handleProfileClicked,
  likeHandler,
  toggleCommentSection,
  handleReplyClick,
  showReplies,
  childCommentsId,
}: any) => {
  const commenterId = comment?.commenterId?._id ? comment?.commenterId?._id : comment?.commenterId?.id

  const { mutate: deleteUserPost } = useDeleteUserPostComment()
  const { mutate: deleteCommunityPost } = useDeleteCommunityPostComment()

  const handleDelete = () => {
    if (type === PostType.Community) {
      deleteCommunityPost(comment._id)
    } else {
      deleteUserPost(comment._id)
    }
  }
  return (
    <div
      key={key}
      className={`w-auto h-full relative ${childCommentsId.includes(comment._id) ? 'ml-6' : 'w-full'} ${
        comment.level == 1 ? 'mt-4 ml-6 pr-6' : 'first:mt-8 '
      }`}
    >
      <div className="flex items-start gap-2 justify-between">
        <UserCard
          user={comment?.commenterId?.firstName + ' ' + comment?.commenterId?.lastName}
          university={comment?.commenterProfileId?.university_name}
          major={comment?.commenterProfileId?.major}
          year={comment?.commenterProfileId?.study_year}
          avatar={comment?.commenterProfileId?.profile_dp?.imageUrl || avatar}
          adminId={comment?.commenterId?._id}
          postID={postID}
          type={type}
          handleProfileClicked={handleProfileClicked}
          role={comment?.commenterProfileId?.role}
          affiliation={comment?.commenterProfileId?.affiliation}
          occupation={comment?.commenterProfileId?.occupation}
        />

        <div className="text-primary-500 text-sm md:text-md bg-surface-primary-50 rounded-full flex p-1">
          <CommentCardOption isSelfPost={commenterId === currentUserId} commentId={comment._id} isType={type} />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-b border-neutral-200">
        <p className="text-2xs sm:text-xs break-words lg:min-w-[450px]" dangerouslySetInnerHTML={{ __html: comment?.content }} />
        <PostCardImageGrid images={comment?.imageUrl} setImageCarasol={setImageCarasol} idx={0} type={type} isComment={true} />
        <p className="text-2xs text-neutral-500 font-normal">
          {comment?.createdAt ? format(new Date(comment.createdAt), 'h:mm a · MMM d, yyyy') : ''}
        </p>

        <div className="flex justify-start gap-8 text-sm text-neutral-500 border-t border-neutral-200 py-2">
          <div className="flex items-center cursor-pointer">
            <AiOutlineLike
              onClick={() => likeHandler(comment._id, comment.level.toString())}
              className={comment?.likeCount?.some((like: any) => like.userId === currentUserId) ? 'text-primary' : ''}
            />
            <span className="mx-1">{comment?.likeCount?.length || 0}</span>
          </div>

          {comment.level < 1 && (
            <span onClick={() => toggleCommentSection(comment)} className="flex items-center cursor-pointer">
              <FiMessageCircle className="mr-1 text-neutral-600" />
              {comment?.totalCount || comment?.replies?.length || 0}
            </span>
          )}

          {comment.level < 1 && (
            <div onClick={() => handleReplyClick(comment)} className="flex items-center cursor-pointer">
              <HiReply className="text-gray-dark" />
              <span className="ml-1 font-poppins text-xs">reply</span>
            </div>
          )}
        </div>
      </div>

      {/* Nest replies if available */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="w-full mt-6">
          {comment.replies.map((reply: any) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              {...{
                currentUserId,
                postID,
                type,
                setImageCarasol,
                handleProfileClicked,
                likeHandler,
                toggleCommentSection,
                handleReplyClick,
                showReplies: true,
                childCommentsId,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentItem
