'use client'
import React, { useState } from 'react'
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

dayjs.extend(relativeTime)
const dummyImageData = [
  'https://cdn.pixabay.com/photo/2022/10/23/13/43/canoe-7541311_1280.jpg',
  'https://cdn.pixabay.com/photo/2022/05/17/22/44/car-7203855_1280.jpg',
  'https://cdn.pixabay.com/photo/2023/01/15/22/48/river-7721287_640.jpg',
  'https://cdn.pixabay.com/photo/2024/06/12/16/25/plant-8825881_640.png',
  'https://cdn.pixabay.com/photo/2024/06/12/16/25/plant-8825881_640.png',
]

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
  year: string
  text: string
  link?: string
  date: string
  avatarLink: string
  comments: any
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
}

const PostCard = ({
  user,
  university,
  year,
  text,
  link,
  date,
  avatarLink,
  comments,
  likes,
  type,
  postID,
  images,
  setImageCarasol,
  idx,
}: PostProps) => {
  const { userData } = useUniStore()
  const [showCommentSection, setShowCommentSection] = useState(false)
  const { mutate: LikeUnlikeGroupPost } = useLikeUnilikeGroupPost()
  const { mutate: LikeUnlikeTimelinePost } = useLikeUnlikeTimelinePost()

  const LikeUnlikeHandler = (postId: string) => {
    if (type === PostType.Timeline) {
      LikeUnlikeTimelinePost(postId)
    } else if (type === PostType.Community) {
      LikeUnlikeGroupPost(postId)
    }
  }

  return (
    <div className="bg-white rounded-b-2xl">
      <div className="flex items-center p-4 gap-4">
        <Image src={avatarLink || avatar} width={56} height={56} className="rounded-full" alt="avatar.png" />
        <div>
          <h3 className="font-medium text-sm text-neutral-600">{user}</h3>
          <p className="text-[12px] text-neutral-500">{university}</p>
          <p className="text-[12px] text-neutral-500">{year}</p>
        </div>
        <div className="ml-auto text-gray-400">
          {' '}
          <PostCartOption postID="123" isType="group" />{' '}
        </div>
      </div>

      {/* //post Image  */}
      <PostCardImageGrid images={images} setImageCarasol={setImageCarasol} idx={idx} type={type} />
      {/* Post Content */}

      <div className={`px-4  ${text?.length ? 'py-6' : 'py-2'}`}>
        <p className="text-xs text-neutral-700 font-medium">{text}</p>
      </div>

      {/* Timestamp */}
      <p className="px-4 py-2 text-[12px] text-neutral-400 flex items-center">
        <span className="text-neutral-500 break-words">{dayjs(new Date(date).toString()).format('h:m a · MMM DD, YYYY')}</span> · Post from {user} at{' '}
        {university}
      </p>

      {/* Post Meta */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-200 text-xs text-neutral-500 ">
        <div className="flex items-center gap-10">
          <span onClick={() => LikeUnlikeHandler(postID)} className="flex items-center">
            <FiThumbsUp className="mr-1 text-neutral-600" color={likes?.some((like: any) => like.userId == userData?.id) ? '#6647FF' : ''} />{' '}
            {likes.length}
          </span>
          <span onClick={() => setShowCommentSection(!showCommentSection)} className="flex items-center">
            <FiMessageCircle className="mr-1 text-neutral-600" /> {comments.length}
          </span>
          <span className="flex items-center">
            <FiRepeat className="mr-1 text-neutral-600" /> 2
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
      <PostCommentBox showCommentSec={showCommentSection} userComments={comments} postID={postID} type={type} adminId={userData.id} />
    </div>
  )
}

export default PostCard
