'use client'
import DeleteModal from '@/components/molecules/DeleteModal'
import ReportContentModal from '@/components/molecules/ReportContentModal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { ContentType as ContentTypeEnum } from '@/content/constant'
import { useModal } from '@/context/ModalContext'
import { useDeleteUserPostComment } from '@/services/community-timeline'
import { useDeleteCommunityPostComment } from '@/services/community-university'
import { useUniStore } from '@/store/store'
import { CommentOptionType } from '@/types/CommentPost'
import React, { useMemo, useState } from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import { HiOutlineFlag } from 'react-icons/hi'
import { MdDeleteForever } from 'react-icons/md'

const CommentCardOption = ({ commentId, isType, isSelfPost, contentType, postID, level, parentCommentId }: CommentOptionType) => {
  const [isOpen, setIsOpen] = useState(false)
  const { openModal } = useModal()
  const { userData } = useUniStore()
  const { mutate: deleteUserPostComment } = useDeleteUserPostComment()
  const { mutate: deleteCommunityPostComment } = useDeleteCommunityPostComment()

  const commentCategory = useMemo(() => {
    if (contentType === ContentTypeEnum.COMMUNITY_POST && level == 0) {
      return ContentTypeEnum.COMMUNITY_COMMENT
    }
    if (contentType === ContentTypeEnum.COMMUNITY_POST && level == 1) {
      return ContentTypeEnum.COMMUNITY_REPLY
    }
    if (contentType === ContentTypeEnum.COMMUNITY_GROUP_POST && level == 0) {
      return ContentTypeEnum.COMMUNITY_GROUP_COMMENT
    }
    if (contentType === ContentTypeEnum.COMMUNITY_GROUP_POST && level == 1) {
      return ContentTypeEnum.COMMUNITY_GROUP_REPLY
    }
    if (contentType === ContentTypeEnum.USER_POST && level == 0) {
      return ContentTypeEnum.USER_COMMENT
    }
    if (contentType === ContentTypeEnum.USER_POST && level == 1) {
      return ContentTypeEnum.USER_REPLY
    }
  }, [level, contentType])

  const handleReportPost = () => {
    openModal(
      <ReportContentModal
        postID={postID}
        reporterId={userData?.id || ''}
        contentType={commentCategory as ContentTypeEnum}
        commentId={commentId}
        parentCommentId={parentCommentId || ''}
      />,
      'h-auto',
      false
    )
  }

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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="p-1">
        <FiMoreHorizontal />
      </PopoverTrigger>
      <PopoverContent onClick={() => setIsOpen(false)} className="relative top-0 right-8 w-auto border-none shadow-card  bg-white p-0">
        <div className="flex flex-col">
          {!isSelfPost && (
            <div onClick={handleReportPost} className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 px-3 py-2 rounded-md">
              <HiOutlineFlag className="text-primary" size={16} />
              <p className="font-medium text-xs text-neutral-800">Report</p>
            </div>
          )}
          {isSelfPost && (
            <div onClick={handleDeletePost} className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 px-3 py-2 rounded-md">
              <MdDeleteForever className="text-primary" size={16} />
              <p className="font-medium text-xs text-neutral-800">Delete</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CommentCardOption
