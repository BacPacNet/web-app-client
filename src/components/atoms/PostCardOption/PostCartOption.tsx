'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useDeleteCommunityPost } from '@/services/community-post'
import { useDeleteUserPost } from '@/services/community-timeline'
import Link from 'next/link'

import React from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { HiOutlineBell, HiOutlineFlag } from 'react-icons/hi'
import { MdDeleteForever, MdOutlineBookmarkBorder, MdOutlineOpenInNew } from 'react-icons/md'

interface PostOptionType {
  postID: string
  isType: 'Community' | 'Timeline'
  isSelfPost: boolean
}

const PostCartOption = ({ postID, isType, isSelfPost }: PostOptionType) => {
  const { mutate: mutateDeletePost } = useDeleteUserPost()
  const { mutate: mutateDeleteCommunityPost } = useDeleteCommunityPost()

  const handleDeletePost = () => {
    if (isType === 'Community') {
      mutateDeleteCommunityPost(postID)
    }
    if (isType === 'Timeline') {
      mutateDeletePost(postID)
    }
  }
  return (
    <Popover>
      <PopoverTrigger>
        <FiMoreHorizontal />
      </PopoverTrigger>
      <PopoverContent className="relative right-16 bottom-16 w-auto p-5 border-none shadow-lg bg-white shadow-gray-light">
        <div className="flex flex-col gap-5">
          <div className="flex gap-1 items-center">
            <Link target="_blank" rel="noopener noreferrer" className="flex gap-1 items-center" href={`/post/${postID}?isType=${isType}`}>
              <MdOutlineOpenInNew className="text-primary" size={20} />
              <p className="font-medium text-sm">Open Post</p>
            </Link>
          </div>
          <div className="flex gap-2 items-center cursor-pointer">
            <MdOutlineBookmarkBorder className="text-primary" size={20} />
            <p className="font-medium text-sm">Save Post</p>
          </div>
          <div className="flex gap-2 items-center cursor-pointer">
            <HiOutlineBell className="text-primary" size={20} />
            <p className="font-medium text-sm">Mute Post from</p>
          </div>
          <div className="flex gap-2 items-center cursor-pointer">
            <HiOutlineFlag className="text-primary" size={20} />
            <p className="font-medium text-sm">Report this Post</p>
          </div>
          {isSelfPost && (
            <div onClick={handleDeletePost} className="flex gap-2 items-center cursor-pointer">
              <MdDeleteForever className="text-primary" size={20} />
              <p className="font-medium text-sm">Delete Post</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PostCartOption
