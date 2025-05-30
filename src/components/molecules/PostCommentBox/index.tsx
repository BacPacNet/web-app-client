import React, { useEffect, useRef, useState } from 'react'
import { useUniStore } from '@/store/store'
import { useGetUserPostComments, useLikeUnlikeUserPostComment } from '@/services/community-timeline'
import { useGetCommunityPostComments, useLikeUnlikeGroupPostComment } from '@/services/community-university'
import { PostType } from '@/types/constants'
import Spinner from '@/components/atoms/spinner'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { FaPlusCircle } from 'react-icons/fa'
import NewPostComment from '../NewPostComment'
import NestedCommentModal from '../nestedCommentModal'
import useDeviceType from '@/hooks/useDeviceType'
import { PostCommentProps } from '@/types/CommentPost'
import { useRouter, useSearchParams } from 'next/navigation'
import CommentItem from './CommentItem'
import ShowAllComponent from './ShowAllComnet'
import ShowMoreComponent from './showMoreComment'

const PostCommentBox = ({
  showCommentSec,
  postID,
  type,
  data,
  handleProfileClicked,
  setImageCarasol,
  initialComment,
  setShowCommentSection,
  setShowInitial,
  showInitial,
}: PostCommentProps) => {
  const { userData, userProfileData } = useUniStore()

  const [newPost, setNewPost] = useState(false)
  const [closeInitialComments, setCloseInitialComments] = useState(false)

  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({})
  const [childCommentsId, setChildCommentsId] = useState<string[]>([])
  const [commentData, setCommentData] = useState<any>()
  const [isReply, setIsReply] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [replyModal, setReplyModal] = useState({ enabled: false, commentID: '' })
  const { isMobile } = useDeviceType()

  const { mutate: likeGroupPostComment } = useLikeUnlikeGroupPostComment(false, showInitial, postID || '')
  const { mutate: likeUserPostComment } = useLikeUnlikeUserPostComment(false, showInitial, postID || '')
  const {
    data: commentsData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
  } = useGetUserPostComments(postID, showCommentSec == postID, type == PostType.Timeline, 5)
  const {
    data: communityCommentsData,
    fetchNextPage: communityCommentsNextpage,
    isFetchingNextPage: communityCommentsIsFetchingNextPage,
    hasNextPage: communityCommentsHasNextPage,
    isFetching: communityCommentsIsFetching,
  } = useGetCommunityPostComments(postID, showCommentSec == postID, type == PostType.Community, 5)
  const commentsDatas = commentsData?.pages.flatMap((page) => page.finalComments) || []
  const communitCommentsDatas = communityCommentsData?.pages.flatMap((page) => page.finalComments) || []

  const isTimeline = type === PostType.Timeline
  const comments = type == PostType.Community ? communitCommentsDatas : commentsDatas

  const handleShowMore = () => {
    if (type == PostType.Timeline) {
      fetchNextPage()
    } else {
      communityCommentsNextpage()
    }
  }

  const likePostCommentHandler = (commentId: string, level: string) => {
    if (isTimeline) {
      likeUserPostComment({ userPostCommentId: commentId, level })
    } else if (type === PostType.Community) {
      likeGroupPostComment({ communityGroupPostCommentId: commentId, level })
    }
  }

  const handelCommentData = (comment: any) => {
    const commentData = {
      avatarLink: comment?.commenterProfileId?.profile_dp?.imageUrl,
      data: comment?.createdAt,
      text: comment?.content,
      user: comment?.commenterId.firstName + ' ' + comment?.commenterId.lastName,
      type: data?.type,
      commentId: comment?._id,
      level: comment?.level,
    }
    setCommentData(commentData)
    setIsReply(true)
    setNewPost(true)
  }

  useEffect(() => {
    if (initialComment?._id) {
      setShowInitial(!!initialComment)
    }
  }, [!!initialComment])

  const handleCommentClicked = (comment: any) => {
    toggleCommentSection(comment._id)
    handleChildComments(comment?.replies)
    setActiveComments(comment)
  }

  const toggleCommentSection = (commentId: string) => {
    if (initialComment) {
      setCloseInitialComments(true)
    }
    setVisibleComments((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }))
  }
  const expandCommentSection = (commentId: string) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [commentId]: true,
    }))
  }

  const handleChildComments = (comments: any) => {
    const childCommentsIds = comments?.map((item: { _id: string }) => item?._id)

    setChildCommentsId([...childCommentsId, ...childCommentsIds])
  }

  const setActiveComments = (clickedComment: any) => {
    if (isMobile && clickedComment.level == 1) {
      return setReplyModal({ enabled: true, commentID: clickedComment._id })
    }

    if (clickedComment.level == 3) {
      setReplyModal({ enabled: true, commentID: clickedComment._id })
    }
  }

  //  if ((isFetching && !isFetchingNextPage) || (communityCommentsIsFetching && !communityCommentsIsFetchingNextPage)) {
  //    return (
  //      <div className="my-2">
  //        <Spinner />
  //      </div>
  //    )
  //  }

  return (
    <div
      className={`${
        showCommentSec !== postID && !showInitial ? 'h-0 overflow-y-hidden py-0' : 'pt-6 pb-4'
      } flex flex-col gap-2 w-full border-t border-neutral-200`}
    >
      <div className="px-6">
        <div className="rounded-full  flex gap-4 items-center">
          <Image
            src={userProfileData?.profile_dp?.imageUrl || avatar}
            alt={`${userData?.firstName}'s avatar`}
            width={45}
            height={45}
            className="rounded-full h-[45px] object-cover"
          />
          <button
            onClick={() => {
              setNewPost(true), setIsReply(false)
            }}
            className="border-2 border-primary py-2 px-3 text-2xs md:text-xs rounded-lg flex items-center gap-1"
          >
            <span className="text-primary font-medium"> Add a comment</span>
            <FaPlusCircle className="p-1" size={20} color="#6647ff" />
          </button>
        </div>

        <div ref={containerRef} className="flex flex-col gap-4">
          {showInitial && showCommentSec !== postID ? (
            <>
              {[initialComment].map((comment) => {
                return (
                  <CommentItem
                    key={comment?._id}
                    comment={comment}
                    currentUserId={userData?.id}
                    childCommentsId={childCommentsId}
                    postID={postID}
                    type={type}
                    setImageCarasol={setImageCarasol}
                    handleProfileClicked={handleProfileClicked}
                    likeHandler={likePostCommentHandler}
                    toggleCommentSection={handleCommentClicked}
                    handleReplyClick={handelCommentData}
                    showReplies={visibleComments[comment._id]}
                  />
                )
              })}
            </>
          ) : (
            <>
              {comments.map((comment, index) => {
                return (
                  <CommentItem
                    key={comment?._id}
                    comment={comment}
                    currentUserId={userData?.id}
                    childCommentsId={childCommentsId}
                    postID={postID}
                    type={type}
                    setImageCarasol={setImageCarasol}
                    handleProfileClicked={handleProfileClicked}
                    likeHandler={likePostCommentHandler}
                    toggleCommentSection={handleCommentClicked}
                    handleReplyClick={handelCommentData}
                    showReplies={visibleComments[comment._id]}
                  />
                )
              })}
            </>
          )}
          {/* {renderComments(type == PostType.Community ? communitCommentsDatas : commentsDatas)} */}
        </div>
        {replyModal.enabled && <NestedCommentModal reply={replyModal} setReply={setReplyModal} type={type} />}
        {newPost && (
          <NewPostComment
            setShowCommentSection={setShowCommentSection}
            showInitial={showInitial}
            setNewPost={setNewPost}
            postType={type}
            data={isReply ? commentData : data}
            isReply={isReply}
            postId={postID}
            expandCommentSection={expandCommentSection}
          />
        )}
        {showInitial && showCommentSec !== postID ? <ShowAllComponent postID={postID} setShowCommentSection={setShowCommentSection} /> : ''}
        {!showInitial && (
          <ShowMoreComponent
            handleShowMore={handleShowMore}
            isFetching={isTimeline ? isFetching : communityCommentsIsFetching}
            isFetchingNextPage={isTimeline ? isFetchingNextPage : communityCommentsIsFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        )}
      </div>
    </div>
  )
}

export default PostCommentBox
