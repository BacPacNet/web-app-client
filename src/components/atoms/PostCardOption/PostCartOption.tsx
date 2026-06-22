'use client'
import DeleteModal from '@/components/molecules/DeleteModal'
import PromotePostModal from '@/components/molecules/PromotePostModal'
import ReportContentModal from '@/components/molecules/ReportContentModal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { ContentType } from '@/content/constant'
import { useModal } from '@/context/ModalContext'
import { useDeleteCommunityPost } from '@/services/community-post'
import { useDeleteUserPost } from '@/services/community-timeline'
import { useUniStore } from '@/store/store'
import { PostPromote } from '@/types/Community'
import Image from 'next/image'
import Link from 'next/link'

import React, { useState } from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { HiOutlineFlag } from 'react-icons/hi'
import { MdDeleteForever, MdOutlineOpenInNew } from 'react-icons/md'
import publicIcon from '@assets/post/globe.svg'

interface PostOptionType {
  postID: string
  isType: 'Community' | 'Timeline'
  isSelfPost: boolean
  postType: ContentType
  promote?: PostPromote
  universityName?: string
}

const PostCartOption = ({ postID, isType, isSelfPost, postType, promote, universityName }: PostOptionType) => {
  const { mutate: mutateDeletePost } = useDeleteUserPost()
  const { mutate: mutateDeleteCommunityPost } = useDeleteCommunityPost()
  const [isOpen, setIsOpen] = useState(false)
  const { openModal } = useModal()
  const { userData } = useUniStore()

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

  const handleReportPost = () => {
    openModal(<ReportContentModal postID={postID} reporterId={userData?.id || ''} contentType={postType} />, 'h-auto', false)
  }

  const handlePromotePost = () => {
    if (!promote?.universityId) return
    openModal(
      <PromotePostModal
        postID={postID}
        isType={isType}
        universityId={promote.universityId}
        universityName={universityName || ''}
      />,
      'h-auto ',
      false
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <FiMoreHorizontal />
      </PopoverTrigger>
      <PopoverContent onClick={() => setIsOpen(false)} className="relative top-0 right-16 w-auto border-none  bg-white shadow-card p-0">
        <div className="flex flex-col">
          {promote?.isAdminOfUni && (
            <div onClick={handlePromotePost} className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 px-3 py-2">
              <Image src={publicIcon} alt="promote" width={16} height={16} />
              <p className="font-medium text-xs text-neutral-800">Promote This Post</p>
            </div>
          )}

          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-1 items-center hover:bg-slate-200 px-3 py-2 "
            href={`/post/${postID}?isType=${isType}`}
          >
            <MdOutlineOpenInNew className="text-primary" size={16} />
            <p className="font-medium text-xs text-neutral-800">Open Post</p>
          </Link>

          {!isSelfPost && (
            <div onClick={handleReportPost} className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 px-3 py-2">
              <HiOutlineFlag className="text-primary" size={16} />
              <p className="font-medium text-xs text-neutral-800">Report this Post</p>
            </div>
          )}
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
