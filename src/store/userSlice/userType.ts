interface verifiedInterface {
  communityId: string
  communityName: string
}
interface unverifiedInterface {
  communityId: string
  communityName: string
}

export interface userType {
  firstName: string
  lastName: string
  email: string
  // password: string
  gender: string
  dob: string
  role: string
  isEmailVerified: boolean
  // createdAt: Date | string
  userVerifiedCommunities: verifiedInterface[]
  userUnVerifiedCommunities: unverifiedInterface[]
}
