import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineLike } from 'react-icons/ai'
import { HiReply } from 'react-icons/hi'
import { SlOptions } from 'react-icons/sl'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useUniStore } from '@/store/store'
import { useCreateUserPostCommentReply, useGetUserPostComments, useLikeUnlikeUserPostComment } from '@/services/community-timeline'
import { useGetCommunityPostComments, useLikeUnlikeGroupPostComment } from '@/services/community-university'
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
import NestedCommentModal from '../nestedCommentModal'
import useDeviceType from '@/hooks/useDeviceType'
dayjs.extend(relativeTime)

type Props = {
  showCommentSec: string

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

type comments = {
  _id: string
  replies: comments
  likeCount: string[]
  level: number
  commenterId: {
    firstName: string
    lastName: string
  }
  commenterProfileId: {
    profile_dp: {
      imageUrl: string
    }

    university_name: string
    study_year: string
    degree: string
  }
  content: string
  createdAt: string
  totalCount: string
}[]

const PostCommentBox = ({ showCommentSec, postID, type, data }: Props) => {
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
  } = useGetUserPostComments(postID, showCommentSec == postID, type == PostType.Timeline, 3)
  const {
    data: communityCommentsData,
    fetchNextPage: communityCommentsNextpage,
    isFetchingNextPage: communityCommentsIsFetchingNextPage,
    hasNextPage: communityCommentsHasNextPage,
    isFetching: communityCommentsIsFetching,
  } = useGetCommunityPostComments(postID, showCommentSec == postID, type == PostType.Community, 3)
  const commentsDatas = commentsData?.pages.flatMap((page) => page.finalComments) || []
  const communitCommentsDatas = communityCommentsData?.pages.flatMap((page) => page.finalComments) || []

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current

        if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage && !isFetchingNextPage && type == PostType.Timeline) {
          fetchNextPage()
        }
        if (
          scrollTop + clientHeight >= scrollHeight - 10 &&
          communityCommentsHasNextPage &&
          !communityCommentsIsFetchingNextPage &&
          type == PostType.Community
        ) {
          communityCommentsNextpage()
        }
      }
    }

    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, communityCommentsIsFetchingNextPage, communityCommentsHasNextPage, communityCommentsNextpage])

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
    // console.log('ismm', isMobile, clickedComment)
    if (isMobile && clickedComment.level == 1) {
      return setReplyModal({ enabled: true, commentID: clickedComment._id })
    }

    if (clickedComment.level == 3) {
      setReplyModal({ enabled: true, commentID: clickedComment._id })
    }
  }

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

  const renderComments = (comments: comments) => {
    if ((isFetching && !isFetchingNextPage) || (communityCommentsIsFetching && !communityCommentsIsFetchingNextPage)) {
      return <Spinner />
    }
    // console.log('comments', comments)

    return comments?.map((comment, index: number) => (
      <div key={comment._id} className={`my-4   h-full relative ${childCommentsId.includes(comment._id) ? 'ms-8 max-sm:ms-4 w-10/12' : 'w-full'} `}>
        {comment?.replies?.length > 0 && visibleComments[comment._id] && comment?.level !== 3 ? (
          <div className="absolute w-[1px] h-[90%] bg-neutral-300 top-20 max-sm:top-16 left-14 max-sm:left-8"></div>
        ) : (
          ''
        )}

        <div>
          <div className="flex p-4 max-sm:px-0  gap-4 ">
            <div className="relative ">
              {childCommentsId.includes(comment._id) ? (
                <>
                  {/* <div className="absolute w-1 h-36 bg-neutral-300 -top-28 -left-14"></div> */}
                  {index == comments.length - 1 ? <div className="absolute w-2 h-96  bg-white  top-5  -left-6 max-sm:-left-4"></div> : ''}

                  <div
                    className={`absolute 
                     top-5 max-sm:top-4
                     -left-6 max-sm:-left-4 h-3 w-[43px] max-sm:w-8 border-l border-b border-neutral-300 rounded-bl-xl`}
                  ></div>
                </>
              ) : (
                ''
              )}
            </div>
            <Image
              src={comment?.commenterProfileId?.profile_dp?.imageUrl || avatar}
              width={56}
              height={56}
              className="rounded-full max-sm:w-10 max-sm:h-10"
              alt="avatar.png"
            />
            <div>
              <h3 className="font-medium text-sm max-sm:text-xs text-neutral-600 ">{comment?.commenterId?.firstName}</h3>
              <p className="text-2xs max-sm:text-[10px] text-neutral-500">{comment?.commenterProfileId?.university_name}</p>
              <p className="text-2xs max-sm:text-[10px] text-neutral-500">{`${comment?.commenterProfileId?.study_year}nd Yr ${comment?.commenterProfileId?.degree}`}</p>
            </div>
            <p className="ml-auto text-xs max-sm:text-[10px] text-gray">
              {comment.createdAt && dayjs(new Date(comment?.createdAt).toString()).format('h:mm A · MMM D, YYYY')}
            </p>
          </div>
        </div>
        <div className="flex gap-4 ps-[105px] max-sm:ps-[70px]">
          <p className="text-xs sm:text-sm pt-1 break-words lg:min-w-[450px] max-lg:min-w-[200px]">{comment?.content}</p>
        </div>
        <div className="flex justify-start ps-[105px] max-sm:ps-[70px] mt-3 gap-5 max-sm:gap-2 text-xs max-sm:text-2xs">
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
            className="flex items-center  cursor-pointer"
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
        {/* Render nested replies if they exist */}
        {comment?.replies?.length > 0 && visibleComments[comment._id] && comment.level < 3 && (
          <div className="ml-8 mt-4">{renderComments(comment.replies)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className={`${showCommentSec !== postID ? 'h-0 overflow-y-hidden' : ''}  flex flex-col gap-2 px-4 w-full`}>
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
          <button
            onClick={() => {
              setNewPost(true), setIsReply(false)
            }}
            className="border-2 border-primary py-2 px-3 text-xs rounded-lg flex items-center gap-3 ms-2"
          >
            {' '}
            <span>
              <FaPlusCircle color="#6647ff" />
            </span>{' '}
            <span className="text-primary"> Add a comment</span>
          </button>
        </div>
      </div>

      {communitCommentsDatas.length || commentsDatas.length ? (
        <p className="text-xs text-neutral-400">
          <span className="text-neutral-900">Top Comment</span> / <span>Most Recent</span>
        </p>
      ) : (
        ''
      )}

      <div ref={containerRef} className="max-h-72 overflow-y-scroll">
        {renderComments(type == PostType.Community ? communitCommentsDatas : commentsDatas)}
        {(isFetchingNextPage || communityCommentsIsFetching) && <Spinner />}
      </div>
      {replyModal.enabled && <NestedCommentModal reply={replyModal} setReply={setReplyModal} type={type} />}
      {newPost && <NewPostComment setNewPost={setNewPost} data={isReply ? commentData : data} isReply={isReply} postId={postID} />}
    </div>
  )
}

export default PostCommentBox
