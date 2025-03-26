'use client'
import React, { useCallback } from 'react'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import PostCartOption from '@/components/atoms/PostCardOption/PostCartOption'
import PostCardImageGrid from '@/components/atoms/PostCardImagesGrid'
import { FiMessageCircle, FiShare2, FiThumbsUp } from 'react-icons/fi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PostCommentBox from '../PostCommentBox'
import { useUniStore } from '@/store/store'
import { useLikeUnilikeGroupPost } from '@/services/community-university'
import { useLikeUnlikeTimelinePost } from '@/services/community-timeline'
import { PostType } from '@/types/constants'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useRouter } from 'next/navigation'
import { format, formatDistanceToNow } from 'date-fns'
import { Spinner } from '@/components/spinner/Spinner'
import UserCard from '@/components/atoms/UserCard'

dayjs.extend(relativeTime)

const SharePopup = () => {
  return (
    <div>
      <h1 className="font-semibold text-gray-dark mb-3">Share</h1>
      <div className="flex gap-4">
        <div>
          <div className="bg-primary p-3 rounded-full">
            <IoMdCode className="text-white self-center" size={40} />
          </div>
          <p className="text-center text-xs text-gray-dark mt-[6px] font-medium">Embed</p>
        </div>
        {/* <p className='text-sm text-gray-dark'>Embed</p> */}
        <div>
          <WhatsappShareButton url={window.location.href}>
            <WhatsappIcon size={64} round />
          </WhatsappShareButton>
          <p className="text-center text-xs text-gray-dark font-medium">Whatsapp</p>
        </div>
        <div>
          <FacebookShareButton url={window.location.href}>
            <FacebookIcon size={64} round />
          </FacebookShareButton>
          <p className="text-center text-xs text-gray-dark font-medium">Facebook</p>
        </div>
        <div>
          <LinkedinShareButton url={window.location.href}>
            <LinkedinIcon size={64} round />
          </LinkedinShareButton>
          <p className="text-center text-xs text-gray-dark font-medium">Linkedin</p>
        </div>
        <div>
          <TwitterShareButton url={window.location.href}>
            <TwitterIcon size={64} round />
          </TwitterShareButton>
          <p className="text-center text-xs text-gray-dark font-medium">Twitter</p>
        </div>
      </div>
      <div className="flex items-center gap-3 border-2 border-primary mt-6 rounded-full py-2 px-5">
        <p className="text-[#A3A3A3] text-sm">{window.location.href}</p>
        <button className="text-white bg-primary px-3 py-2 rounded-full text-xs font-medium">Copy</button>
      </div>
    </div>
  )
}

interface Like {
  userId: string
}

interface PostProps {
  user: string
  university: string
  adminId: string
  year: string
  text: string
  link?: string
  date: string
  avatarLink: string
  communityGroupId?: string
  communityId?: string
  commentCount: number
  likes: Like[]
  postID: string
  type: PostType.Community | PostType.Timeline
  images: {
    imageUrl: string
  }[]
  setImageCarasol: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean
      images: any
      currImageIndex: number | null
    }>
  >
  idx: number
  showCommentSection: string
  setShowCommentSection: (value: string) => void
  isTimeline?: boolean
}

const PostCard = ({
  user,
  university,
  adminId,
  year,
  text,
  link,
  date,
  avatarLink,
  likes,
  type,
  postID,
  images,
  setImageCarasol,
  idx,
  commentCount,
  showCommentSection,
  setShowCommentSection,
  communityGroupId,
  communityId,
  isTimeline = false,
}: PostProps) => {
  const { userData } = useUniStore()
  const router = useRouter()
  const { mutate: LikeUnlikeGroupPost, isPending: isLikeUnlikeGroupPending } = useLikeUnilikeGroupPost(communityId, communityGroupId, isTimeline)
  const { mutate: LikeUnlikeTimelinePost, isPending: isLikeUnlikePending } = useLikeUnlikeTimelinePost(communityId)

  const LikeUnlikeHandler = (postId: string) => {
    if (type === PostType.Timeline) {
      LikeUnlikeTimelinePost(postId)
    } else if (type === PostType.Community) {
      LikeUnlikeGroupPost(postId)
    }
  }

  const PostData = {
    user,
    avatarLink: avatarLink,
    date,
    university,
    year,
    text,
    type,
    adminId,
  }

  const handleProfileClicked = useCallback((adminId: string) => {
    router.push(`/profile/${adminId}`)
  }, [])

  return (
    <div className={`bg-white rounded-lg shadow-card`}>
      <div className="px-6">
        <div className="flex items-start py-4 gap-4 justify-between">
          <UserCard
            user={user}
            university={university}
            year={year}
            avatar={avatarLink || avatar}
            adminId={adminId}
            postID={postID}
            type={type}
            handleProfileClicked={(adminId) => handleProfileClicked(adminId)}
          />

          <div className="text-primary-500 text-sm md:text-md bg-surface-primary-50 rounded-full flex p-1">
            <PostCartOption isSelfPost={adminId === userData?.id} postID={postID} isType={type} />
          </div>
        </div>

        <div className="mb-4 text-xs font-medium text-neutral-700 break-words whitespace-normal" dangerouslySetInnerHTML={{ __html: text }} />

        {/* //post Image  */}
        <PostCardImageGrid images={images} setImageCarasol={setImageCarasol} idx={idx} type={type} />

        <p className="py-2 text-2xs flex items-center">
          <span className="text-neutral-500 font-normal break-words">
            {format(date as unknown as Date, 'h:mm a · MMM d, yyyy')} · Posted from {university}
          </span>
        </p>
      </div>

      {/* Post Meta */}

      <div className={`flex items-center justify-end py-3 border-t border-neutral-200 text-sm text-neutral-500 px-6`}>
        <div className="flex items-center gap-4">
          <span onClick={() => LikeUnlikeHandler(postID)} className="flex gap-1 items-center cursor-pointer">
            {likes?.length}
            {isLikeUnlikePending || isLikeUnlikeGroupPending ? (
              <Spinner />
            ) : (
              <FiThumbsUp className="mr-1 text-neutral-600" color={likes?.some((like: any) => like.userId == userData?.id) ? '#6647FF' : ''} />
            )}
          </span>
          <span onClick={() => setShowCommentSection(showCommentSection == postID ? ' ' : postID)} className="flex gap-2 items-center cursor-pointer">
            {commentCount} <FiMessageCircle className="mr-1 text-neutral-600" />
          </span>

          <Popover>
            <PopoverTrigger>
              <span className="flex items-center gap-1 text-xs">
                Share <FiShare2 className="mr-1 text-neutral-600 " />
              </span>
            </PopoverTrigger>
            <PopoverContent className="relative left-16 top-0 w-auto p-5 border-none shadow-lg bg-white shadow-gray-light">
              <SharePopup />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <PostCommentBox
        handleProfileClicked={(adminId) => handleProfileClicked(adminId)}
        showCommentSec={showCommentSection}
        postID={postID}
        type={type}
        data={PostData}
      />
    </div>
  )
}

export default PostCard
