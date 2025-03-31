import React, { useRef, useState } from 'react'
import { AiOutlineLike } from 'react-icons/ai'
import { HiReply } from 'react-icons/hi'
import { useUniStore } from '@/store/store'
import { useGetUserPostComments, useLikeUnlikeUserPostComment } from '@/services/community-timeline'
import { useGetCommunityPostComments, useLikeUnlikeGroupPostComment } from '@/services/community-university'
import { PostType } from '@/types/constants'
import Spinner from '@/components/atoms/spinner'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { FaArrowDown, FaPlusCircle } from 'react-icons/fa'
import NewPostComment from '../NewPostComment'
import { FiMessageCircle } from 'react-icons/fi'
import NestedCommentModal from '../nestedCommentModal'
import useDeviceType from '@/hooks/useDeviceType'
import UserCard from '@/components/atoms/UserCard'
import { format } from 'date-fns'
import PostCardImageGrid from '@/components/atoms/PostCardImagesGrid'
import { CommentsType, PostCommentProps } from '@/types/CommentPost'

const PostCommentBox = ({ showCommentSec, postID, type, data, handleProfileClicked, setImageCarasol }: PostCommentProps) => {
  const { userData, userProfileData } = useUniStore()
  const [newPost, setNewPost] = useState(false)
  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({})
  const [childCommentsId, setChildCommentsId] = useState<string[]>([])
  const [commentData, setCommentData] = useState<any>()
  const [isReply, setIsReply] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [replyModal, setReplyModal] = useState({ enabled: false, commentID: '' })
  const { isMobile } = useDeviceType()

  const { mutate: likeGroupPostComment } = useLikeUnlikeGroupPostComment(false)
  const { mutate: likeUserPostComment } = useLikeUnlikeUserPostComment(false)
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

  const handleShowMore = () => {
    if (type == PostType.Timeline) {
      fetchNextPage()
    } else {
      communityCommentsNextpage()
    }
  }

  const likePostCommentHandler = (commentId: string) => {
    if (type === PostType.Timeline) {
      likeUserPostComment(commentId)
    } else if (type === PostType.Community) {
      likeGroupPostComment(commentId)
    }
  }

  const showMoreComponent = () => {
    if (hasNextPage || communityCommentsHasNextPage) {
      return (
        <div className="text-neutral-500 flex items-center gap-2 mb-2 hover:cursor-pointer">
          <p className="" onClick={handleShowMore}>
            show more comments
          </p>
          <FaArrowDown />
          {(isFetchingNextPage || communityCommentsIsFetchingNextPage) && <Spinner />}
        </div>
      )
    } else null
  }
  const handelCommentData = (comment: any) => {
    const commentData = {
      avatarLink: comment?.commenterProfileId?.profile_dp.imageUrl,
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

  const toggleCommentSection = (commentId: string) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
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

  const renderComments = (comments: CommentsType) => {
    if ((isFetching && !isFetchingNextPage) || (communityCommentsIsFetching && !communityCommentsIsFetchingNextPage)) {
      return <Spinner />
    }

    return comments?.map((comment, index: number) => (
      <div
        key={comment._id}
        className={`${comments.length - 1 === index ? 'mb-0' : 'mb-6'}  w-auto h-full relative ${
          childCommentsId.includes(comment._id) ? 'ml-6' : 'w-full'
        } `}
      >
        <div>
          <UserCard
            user={comment?.commenterId?.firstName + ' ' + comment?.commenterId?.lastName}
            university={comment?.commenterProfileId?.university_name}
            major={comment?.commenterProfileId?.major}
            year={comment?.commenterProfileId?.study_year}
            avatar={comment?.commenterProfileId?.profile_dp?.imageUrl || avatar}
            adminId={comment?.commenterId?._id}
            postID={postID}
            type={type}
            handleProfileClicked={(adminId) => handleProfileClicked(adminId)}
            role={comment?.commenterProfileId?.role}
            affiliation={comment?.commenterProfileId?.affiliation}
            occupation={comment?.commenterProfileId?.occupation}
          />
        </div>
        <div className={`flex flex-col gap-4 py-3 ${comments.length - 1 === index ? 'border-none' : 'border-b border-neutral-200'} `}>
          {/* <div className="text-2xs sm:text-xs break-words lg:min-w-[450px] max-lg:min-w-[200px]" dangerouslySetInnerHTML={{ __html: comment?.content }} /> */}
          <p
            className="text-2xs sm:text-xs break-words lg:min-w-[450px] max-lg:min-w-[200px]"
            dangerouslySetInnerHTML={{ __html: comment?.content }}
          />
          <PostCardImageGrid images={comment?.imageUrl} setImageCarasol={setImageCarasol} idx={0} type={type} isComment={true} />
          <p className="text-2xs text-neutral-500 font-normal">{format(comment?.createdAt as never as Date, 'h:mm a · MMM d, yyyy')}</p>
          <div className="flex justify-start gap-4 text-sm text-neutral-500">
            <div className="flex items-center cursor-pointer">
              <AiOutlineLike
                onClick={() => likePostCommentHandler(comment._id)}
                className={comment?.likeCount?.some((like: any) => like.userId === userData?.id) ? 'text-primary' : ''}
              />
              <span className="mx-1 ">{comment?.likeCount ? comment?.likeCount.length : 0}</span>
            </div>
            <span
              onClick={() => {
                toggleCommentSection(comment._id), handleChildComments(comment?.replies), setActiveComments(comment)
              }}
              className="flex items-center  cursor-pointer"
            >
              <FiMessageCircle className="mr-1 text-neutral-600" /> {comment.totalCount}
            </span>
            <div onClick={() => handelCommentData(comment)} className="flex items-center cursor-pointer">
              <HiReply className="text-gray-dark" />
              <span className="ml-1 font-poppins text-xs">reply</span>
            </div>
          </div>
        </div>

        {/* Render nested replies if they exist */}
        {comment?.replies?.length > 0 && visibleComments[comment._id] && comment.level < 3 && (
          <div className="w-full mt-6">{renderComments(comment.replies)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className={`${showCommentSec !== postID ? 'h-0 overflow-y-hidden py-0' : 'pt-6'} flex flex-col gap-2 w-full border-t border-neutral-200`}>
      <div className="px-6">
        <div className="rounded-full pb-6 flex gap-4 items-center">
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

        <div ref={containerRef}>{renderComments(type == PostType.Community ? communitCommentsDatas : commentsDatas)}</div>
        {replyModal.enabled && <NestedCommentModal reply={replyModal} setReply={setReplyModal} type={type} />}
        {newPost && <NewPostComment setNewPost={setNewPost} data={isReply ? commentData : data} isReply={isReply} postId={postID} />}
        {showMoreComponent()}
      </div>
    </div>
  )
}

export default PostCommentBox
