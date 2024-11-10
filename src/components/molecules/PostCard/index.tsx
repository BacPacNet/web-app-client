'use client'
import React from 'react'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import PostCartOption from '@/components/atoms/PostCardOption/PostCartOption'
import PostCardImageGrid from '@/components/atoms/PostCardImagesGrid'
import { FiMessageCircle, FiRepeat, FiShare2, FiThumbsUp } from 'react-icons/fi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PostCommentBox from '../PostCommentBox'
import { useUniStore } from '@/store/store'
import { useLikeUnilikeGroupPost } from '@/services/community-university'
import { useLikeUnlikeTimelinePost } from '@/services/community-timeline'
import { FaUser, FaUsers } from 'react-icons/fa'
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
}: PostProps) => {
  const { userData } = useUniStore()
  const router = useRouter()
  const { mutate: LikeUnlikeGroupPost } = useLikeUnilikeGroupPost()
  const { mutate: LikeUnlikeTimelinePost } = useLikeUnlikeTimelinePost()

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

  const handleProfileClicked = () => {
    router.push(`/profile/${adminId}`)
  }
  return (
    <div className={`bg-white rounded-2xl px-4`}>
      <div className="flex items-center py-4 gap-4 justify-between">
        <div onClick={handleProfileClicked} className="flex gap-4 cursor-pointer">
          <div>
            <Image src={avatarLink || avatar} width={45} height={45} className="rounded-full" alt="avatar.png" />
          </div>
          <div>
            <h3 className="font-medium text-sm text-neutral-600">{user}</h3>
            <div className="flex items-center gap-1">
              <p className="text-[12px] text-neutral-500">{year},</p>
              <p className="text-[12px] text-neutral-500">{university}</p>
            </div>
          </div>
        </div>

        <div className=" text-primary-500 text-md bg-surface-primary-50 rounded-full flex p-1">
          <PostCartOption isSelfPost={adminId === userData.id} postID={postID} isType={type} />{' '}
        </div>
      </div>

      <div>
        <p className="text-sm text-neutral-700 font-medium py-4">{text}</p>
      </div>

      {/* //post Image  */}
      <PostCardImageGrid images={images} setImageCarasol={setImageCarasol} idx={idx} type={type} />
      {/* Post Content */}

      {/* Timestamp */}
      <p className="py-4 text-xs text-neutral-400 flex items-center">
        <span className="text-neutral-500 break-words">{dayjs(new Date(date).toString()).format('h:m a · MMM DD, YYYY')}</span> · Post from {user} at{' '}
        {university}
      </p>

      {/* Post Meta */}
      <div
        className={`flex items-center justify-between py-2 border-t ${showCommentSection && 'border-b'} border-neutral-200 text-sm text-neutral-500 `}
      >
        <div className="flex items-center gap-10">
          <span onClick={() => LikeUnlikeHandler(postID)} className="flex items-center">
            <FiThumbsUp className="mr-1 text-neutral-600" color={likes?.some((like: any) => like.userId == userData?.id) ? '#6647FF' : ''} />{' '}
            {likes?.length}
          </span>
          <span onClick={() => setShowCommentSection(showCommentSection == postID ? ' ' : postID)} className="flex items-center">
            <FiMessageCircle className="mr-1 text-neutral-600" /> {commentCount}
          </span>

          <Popover>
            <PopoverTrigger>
              <span className="flex items-center">
                <FiShare2 className="mr-1 text-neutral-600" /> Share
              </span>
            </PopoverTrigger>
            <PopoverContent className="relative left-16 top-0 w-auto p-5 border-none shadow-lg bg-white shadow-gray-light">
              <SharePopup />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <PostCommentBox showCommentSec={showCommentSection} postID={postID} type={type} adminId={userData.id || ''} data={PostData} />
    </div>
  )
}

export default PostCard
