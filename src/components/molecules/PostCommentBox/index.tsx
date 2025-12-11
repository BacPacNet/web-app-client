import React, { useEffect, useRef, useState } from 'react'
import { useUniStore } from '@/store/store'
import { useGetUserPostComments, useLikeUnlikeUserPostComment } from '@/services/community-timeline'
import { useGetCommunityPostComments, useLikeUnlikeGroupPostComment } from '@/services/community-university'
import { PostType } from '@/types/constants'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { FaPlusCircle, FaRegClock } from 'react-icons/fa'
import NewPostComment from '../NewPostComment'
import NestedCommentModal from '../nestedCommentModal'
import useDeviceType from '@/hooks/useDeviceType'
import { PostCommentProps } from '@/types/CommentPost'
import CommentItem from './CommentItem'
import ShowAllComponent from './ShowAllComnet'
import ShowMoreComponent from './showMoreComment'
import SimpleDropdown from '../SimpleDropDown'
import { Sortby } from '@/types/common'
import { LuRocket } from 'react-icons/lu'
import { AnimatePresence } from 'framer-motion'
import { ContentType } from '@/content/constant'

const options = [
  {
    value: Sortby.DESC,
    label: 'Most Recent',
    icon: <LuRocket className="w-4 h-4" />,
  },
  {
    value: Sortby.ASC,
    label: 'Oldest to Newest',
    icon: <FaRegClock className="w-4 h-4" />,
  },
]

