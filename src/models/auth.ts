export interface LoginForm {
  email: string
  password: string
  rememberme?: string
}
export interface RegisterForm {
  firstName: string
  lastName: string
  userName: string
  email: string
  gender: string
  dob: any
  country: string
  city: string
  password: string
  confirmPassword: string // only for client side validation
  tnc: boolean // only for client side validation
}

export interface UserResponseType {
  user: User
  tokens: Tokens
  userProfile: UserProfile
}

interface verifiedInterface {
  communityId: string
  communityName: string
}
interface unverifiedInterface {
  communityId: string
  communityName: string
}

export interface User {
  firstName: string
  lastName: string
  email: string
  gender: string
  dob: string
  role: string
  isEmailVerified: boolean
  id: string
}
export interface EmailType {
  UniversityName: string
  UniversityEmail?: string
  communityId?: string
  _id: string
}

export interface UserProfile {
  users_id: string
  profile_dp?: {
    imageUrl: string
    publicId: string
  }
  email: EmailType[]
  bio?: string
  phone_number?: string
  dob?: string
  country?: string
  city?: string
  university_name?: string
  study_year?: string
  degree?: string
  major?: string
  affiliation?: string
  occupation?: string
  totalFilled: number
  _id: string
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
