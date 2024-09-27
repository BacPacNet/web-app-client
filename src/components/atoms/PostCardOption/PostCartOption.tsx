'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import Link from 'next/link'

import React from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { HiOutlineBell, HiOutlineFlag } from 'react-icons/hi'
import { MdOutlineBookmarkBorder, MdOutlineOpenInNew } from 'react-icons/md'

interface PostOptionType {
  postID: string
  isType: string
}

const PostCartOption = ({ postID, isType }: PostOptionType) => {
  return (
    <Popover>
      <PopoverTrigger>
        <FiMoreHorizontal />
      </PopoverTrigger>
      <PopoverContent className="relative right-16 bottom-16 w-auto p-5 border-none shadow-lg bg-white shadow-gray-light">
        <div className="flex flex-col gap-5">
          <div className="flex gap-1 items-center">
            <Link className="flex gap-1 items-center" href={`/post/${postID}?isType=${isType}`}>
              <MdOutlineOpenInNew className="text-primary" size={20} />
              <p className="font-medium text-sm">Open Post</p>
            </Link>
          </div>
          <div className="flex gap-1 items-center">
            <MdOutlineBookmarkBorder className="text-primary" size={20} />
            <p className="font-medium text-sm">Save Post</p>
          </div>
          <div className="flex gap-1 items-center">
            <HiOutlineBell className="text-primary" size={20} />
            <p className="font-medium text-sm">Mute Post from</p>
          </div>
          <div className="flex gap-1 items-center">
            <HiOutlineFlag className="text-primary" size={20} />
            <p className="font-medium text-sm">Report this Post</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PostCartOption
