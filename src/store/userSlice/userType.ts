interface communityGroupsInterface {
  communityGroupName: string
  communityGroupId: string
  role: string
}

interface verifiedInterface {
  communityId: string
  communityName: string
  communityGroups: communityGroupsInterface[]
}
interface unverifiedInterface {
  communityId: string
  communityName: string
  communityGroups: communityGroupsInterface[]
}

export interface userType {
  id: string
  firstName: string
  lastName: string
  userName: string
  email: string
  gender: string
  dob: string
  role: string
  isEmailVerified: boolean
  isNewUser: boolean
  userVerifiedCommunities: verifiedInterface[]
  userUnVerifiedCommunities: unverifiedInterface[]
}
