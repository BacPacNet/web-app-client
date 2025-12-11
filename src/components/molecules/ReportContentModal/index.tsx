import Buttons from '@/components/atoms/Buttons'
import { ContentType } from '@/content/constant'
import { useModal } from '@/context/ModalContext'
import { useCreateReportContent } from '@/services/report-content'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ReportContentModalProps } from '@/types/ReportContentModal'

const ReportContentModal = ({ postID, contentType, reporterId, commentId, parentCommentId }: ReportContentModalProps) => {
  const { mutate: mutateCreateReportContent } = useCreateReportContent()
  const { closeModal } = useModal()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const currDescription = watch('description')
  const onSubmit = (data: any) => {
    const payload = {
      reporterId,
      contentType,
      description: data.description,
      ...(contentType === ContentType.USER_POST && { userPostId: postID }),
      ...(contentType === ContentType.COMMUNITY_POST && { communityPostId: postID }),
      ...(contentType === ContentType.COMMUNITY_GROUP_POST && { communityPostId: postID }),
      ...(commentId && contentType === ContentType.USER_COMMENT && { userPostId: postID, userPostCommentId: commentId }),
      ...(commentId &&
        contentType === ContentType.USER_REPLY && { userPostId: postID, userPostCommentId: parentCommentId, userPostReplyId: commentId }),
      ...(commentId && contentType === ContentType.COMMUNITY_COMMENT && { communityPostId: postID, communityPostCommentId: commentId }),
      ...(commentId &&
        contentType === ContentType.COMMUNITY_REPLY && {
          communityPostId: postID,
          communityPostCommentId: parentCommentId,
          communityPostReplyId: commentId,
        }),
      ...(commentId && contentType === ContentType.COMMUNITY_GROUP_COMMENT && { communityPostId: postID, communityPostCommentId: commentId }),
      ...(commentId &&
        contentType === ContentType.COMMUNITY_GROUP_REPLY && {
          communityPostId: postID,
          communityPostCommentId: parentCommentId,
          communityPostReplyId: commentId,
        }),
    }

    mutateCreateReportContent(payload, {
      onSuccess: () => {
        closeModal()
      },
    })
  }

  const validateDescription = (value: string | undefined): string | boolean => {
    if (!value || value.trim() === '') return true
    const trimmedValue = value.trim()
    const charCount = trimmedValue.length
    if (charCount > 480) return 'Description must not exceed 480 characters'
    return true
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center gap-1 w-80 sm:w-[395px]">
      <div className="w-full flex justify-between items-center">
        <p className="font-medium text-xs text-neutral-700">Report Form</p>
        <p className="text-xs text-neutral-500 font-normal">{currDescription?.trim()?.length || 0}/480</p>
      </div>

      <div className="w-full ">
        <textarea
          {...register('description', { validate: validateDescription })}
          placeholder="Tell us what happened"
          className="text-base w-full border pl-3 py-2 rounded-lg border-neutral-200 font-normal h-[170px] resize-none outline-none"
          maxLength={480}
        />
        {errors.description && <span className="text-red-500 font-normal">{errors.description.message?.toString()}</span>}
      </div>
      <div className="flex justify-end w-full">
        <Buttons size="medium" variant="danger">
          Send Report
        </Buttons>
      </div>
    </form>
  )
}

export default ReportContentModal