// CommentList subcomponent for rendering comments
const CommentList = React.memo(function CommentList({
  comments,
  userData,
  childCommentsId,
  postID,
  type,
  setImageCarasol,
  handleProfileClicked,
  likePostCommentHandler,
  handleCommentClicked,
  handelCommentData,
  visibleComments,
  sortBy,
  contentType,
}: {
  comments: any[]
  userData: any
  childCommentsId: string[]
  postID: string
  type: PostType.Community | PostType.Timeline
  setImageCarasol: any
  handleProfileClicked: (adminId: string) => void
  likePostCommentHandler: (commentId: string, level: string, sortBy: Sortby | null, isLiked: boolean) => void
  handleCommentClicked: (comment: any) => void
  handelCommentData: (comment: any) => void
  visibleComments: { [key: string]: boolean }
  sortBy: Sortby | null
  contentType: ContentType
}) {
  return (
    <AnimatePresence>
      {comments.map((comment, index) => (
        <CommentItem
          key={index}
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
          sortBy={sortBy}
          communities={comment?.commenterProfileId?.communities}
          contentType={contentType}
        />
      ))}
    </AnimatePresence>
  )
})

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
  isReplyTrue,
  commentID,
  communityId,
  communityGroupId,
  contentType,
}: PostCommentProps) => {
  const { userData, userProfileData } = useUniStore()

  const [newPost, setNewPost] = useState(false)
  const [closeInitialComments, setCloseInitialComments] = useState(false)

  const [selectedOption, setSelectedOption] = useState<string>('Most Recent')
  const [selectedSortValue, setSelectedSortValue] = useState(Sortby.DESC)

  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({})
  const [childCommentsId, setChildCommentsId] = useState<string[]>([])
  const [commentData, setCommentData] = useState<any>()
  const [isReply, setIsReply] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [replyModal, setReplyModal] = useState({ enabled: false, commentID: '' })
  const { isMobile } = useDeviceType()

  const { mutate: likeGroupPostComment } = useLikeUnlikeGroupPostComment(
    false,
    showInitial,
    postID || '',
    selectedSortValue,
    communityId || '',
    communityGroupId || ''
  )
  const { mutate: likeUserPostComment } = useLikeUnlikeUserPostComment(false, showInitial, postID || '', selectedSortValue)
  const {
    data: commentsData,
    refetch: refetchUserPostComment,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isFetching,
  } = useGetUserPostComments(postID, showCommentSec == postID, type == PostType.Timeline, 5, selectedSortValue)
  const {
    data: communityCommentsData,
    refetch: refetchCommunityPostComment,
    fetchNextPage: communityCommentsNextpage,
    isFetchingNextPage: communityCommentsIsFetchingNextPage,
    hasNextPage: communityCommentsHasNextPage,
    isFetching: communityCommentsIsFetching,
  } = useGetCommunityPostComments(postID, showCommentSec == postID, type == PostType.Community, 5, selectedSortValue)
  const commentsDatas = React.useMemo(() => commentsData?.pages.flatMap((page) => page.finalComments) || [], [commentsData])
  const communitCommentsDatas = React.useMemo(() => communityCommentsData?.pages.flatMap((page) => page.finalComments) || [], [communityCommentsData])
  const isTimeline = type === PostType.Timeline
  const comments = React.useMemo(
    () => (type == PostType.Community ? communitCommentsDatas : commentsDatas),
    [type, communitCommentsDatas, commentsDatas]
  )

  const handleShowMore = React.useCallback(() => {
    if (type == PostType.Timeline) {
      fetchNextPage()
    } else {
      communityCommentsNextpage()
    }
  }, [type, fetchNextPage, communityCommentsNextpage])

  const likePostCommentHandler = React.useCallback(
    (commentId: string, level: string, sortBy: Sortby | null, isLiked: boolean) => {
      if (isTimeline) {
        likeUserPostComment({ userPostCommentId: commentId, level, isLiked })
      } else if (type === PostType.Community) {
        likeGroupPostComment({ communityGroupPostCommentId: commentId, level, isLiked })
      }
    },
    [isTimeline, likeUserPostComment, likeGroupPostComment, type]
  )

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

  const handleSelect = (option: { value: string; label: string }) => {
    setSelectedOption(option.label)
    setSelectedSortValue(option.value as Sortby)
    if (type === PostType.Timeline) {
      refetchUserPostComment()
    } else {
      refetchCommunityPostComment()
    }
  }

  useEffect(() => {
    if (isReplyTrue) {
      expandCommentSection(commentID || '')
    }
  }, [isReplyTrue])

  return (
    <div
      className={`${
        showCommentSec !== postID && !showInitial ? 'h-0 overflow-y-hidden py-0' : 'pt-6 pb-4'
      } flex flex-col gap-2 w-full border-t border-neutral-200 transition-all duration-300 ease-in-out`}
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
            className="border-2 border-primary py-2 px-3 text-2xs md:text-xs rounded-lg flex items-center gap-1 hover:scale-105 transition-all duration-200"
          >
            <span className="text-primary font-medium"> Add a comment</span>
            <FaPlusCircle className="p-1" size={20} color="#6647ff" />
          </button>
        </div>

        <div ref={containerRef} className="flex flex-col gap-4">
          {comments.length > 0 && <SimpleDropdown label={selectedOption} options={options} onSelect={handleSelect} />}

          {showInitial && showCommentSec !== postID ? (
            <CommentList
              comments={[initialComment]}
              userData={userData}
              childCommentsId={childCommentsId}
              postID={postID}
              type={type}
              setImageCarasol={setImageCarasol}
              handleProfileClicked={handleProfileClicked}
              likePostCommentHandler={likePostCommentHandler}
              handleCommentClicked={handleCommentClicked}
              handelCommentData={handelCommentData}
              visibleComments={visibleComments}
              sortBy={selectedSortValue}
              contentType={contentType}
            />
          ) : (
            <CommentList
              comments={comments}
              userData={userData}
              childCommentsId={childCommentsId}
              postID={postID}
              type={type}
              setImageCarasol={setImageCarasol}
              handleProfileClicked={handleProfileClicked}
              likePostCommentHandler={likePostCommentHandler}
              handleCommentClicked={handleCommentClicked}
              handelCommentData={handelCommentData}
              visibleComments={visibleComments}
              sortBy={selectedSortValue}
              contentType={contentType}
            />
          )}
        </div>
        {replyModal.enabled && <NestedCommentModal reply={replyModal} setReply={setReplyModal} type={type} sortBy={selectedSortValue} />}
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
            sortBy={selectedSortValue}
            communityId={communityId}
            communityGroupId={communityGroupId}
          />
        )}
        {showInitial && showCommentSec !== postID ? <ShowAllComponent postID={postID} setShowCommentSection={setShowCommentSection} /> : ''}
        {!showInitial && (
          <ShowMoreComponent
            handleShowMore={handleShowMore}
            isFetching={isTimeline ? isFetching : communityCommentsIsFetching}
            isFetchingNextPage={isTimeline ? isFetchingNextPage : communityCommentsIsFetchingNextPage}
            hasNextPage={isTimeline ? hasNextPage : communityCommentsHasNextPage}
          />
        )}
      </div>
    </div>
  )
}

export default PostCommentBox
