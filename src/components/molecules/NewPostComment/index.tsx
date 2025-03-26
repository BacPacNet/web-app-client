import dayjs from 'dayjs'
import Image from 'next/image'
import React from 'react'
import avatar from '@assets/avatar.svg'
import { useUniStore } from '@/store/store'
import PostCommentInput from '../PostCommentInput'
import { PostType } from '@/types/constants'

type Props = {
  setNewPost: (value: boolean) => void
  data: {
    user: string
    avatarLink: string
    date: string
    university: string
    year: string
    text: string
    type: PostType.Community | PostType.Timeline
    adminId: string
    commentId?: string
    level?: string
  }
  postId?: string
  isReply: boolean
  isNested?: boolean
}

const NewPostComment = ({ setNewPost, data, postId, isReply, isNested }: Props) => {
  const { userProfileData } = useUniStore()
  return (
    <>
      <div onClick={() => setNewPost(false)} className="fixed w-full h-[100%] top-0 left-0 bg-black opacity-50 z-50"></div>
      <div className="absolute min-w-[343px] w-10/12 md:w-[616px] max-h-[75%] top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] z-50 bg-white px-4 py-4 rounded-lg ">
        <div className="flex items-center gap-3">
          <Image src={data?.avatarLink || avatar} width={24} height={24} objectFit="cover" className="rounded-full w-6 h-6" alt="avatar.png" />
          <p className=" text-sm text-neutral-400">{'Replying to ' + data?.user}</p>

          {/*<p className="ml-auto text-xs text-gray">{data?.date && dayjs(new Date(data?.date).toString()).format('h:mm A · MMM D, YYYY')}</p>*/}
        </div>
        <div className="flex pt-4 gap-3">
          {/*<Image
            src={userProfileData?.profile_dp?.imageUrl || avatar}
            width={56}
            height={56}
            className="rounded-full w-12 h-12 object-cover flex-none"
            alt="avatar.png"
          />*/}
          <div className="w-full">
            <PostCommentInput
              setNewPost={setNewPost}
              adminID={data.adminId}
              postID={postId}
              commenterProfileId={userProfileData?._id || ''}
              commentId={data.commentId}
              type={data.type}
              isReply={isReply}
              level={data.level ?? ''}
              isNested={isNested}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default NewPostComment
