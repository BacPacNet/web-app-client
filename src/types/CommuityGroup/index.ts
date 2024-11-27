import mongoose from 'mongoose'

interface users {
  userId: mongoose.Types.ObjectId
  isRequestAccepted: boolean
  firstName: string
  lastName: string
  year: string
  degree: string
  major: string
}

export interface CommunityGroupType {
  _id: string
  adminUserId: AdminUserId | string
  communityId: string
  title: string
  description: string
  memberCount: number
  communityGroupType: string
  __v: number
  adminUserProfile: AdminUserProfile
  communityGroupLogoCoverUrl?: {
    imageUrl: string
    publicId: string
  }
  communityGroupLogoUrl?: {
    imageUrl: string
    publicId: string
  }
  users: users[]
}
export interface AdminUserId {
  _id: string
  firstName: string
  lastName: string
}
export interface AdminUserProfile {
  _id: string
  users_id: string
  email?: EmailEntity[] | null
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
  following?: null[] | null
  followers?: null[] | null
  __v: number
}
export interface EmailEntity {
  UniversityName: string
  UniversityEmail: string
  _id: string
}
