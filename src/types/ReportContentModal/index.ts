import { ContentType } from '@/content/constant'

export type ReportContentModalProps = {
  postID: string
  reporterId: string
  contentType: ContentType
  commentId?: string
  parentCommentId?: string
}
