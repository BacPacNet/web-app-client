export interface UserLoginResponse {
  user: User
  tokens: Tokens
  userProfile: UserProfile
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

export interface UserProfile {
  _id: string
  users_id: string
  email: Email[]
  dob: string
  country: string
  city: string
  university_name: string
  university_id: UniversityId
  study_year: string
  degree: string
  major: string
  affiliation: string
  occupation: string
  following: Following[]
  followers: Follower[]
  __v: number
  phone_number: string
  bio: string
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
