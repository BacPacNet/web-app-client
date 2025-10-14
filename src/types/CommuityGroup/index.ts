import mongoose from 'mongoose'
import { userTypeEnum } from '../RegisterForm'
import { S3UploadItem } from '@/services/upload'

export const AllFiltersCommunityGroupPost = {
  myPosts: 'Your Posts',
  pendingPosts: 'Pending Posts',
  allPosts: 'All Posts',
}
export enum communityPostStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  REJECTED = 'REJECTED',
  DEFAULT = 'DEFAULT',
}
export interface CommunityGroupUsers {
  //  userId: string
  _id: string
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
  communityGroupLogoUrl: S3UploadItem | null
  communityGroupLogoCoverUrl: S3UploadItem | null
  selectedUsers: CommunityGroupUsers[]
  studentYear: []
  //   studentYear:""
  major: []
  occupation: []
  affiliation: []
  repostOption: string
  community: { name: string; id: string }
  communityLabel: string
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
  notificationId: string
  notificationTypes: string
  notificationStatus: string
  status: status
  communityId: {
    _id: string
    communityLogoUrl: {
      imageUrl: string
      publicId: string
    }
    adminId: string[]
    name: string
  }
  title: string
  description: string
  communityName?: string
  communityGroupName?: string
  memberCount: number
  communityGroupType: string
  communityGroupAccess: string
  communityGroupCategory: any
  communityGroupLabel: string
  __v: number
  adminUserProfile: AdminUserProfile
  communityGroupLogoCoverUrl?: S3UploadItem | null
  communityGroupLogoUrl?: S3UploadItem | null
  users: CommunityGroupUsers[]
  isCommunityGroupLive: boolean
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

export type CommunityGroupNotLiveCardProps = {
  communityAdminId: string[]
  communityGroupId: string
  communityGroupAdminId: string
  notificationType: string
  notificationId: string
  notificationStatus: string
  refetch: () => void
  communityID: string

  communityGroupTitle: string
  communityName: string
}

export type Category =
  | 'Academic'
  | 'Educational'
  | 'Interest'
  | 'Events & Activities'
  | 'Personal Growth'
  | 'Advocacy and Awareness'
  | 'Professional Development'
  | 'Utility & Campus Life'

export const categories: Category[] = [
  'Academic',
  'Educational',
  'Interest',
  'Events & Activities',
  'Personal Growth',
  'Advocacy and Awareness',
  'Professional Development',
  'Utility & Campus Life',
]

export const subCategories: Record<Category, string[]> = {
  Academic: [
    'Science',
    'Technology',
    'Arts and Humanities',
    'Social Sciences',
    'Education',
    'Business and Economics',
    'Health & Medicine',
    'Environmental Studies',
    'Laws & Policy',
    'Mathematics & Statistics',
    'Engineering',
    'Coding',
    'Robotics',
    'Philosophy & Religion',
    'Literature & Language',
    'Agriculture',
    'Architecture & Design',
    'Media & Communication',
    'Hospitality & Tourism',
    'Other',
  ],
  Educational: ['Course Discussion', 'Exam Prep', 'Study Materials', 'Research', 'Study Group', 'Peer Tutoring', 'Other'],
  Interest: [
    'Sports & Fitness',
    'Music & Performing Arts',
    'Gaming & Esports',
    'Outdoor Activities',
    'Crafting & DIY',
    'Culinary Arts',
    'Media',
    'Dance',
    'Travel & Exploration',
    'Literature',
    'Culture',
    'Finance & Advice',
    'Language Learning',
    'Memes & Fun',
    'Other',
  ],
  'Events & Activities': ['Fest', 'Competition', 'Talks & Webinar', 'Workshop', 'Social Meetup', 'Event Organizing', 'Volunteering', 'Other'],
  'Personal Growth': [
    'Mindfulness & Meditation',
    'Physical Health',
    'Leadership Development',
    'Stress Management',
    'Public Speaking',
    'Confidence Building',
    'Sex Education',
    'Other',
  ],
  'Advocacy and Awareness': [
    'Environmental Conservation',
    'Human Rights',
    'Gender Equality',
    'LGBTQ+',
    'Mental Health',
    'Animal Welfare',
    'Political Activism',
    'Other',
  ],
  'Professional Development': [
    'Entrepreneurship & Startups',
    'Career Mentorship',
    'Professional Workshops',
    'Internships',
    'Networking & Mixers',
    'Job Hunting',
    'Certificates & Licenses',
    'Other',
  ],
  'Utility & Campus Life': [
    'Cab Sharing',
    'Housing & Roommates',
    'Buy/Sell/Exchange',
    'Lost & Found',
    'Local Services',
    'Student Hacks',
    'Study Exchange',
    'Study Abroad',
    'Alumni Connections',
    'Other',
  ],
}

// export const sortBy = ['name', 'latest', 'users', 'oldest']
