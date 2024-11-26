import React, { useEffect, useState } from 'react'
import { AiOutlineLike } from 'react-icons/ai'
import { HiReply } from 'react-icons/hi'
import { SlOptions } from 'react-icons/sl'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useUniStore } from '@/store/store'
import { useGetCommentById, useGetUserPostComments, useLikeUnlikeUserPostComment } from '@/services/community-timeline'
import { useGetCommunityCommentById, useGetCommunityPostComments, useLikeUnlikeGroupPostComment } from '@/services/community-university'
import { PostCommentData, PostType } from '@/types/constants'
import { replaceImage } from '@/services/uploadImage'
import Spinner from '@/components/atoms/spinner'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { FaPlusCircle } from 'react-icons/fa'
import NewPostComment from '../NewPostComment'
import { FiMessageCircle, FiRepeat, FiShare2, FiThumbsUp } from 'react-icons/fi'
import { FaUser, FaUsers } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'
import { CiBookmark, CiBellOff, CiFlag1 } from 'react-icons/ci'
import { MdBlock } from 'react-icons/md'
import { GoBookmark } from 'react-icons/go'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'
import { IoMdCode } from 'react-icons/io'
import useDeviceType from '@/hooks/useDeviceType'

const SharePopup = (commentId: { commentId: string }) => {
  return (
    <div>
      <h1 className="font-semibold text-gray-dark mb-3">Share</h1>
      <div className="flex gap-4">
        <div>
          <div className="bg-primary p-1 w-7 h-7 rounded-full">
            <IoMdCode className="text-white self-center" size={20} />
          </div>
          <p className="text-center text-xs text-gray-dark mt-[6px] font-medium">Embed</p>
        </div>
        {/* <p className='text-sm text-gray-dark'>Embed</p> */}
        <div>
          <WhatsappShareButton url={window.location.href}>
            <WhatsappIcon size={30} round />
          </WhatsappShareButton>
          <p className="text-center text-xs text-gray-dark font-medium">Whatsapp</p>
        </div>
        <div>
          <FacebookShareButton url={window.location.href}>
            <FacebookIcon size={30} round />
          </FacebookShareButton>
          <p className="text-center text-xs text-gray-dark font-medium">Facebook</p>
        </div>
        <div>
          <LinkedinShareButton url={window.location.href}>
            <LinkedinIcon size={30} round />
          </LinkedinShareButton>
          <p className="text-center text-xs text-gray-dark font-medium">Linkedin</p>
        </div>
        <div>
          <TwitterShareButton url={window.location.href}>
            <TwitterIcon size={30} round />
          </TwitterShareButton>
          <p className="text-center text-xs text-gray-dark font-medium">Twitter</p>
        </div>
      </div>
      <div className="flex items-center gap-3 border-2 border-primary mt-6 rounded-full py-2 px-5">
        <p className="text-[#A3A3A3] text-sm">{`${window.location.href}/${commentId.commentId}`}</p>
        <button className="text-white bg-primary px-3 py-2 rounded-full text-xs font-medium">Copy</button>
      </div>
    </div>
  )
}

const RepostPopUp = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <FaUser />
        <p>Repost on Group</p>
      </div>
      <div className="flex items-center gap-1">
        <FaUsers />
        <p>Repost on Timeline</p>
      </div>
    </div>
  )
}

const CommentOption = () => {
  return (
    <div className="flex flex-col gap-2">
      {/* <div className="flex items-center gap-1">
        <FiRepeat className="mr-1 text-neutral-600" />
        <p>Repost </p>
      </div> */}
      <div className="flex items-center gap-1">
        <FiShare2 className="mr-1 text-neutral-600" />
        <p>Share </p>
      </div>
      <div className="flex items-center gap-1">
        <GoBookmark className="mr-1 text-neutral-600" />
        <p>Save Comment</p>
      </div>
      <div className="flex items-center gap-1">
        <CiBellOff className="mr-1 text-neutral-600" />
        <p>Mute Notification </p>
      </div>
      <div className="flex items-center gap-1">
        <MdBlock className="mr-1 text-neutral-600" />
        <p>Block</p>
      </div>
      <div className="flex items-center gap-1">
        <CiFlag1 className="mr-1 text-neutral-600" />
        <p>Report</p>
      </div>
    </div>
  )
}

