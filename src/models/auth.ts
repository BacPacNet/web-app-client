export interface LoginForm {
  email: string
  password: string
}
export interface RegisterForm {
  firstname: string
  lastname: string
  email: string
  gender: string
  birthday: any
  country: string
  city: string
  password: string
  confirmPassword: string
  tnc: boolean | string
}

export interface UserResponseType {
  user: User
  tokens: Tokens
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
  userVerifiedCommunities: verifiedInterface[]
  userUnVerifiedCommunities: unverifiedInterface[]
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
