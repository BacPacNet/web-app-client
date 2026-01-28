import React from 'react'
import UserCard from '@/components/atoms/UserCard'
import { AiOutlineLike } from 'react-icons/ai'
import { HiReply } from 'react-icons/hi'
import { FiMessageCircle } from 'react-icons/fi'
import { format } from 'date-fns'
import PostCardImageGrid from '@/components/atoms/PostCardImagesGrid'
import avatar from '@assets/avatar.svg'
import CommentCardOption from '@/components/atoms/CommentCardOption'
import { motion } from 'framer-motion'
import PostCommunityHolder from '../PostCommunityHolder'
import { CommentItemProps } from '@/types/CommentPost'

const CommentItem = ({
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
  sortBy,
  communities,
  contentType,
  parentCommentId,
}: CommentItemProps) => {
  const commenterId = comment?.commenterId?._id ? comment?.commenterId?._id : comment?.commenterId?.id
  const [visibleReplyCount, setVisibleReplyCount] = React.useState(2)

  React.useEffect(() => {
    if (!showReplies) {
      setVisibleReplyCount(2)
    }
  }, [showReplies])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`w-auto h-full  relative ${childCommentsId.includes(comment._id) ? 'ml-6' : ''} ${
        comment.level == 1 ? 'mt-4 ml-6 ' : 'first:mt-8 '
      }`}
    >
      <div className="flex items-start gap-2 justify-between">
        <UserCard
          user={comment?.commenterId?.firstName + ' ' + comment?.commenterId?.lastName}
          university={comment?.commenterProfileId?.university_name || ''}
          major={comment?.commenterProfileId?.major}
          year={comment?.commenterProfileId?.study_year}
          avatar={comment?.commenterProfileId?.profile_dp?.imageUrl || avatar}
          adminId={comment?.commenterId?._id || comment?.commenterId?.id || ''}
          postID={postID}
          type={type}
          role={comment?.commenterProfileId?.role}
          handleProfileClicked={handleProfileClicked}
          affiliation={comment?.commenterProfileId?.affiliation}
          occupation={comment?.commenterProfileId?.occupation}
          isPost={true}
          isVerified={comment?.isCommentVerified}
          isCommunityAdmin={comment?.commenterProfileId?.isCommunityAdmin}
        />

        <div className="flex items-center gap-2">
          {communities?.length && communities?.length > 0 ? (
            <div className="flex items-center gap-2">
              {communities
                ?.slice()
                .sort((a: any, b: any) => {
                  const aIsAdmin = a?.isCommunityAdmin
                  const bIsAdmin = b?.isCommunityAdmin

                  const aIsVerified = a?.isVerifiedMember
                  const bIsVerified = b?.isVerifiedMember

                  if (aIsAdmin !== bIsAdmin) return aIsAdmin ? -1 : 1
                  if (aIsVerified !== bIsVerified) return aIsVerified ? -1 : 1

                  return 0
                })
                .map((community: any) => (
                  <PostCommunityHolder
                    key={community?._id}
                    logo={community?.logo}
                    name={community?.name}
                    isVerified={community?.isVerifiedMember}
                    isCommunityAdmin={community.isCommunityAdmin || false}
                  />
                ))}
            </div>
          ) : null}
          <div className="text-primary-500 text-sm md:text-md bg-surface-primary-50 rounded-full flex ">
            <CommentCardOption
              isSelfPost={commenterId?.toString() === currentUserId?.toString()}
              commentId={comment._id}
              isType={type}
              contentType={contentType}
              postID={postID}
              level={comment.level}
              parentCommentId={parentCommentId || ''}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2 border-b border-neutral-200">
        <p className="text-2xs sm:text-xs break-words " dangerouslySetInnerHTML={{ __html: comment?.content }} />
        {comment?.imageUrl && comment.imageUrl.length > 0 && (
          <PostCardImageGrid
            images={comment.imageUrl.filter((img) => img.imageUrl !== null).map((img) => ({ imageUrl: img.imageUrl! }))}
            setImageCarasol={setImageCarasol}
            idx={0}
            type={type}
            isComment={true}
          />
        )}
        <p className="text-2xs text-neutral-500 font-normal">
          {comment?.createdAt ? format(new Date(comment.createdAt), 'h:mm a · MMM d, yyyy') : ''}
        </p>

        <div className="flex justify-start gap-8 text-sm text-neutral-500 border-t border-neutral-200 py-2">
          <motion.div
            onClick={() =>
              likeHandler(comment._id, comment.level.toString(), sortBy, comment?.likeCount?.some((like: any) => like.userId === currentUserId))
            }
            className="flex items-center cursor-pointer"
            whileHover={{ scale: 1.1 }}
          >
            <AiOutlineLike className={comment?.likeCount?.some((like: any) => like.userId === currentUserId) ? 'text-primary' : ''} />
            <span className="mx-1">{comment?.likeCount?.length || 0}</span>
          </motion.div>

          {comment.level < 1 && (
            <motion.span className="flex items-center cursor-pointer" whileHover={{ scale: 1.1 }}>
              <FiMessageCircle className="mr-1 text-neutral-600" />
              {comment?.totalCount || comment?.replies?.length || 0}
            </motion.span>
          )}

          {comment.level < 1 && (
            <motion.div onClick={() => handleReplyClick(comment)} className="flex items-center cursor-pointer" whileHover={{ scale: 1.1 }}>
              <HiReply className="text-gray-dark" />
              <span className="ml-1 font-poppins text-xs">reply</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Nest replies if available */}
      {showReplies && comment?.replies && comment?.replies?.length > 0 && (
        <div className="w-full mt-6">
          {comment?.replies?.slice(0, visibleReplyCount).map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              communities={reply?.commenterProfileId?.communities}
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
                contentType,
                sortBy,
                parentCommentId: comment._id,
              }}
            />
          ))}
          {comment?.replies?.length > visibleReplyCount && (
            <button className="text-primary text-xs font-medium mt-2" onClick={() => setVisibleReplyCount((prev) => prev + 5)}>
              Show more replies
            </button>
          )}
          {comment?.replies?.length > 2 && visibleReplyCount > 2 && visibleReplyCount >= comment?.replies?.length && (
            <button className="text-primary text-xs font-medium mt-2 ml-4" onClick={() => setVisibleReplyCount(2)}>
              Show fewer replies
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default CommentItem
