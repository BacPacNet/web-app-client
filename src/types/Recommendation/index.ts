export interface GroupRecommendation {
  group_id: string
  name: string
  score: number
  communityId: string
  communityCoverUrl: string
  communityGroupLogoUrl: string
  communityGroupAccess: string
  communityGroupType: string
  communityGroupCategory: {
    [key: string]: string[]
  }
}
export interface UserRecommendations {
  name: string
  university: string
  study_year: string
  user_id: string
  major: string
  affiliation: string
  occupation: string
  score: number
  profile_image: string
}

export interface RecommendationData {
  name: string
  userName: string
  role: string
  major: string
  study_year: string
  university_name: string
  affiliation: string
  occupation: string
  score: number
  user_id: string
  profile_image: string
}

export interface RecommendationResponse {
  status: string
  code: number
  data: RecommendationData[]
  message: string
}

// Types for group recommendation data
export interface GroupRecommendationData {
  group_id: string
  name: string
  score: number
  communityId: string
  communityCoverUrl: string
  communityGroupLogoUrl: string
  communityGroupAccess: string
  communityGroupType: string
  communityGroupCategory: {
    [key: string]: string[]
  }
}

export interface GroupRecommendationResponse {
  status: string
  code: number
  data: GroupRecommendationData[]
  message: string
}
