export interface Community {
  _id: string
  communityLogoUrl: {
    imageUrl: string
    publicId?: string
  }
  communityCoverUrl: {
    imageUrl: string
    publicId?: string
  }
  name: string
  collegeID: string
  adminId: string
  numberOfUser: number
  numberOfStudent: number
  numberOfFaculty: number
  about: string
  communityGroups: CommunityGroup[]
}

export interface CommunityGroup {
  _id: string
  adminUserId: string
  communityId: string
  communityGroupLogoUrl: {
    imageUrl: string
    publicId?: string
  }
  communityGroupLogoCoverUrl: {
    imageUrl: string
    publicId?: string
  }
  title: string
  memberCount: number
  communityGroupType: string
  about: string
}
