import { EmailType } from '@/models/auth'
import { userTypeEnum } from '@/types/RegisterForm'

interface following {
  userId: string
}

export interface userProfileType {
  users_id: string | null
  profile_dp?: { imageUrl: string; publicId: string }
  email: EmailType[]
  communities: { communityId: string; isVerified: string }[]
  cover_dp?: { imageUrl: string; publicId: string }
  bio?: string
  phone_number?: string
  dob?: string
  country?: string
  city?: string
  university_name?: string
  university_id: string
  role: userTypeEnum
  study_year?: string
  degree?: string
  major?: string
  affiliation?: string
  occupation?: string
  following: following[]
  followers: following[]
  totalFilled: number
  _id: string
  isFollowing: boolean
}
