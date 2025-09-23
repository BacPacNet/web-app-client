'use client'
import DeleteModal from '@/components/molecules/DeleteModal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useModal } from '@/context/ModalContext'
import { useDeleteCommunityPost } from '@/services/community-post'
import { useDeleteUserPost } from '@/services/community-timeline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import React, { useState } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)
  const { openModal } = useModal()
  const router = useRouter()

  const handleDeletePost = () => {
    openModal(
      <DeleteModal
        entityName={'this post'}
        onDelete={() => {
          if (isType === 'Community') {
            mutateDeleteCommunityPost(postID)
          }
          if (isType === 'Timeline') {
            mutateDeletePost(postID)
          }
        }}
      />,
      'h-auto'
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <FiMoreHorizontal />
      </PopoverTrigger>
      <PopoverContent onClick={() => setIsOpen(false)} className="relative top-0 right-16 w-auto border-none  bg-white shadow-card p-0">
        <div className="flex flex-col">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1 items-center hover:bg-slate-200 px-3 py-2 "
            href={`/post/${postID}?isType=${isType}`}
          >
            <MdOutlineOpenInNew className="text-primary" size={16} />
            <p className="font-medium text-xs text-neutral-800">Open Post</p>
          </Link>

          {/* <div className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 px-3 py-2">
            <HiOutlineFlag className="text-primary" size={16} />
            <p className="font-medium text-xs text-neutral-800">Report this Post</p>
          </div> */}
          {isSelfPost && (
            <div onClick={handleDeletePost} className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 px-3 py-2">
              <MdDeleteForever className="text-primary" size={16} />
              <p className="font-medium text-xs text-neutral-800">Delete Post</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PostCartOption
