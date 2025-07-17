'use client'
import DeleteModal from '@/components/molecules/DeleteModal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useModal } from '@/context/ModalContext'
import { useDeleteUserPostComment } from '@/services/community-timeline'
import { useDeleteCommunityPostComment } from '@/services/community-university'

import React, { useState } from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { MdDeleteForever } from 'react-icons/md'

interface CommentOptionType {
  commentId: string
  isType: 'Community' | 'Timeline'
  isSelfPost: boolean
}

const CommentCardOption = ({ commentId, isType, isSelfPost }: CommentOptionType) => {
  const [isOpen, setIsOpen] = useState(false)
  const { openModal } = useModal()

  const { mutate: deleteUserPostComment } = useDeleteUserPostComment()
  const { mutate: deleteCommunityPostComment } = useDeleteCommunityPostComment()

  const handleDeletePost = () => {
    openModal(
      <DeleteModal
        entityName={'this comment'}
        onDelete={() => {
          if (isType === 'Community') {
            deleteCommunityPostComment(commentId)
          }
          if (isType === 'Timeline') {
            deleteUserPostComment(commentId)
          }
        }}
      />,
      'h-auto'
    )
  }
  if (!isSelfPost) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <FiMoreHorizontal />
      </PopoverTrigger>
      <PopoverContent onClick={() => setIsOpen(false)} className="relative top-0 right-8 w-auto border-none shadow-card  bg-white p-0">
        <div className="flex flex-col">
          <div onClick={handleDeletePost} className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 px-3 py-2 rounded-md">
            <MdDeleteForever className="text-primary" size={16} />
            <p className="font-medium text-xs text-neutral-800">Delete</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CommentCardOption
