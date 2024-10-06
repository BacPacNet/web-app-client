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
  }
  postId: string
}

const NewPostComment = ({ setNewPost, data, postId }: Props) => {
  const { userProfileData } = useUniStore()
  return (
    <>
      <div onClick={() => setNewPost(false)} className="fixed   w-full h-[100%] top-0 left-0 bg-black opacity-50 z-50"></div>
      <div className="fixed w-1/3 max-sm:w-11/12 z-50    top-[10%] left-1/3 bg-white flex flex-col  gap-6 shadow-lg px-2 py-6 rounded-lg">
        <div className="flex  p-2 gap-4">
          <Image src={data?.avatarLink || avatar} width={56} height={56} objectFit="cover" className="rounded-full w-12 h-12" alt="avatar.png" />
          <div>
            <h3 className="font-medium text-sm text-neutral-600">{data?.user}</h3>
            <p className="text-[12px] text-neutral-500">{data?.university}</p>
            <p className="text-[12px] text-neutral-500">{data?.year}</p>
            <p className="mt-5">{data?.text}</p>
            <p className="mt-5 text-xs text-neutral-400">{'Replying to ' + data?.user}</p>
          </div>
          <p className="ml-auto text-xs text-gray">{data?.date && dayjs(new Date(data?.date).toString()).format('h:mm A · MMM D, YYYY')}</p>
        </div>
        <div className="flex  p-2 gap-4">
          <Image
            src={userProfileData.profile_dp?.imageUrl || avatar}
            width={56}
            height={56}
            objectFit="cover"
            className="rounded-full w-12 h-12"
            alt="avatar.png"
          />
          <div className="w-full">
            <PostCommentInput adminID={data.adminId} postID={postId} type={data.type} />
          </div>
        </div>
      </div>
    </>
  )
}

export default NewPostComment
