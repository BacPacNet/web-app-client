import mongoose from 'mongoose'
import { userTypeEnum } from '../RegisterForm'

export interface CommunityGroupUsers {
  userId: mongoose.Types.ObjectId | string
  isRequestAccepted: boolean
  firstName: string
  lastName: string
  year: string
  degree: string
  major: string
  status: status
  occupation: string
  affiliation: string
  role: userTypeEnum
  profileImageUrl: string
}
export enum CommunityGroupTypeEnum {
  CASUAL = 'casual',
  OFFICIAL = 'official',
}

export enum CommunityGroupVisibility {
  PUBLIC = 'Public',
  PRIVATE = 'Private',
}

export interface CreateCommunityGroupType {
  title: string
  description: string
  communityGroupType: string
  communityGroupAccess: string
  selectedGroupCategory: string | null
  groupSubCategory: Array<string>
  communityGroupLogoUrl: {
    imageUrl: string
    publicId: string
  } | null
  communityGroupLogoCoverUrl: {
    imageUrl: string
    publicId: string
  } | null
  selectedUsers: CommunityGroupUsers[]
  studentYear: []
  //   studentYear:""
  major: []
  occupation: []
  affiliation: []
  repostOption: string
}

export enum status {
  pending = 'pending',
  rejected = 'rejected',
  accepted = 'accepted',
  default = 'default',
}

export interface CommunityGroupType {
  _id: string
  adminUserId: AdminUserId | string
  status: status
  communityId: {
    _id: string
    communityLogoUrl: {
      imageUrl: string
      publicId: string
    }
  }
  title: string
  description: string
  communityName?: string
  communityGroupName?: string
  memberCount: number
  communityGroupType: string
  communityGroupAccess: string
  communityGroupCategory: any
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
  users: CommunityGroupUsers[]
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

export type Category =
  | 'Academic Focus'
  | 'Recreation and Hobbies'
  | 'Advocacy and Awareness'
  | 'Personal Growth'
  | 'Professional Development'
  | 'Others'

export const categories: Category[] = [
  'Academic Focus',
  'Recreation and Hobbies',
  'Advocacy and Awareness',
  'Personal Growth',
  'Professional Development',
  'Others',
]

export const subCategories: Record<Category, string[]> = {
  'Academic Focus': [
    'Science & Technology',
    'Arts & Humanities',
    'Social Sciences',
    'Education',
    'Business & Economics',
    'Health & Medicine',
    'Environmental Studies',
    'Law & Policy',
    'Mathematics & Statistics',
    'Engineering',
  ],
  'Recreation and Hobbies': [
    'Sports & Fitness',
    'Music & Performing Arts',
    'Gaming & Esports',
    'Outdoor Activities',
    'Crafting & DIY',
    'Culinary Arts',
    'Media Arts',
    'Dance',
    'Travel & Exploration',
    'Literature & Writing',
    'Others',
  ],
  'Advocacy and Awareness': [
    'Environmental Conservation',
    'Human Rights',
    'Gender Equality',
    'LGBTQ+ Advocacy',
    'Mental Health',
    'Disability Rights',
    'Animal Welfare',
    'Political Activism',
    'Scientific Education',
    'Others',
  ],
  'Personal Growth': [
    'Mindfulness & Meditation',
    'Physical Health',
    'Leadership Development',
    'Finance Advice',
    'Stress Management',
    'Public Speaking',
    'Confidence Building',
    'Sex Education',
    'Language Learning',
    'Others',
  ],
  'Professional Development': [
    'Entrepreneurship & Startups',
    'Career Mentorship',
    'Professional Workshops',
    'Internships',
    'Networking & Mixers',
    'Alumni Connections',
    'Job Hunting',
    'Certificates',
    'Business Communication',
    'Others',
  ],
  Others: [],
}

export const sortBy = ['name', 'latest', 'users', 'oldest']
