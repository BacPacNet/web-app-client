import { PostType } from '../constants'

export type PostCommentProps = {
  showCommentSec: string
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