type reply = {
  reply: {
    enabled: boolean
    commentID: string
  }
  setReply: (value: { enabled: boolean; commentID: string }) => void
  type: PostType.Community | PostType.Timeline
}
const NestedCommentModal = ({ reply, setReply, type }: reply) => {
  const { userData } = useUniStore()
  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({})
  const [childCommentsId, setChildCommentsId] = useState<string[]>([])
  const [commentData, setCommentData] = useState<any>()
  const [isReply, setIsReply] = useState(false)
  const [newPost, setNewPost] = useState(false)
  const [commentId, setCommentId] = useState('')
  const { isMobile } = useDeviceType()

  const { data, refetch, isFetching } = useGetCommentById(commentId ? commentId : reply.commentID, reply.enabled, type == PostType.Timeline)
  const {
    data: communityComment,
    refetch: communityCommentRefetch,
    isFetching: communityCommentIsFetching,
  } = useGetCommunityCommentById(commentId ? commentId : reply.commentID, reply.enabled, type == PostType.Community)
  const { mutate: likeGroupPostComment } = useLikeUnlikeGroupPostComment(true)
  const { mutate: likeUserPostComment } = useLikeUnlikeUserPostComment(true)

  const toggleCommentSection = (commentId: string) => {
    setVisibleComments((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }))
  }

  const handleChildComments = (comments: Comment[]) => {
    const childCommentsIds = comments.map((item: any) => item._id)
    setChildCommentsId((prevIds) => [...prevIds, ...childCommentsIds])
  }

  const likePostCommentHandler = (commentId: string) => {
    if (type === PostType.Timeline) {
      likeUserPostComment(commentId)
    } else if (type === PostType.Community) {
      likeGroupPostComment(commentId)
    }
  }

  const handelCommentData = (comment: any) => {
    const commentData = {
      avatarLink: comment?.commenterProfileId?.profile_dp.imageUrl,
      data: comment?.createdAt,
      text: comment?.content,
      user: comment?.commenterId.firstName + ' ' + comment?.commenterId.lastName,
      type: type,
      commentId: comment?._id,
      level: comment?.level,
    }
    setCommentData(commentData)
    setIsReply(true)
    setNewPost(true)
  }

  const setActiveComments = (clickedComment: any) => {
    if (isMobile && clickedComment.level % 2 == 0) {
      return setCommentId(clickedComment._id)
    }
    if (clickedComment.level % 3 == 0 && clickedComment.level !== 3) {
      return setCommentId(clickedComment._id)
    }
  }

  useEffect(() => {
    if (commentId) {
      if (type == PostType.Timeline) {
        refetch()
      }
      if (type == PostType.Community) {
        communityCommentRefetch()
      }
    }
  }, [commentId, refetch])

  const Comment = ({ comment }: any) => {
    if (communityCommentIsFetching || isFetching) {
      return (
        <div className="min-w-[300px]">
          <Spinner />
        </div>
      )
    }
    return (
      <div className={`my-4 h-full relative ${childCommentsId.includes(comment._id) ? 'ms-6 max-sm:ms-3 w-10/12 ' : 'w-full'}`}>
        {/* {comment.replies?.length > 0 && visibleComments[comment._id] && (
          <div className="absolute w-[1px] h-5/6 bg-neutral-300 top-20 left-14 max-sm:hidden"></div>
        )} */}

        {/* Commenter Info */}
        <div className="flex p-4 gap-4 max-sm:px-0">
          <Image
            src={comment.commenterProfileId?.profile_dp?.imageUrl || '/avatar.png'}
            width={56}
            height={56}
            className="rounded-full object-cover w-10 h-10 max-sm:w-8 max-sm:h-8"
            alt="avatar.png"
          />
          <div>
            <h3 className="font-medium text-sm text-neutral-600">{comment.commenterId?.firstName}</h3>
            <p className="text-xs text-neutral-500">{comment.commenterProfileId?.university_name}</p>
            <p className="text-xs text-neutral-500">{`${comment.commenterProfileId?.study_year}nd Yr ${comment.commenterProfileId?.degree}`}</p>
          </div>
          <p className="ml-auto text-xs text-gray">{dayjs(comment.createdAt).format('h:mm A · MMM D, YYYY')}</p>
        </div>

        {/* Comment Content */}
        <div className="ps-20 max-sm:ps-12">
          <p className="text-xs sm:text-sm pt-1 break-words">{comment.content}</p>

          {/* Action Buttons */}
          <div className="flex justify-start   max-sm:ps-0 mt-3 gap-5 max-sm:gap-2 text-xs max-sm:text-2xs">
            <div className="flex items-center cursor-pointer">
              <AiOutlineLike
                onClick={() => likePostCommentHandler(comment._id)}
                color={comment?.likeCount?.some((like: any) => like.userId === userData?.id) ? '#6647FF' : ''}
              />
              <span className="mx-1 ">{comment?.likeCount ? comment?.likeCount.length : 0}</span>
            </div>
            <span
              onClick={() => {
                toggleCommentSection(comment._id), handleChildComments(comment?.replies), setActiveComments(comment)
              }}
              className="flex items-center cursor-pointer"
            >
              <FiMessageCircle className="mr-1 text-neutral-600" /> {comment.totalCount}
            </span>
            <div onClick={() => handelCommentData(comment)} className="flex items-center cursor-pointer">
              <HiReply className="text-gray-dark" />
              <span className="ml-2 ">Reply</span>
            </div>
            {/* <span className="flex items-center">
              <Popover>
                <PopoverTrigger>
                  <div className="flex gap-1 items-center">
                    <FiRepeat className="mr-1 text-neutral-600" />
                    <span>2</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="relative left-16 top-0 w-auto p-5 border-none shadow-lg bg-white shadow-gray-light">
                  <RepostPopUp />
                </PopoverContent>
              </Popover>
            </span> */}

            <Popover>
              <PopoverTrigger>
                <span className="flex items-center">
                  <FiShare2 className="mr-1 text-neutral-600" /> Share
                </span>
              </PopoverTrigger>
              <PopoverContent className="relative left-16 top-0 w-auto p-5 border-none shadow-lg bg-white shadow-gray-light">
                <SharePopup commentId={comment._id} />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger>
                <div className="flex gap-1 items-center">
                  <BsThreeDots className="mr-1 text-neutral-600" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="relative left-16 top-0 w-auto p-5 border-none shadow-lg bg-white shadow-gray-light">
                <CommentOption />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {comment?.replies?.length > 0 && visibleComments[comment._id] && (
          <div className="ml-8 mt-4">
            {comment.replies.map((reply: any) => (
              <Comment key={reply._id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div
        onClick={() => setReply({ commentID: '', enabled: false })}
        className="fixed   w-full h-[100%] top-0 left-0 bg-black opacity-50 z-20"
      ></div>

      <div className="fixed w-1/2 max-sm:w-11/12 bg-white top-40 overflow-y-scroll h-64 z-30 p-2 rounded-xl flex justify-start">
        {(type == PostType.Community ? communityComment?.finalComments : data?.finalComments)?.map((comment: any) => (
          <Comment key={comment._id} comment={comment} />
        ))}
        {newPost && <NewPostComment setNewPost={setNewPost} data={isReply ? commentData : data} isReply={true} isNested={true} />}
      </div>
    </>
  )
}

export default NestedCommentModal
