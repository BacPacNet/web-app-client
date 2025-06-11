import { status } from '../CommuityGroup'

export interface UserLoginResponse {
  user: User
  tokens: Tokens
  userProfile: IUserProfileResponse
  Following: Following2
}

export interface User {
  firstName: string
  lastName: string
  userName: string
  email: string
  gender: string
  role: string
  isEmailVerified: boolean
  isUserDeactive: boolean
  userVerifiedCommunities?: any[]
  userUnVerifiedCommunities?: any[]
  id: string
}

export interface Tokens {
  access: Access
  refresh: Refresh
}

export interface Access {
  token: string
  expires: string
}

export interface Refresh {
  token: string
  expires: string
}

export interface ProfileDp {
  imageUrl: string
  publicId: string
}

export interface CommunityCoverUrl {
  imageUrl: string
}

export interface CommunityLogoUrl {
  imageUrl: string
}

export interface UserCommunityGroup {
  id: string
  status: status
}

export interface UserCommunities {
  communityId: string
  isVerified: boolean
  communityGroups: UserCommunityGroup[]
}

export interface Profile {
  _id: string
  users_id: string
  dob: string
  country: string
  city: string
  university_name: string
  university_id: string
  study_year: string
  degree: string
  major: string
  affiliation: string
  occupation: string
  role: string
  email: Email[]
  following: Following[]
  followers: Follower[]
  __v: number
  bio: string
  phone_number: string
  profile_dp: ProfileDp
  communities: UserCommunities
  universityLogo: string
  displayEmail: string
}

export interface CommunityDetail {
  _id: string
  communityCoverUrl: CommunityCoverUrl
  communityLogoUrl: CommunityLogoUrl
  name: string
  university_id: string
  users: User[]
  __v: number
  about: string
  communityGroups: any[]
  adminId?: string
}

export interface IUserProfileResponse {
  _id: string
  firstName: string
  lastName: string
  userName: string
  email: string
  gender: string
  role: string
  isEmailVerified: boolean
  isUserDeactive: boolean
  userVerifiedCommunities: any[]
  userUnVerifiedCommunities: any[]
  createdAt: string
  updatedAt: string
  __v: number
  profile: Profile
  communityDetails: CommunityDetail[]
}

export interface Email {
  UniversityName: string
  UniversityEmail?: string
  communityId?: string
  _id: string
}

export interface UniversityId {
  _id: string
  name: string
  country: string
  logos: string[]
  images: string[]
}

export interface Following {
  userId: string
  isBlock: boolean
  _id: string
}

export interface Follower {
  userId: string
  isBlock: boolean
  _id: string
}

export interface Following2 {
  followingCount: number
  followerCount: number
}
