import { ContentType } from '@/content/constant'
import { PostType } from '../constants'
import { Sortby } from '../common'

export type PostCommentProps = {
  showCommentSec: string
  setShowCommentSection: (value: string) => void
  setShowInitial: (value: boolean) => void
  showInitial: boolean
  handleProfileClicked: (adminId: string) => void
  postID: string
  type: PostType.Community | PostType.Timeline
  setImageCarasol: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean
      images: any
      currImageIndex: number | null
    }>
  >
  data: {
    user: string
    avatarLink: string
    date: string
    university: string
    year: string
    content: string
    type: PostType.Community | PostType.Timeline
    adminId: string
  }
  initialComment: any
  isReplyTrue?: boolean
  commentID?: string
  communityId?: string
  communityGroupId?: string
  contentType: ContentType
}

export type CommentsType = {
  _id: string
  replies: CommentsType
  likeCount: string[]
  level: number
  commenterId: {
    firstName: string
    lastName: string
    _id: string
  }
  commenterProfileId: {
    profile_dp: {
      imageUrl: string
    }
    major: string
    university_name: string
    study_year: string
    degree: string
    role: string
    affiliation: string
    occupation: string
  }
  content: string
  createdAt: string
  totalCount: string
  imageUrl: []
}[]

export interface CommentOptionType {
  commentId: string
  isType: 'Community' | 'Timeline'
  isSelfPost: boolean
  contentType: ContentType
  postID: string
  level: number
  parentCommentId?: string
}

export interface CommentType {
  _id: string
  commenterId: {
    firstName: string
    lastName: string
    _id?: string
    id?: string
  }
  commenterProfileId: {
    profile_dp?: {
      imageUrl: string
    }
    major?: string
    university_name?: string
    study_year?: string
    degree?: string
    role?: string
    affiliation?: string
    occupation?: string
    isCommunityAdmin?: boolean
    communities?: CommunityType[]
  }
  content: string
  createdAt: string
  likeCount: Array<{ userId: string | number }>
  level: number
  replies?: CommentType[]
  totalCount?: number
  imageUrl?: Array<{
    imageUrl: string | null
    publicId: string | null
  }>
  isCommentVerified?: boolean
}

export interface CommunityType {
  _id: string
  name: string
  logo: string
  isVerifiedMember: boolean
  isCommunityAdmin?: boolean
}

export interface CommentItemProps {
  comment: CommentType
  currentUserId: string | number
  postID: string
  type: PostType.Community | PostType.Timeline
  setImageCarasol: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean
      images: any
      currImageIndex: number | null
    }>
  >
  handleProfileClicked: (adminId: string) => void
  likeHandler: (commentId: string, level: string, sortBy: Sortby | null, isLiked: boolean) => void
  toggleCommentSection: (comment: CommentType) => void
  handleReplyClick: (comment: CommentType) => void
  showReplies: boolean
  childCommentsId: string[]
  sortBy: Sortby | null
  communities?: CommunityType[]
  contentType: ContentType
  parentCommentId?: string
}
