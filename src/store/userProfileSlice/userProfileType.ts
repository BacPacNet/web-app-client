interface emailType {
  UniversityName: string
  UniversityEmail: string
}

interface following {
  userId: string
}

export interface userProfileType {
  users_id: string
  profile_dp?: { imageUrl: string; publicId: string }
  email: emailType[]
  cover_dp?: { imageUrl: string; publicId: string }
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
  following: following[]
  followers: following[]
  totalFilled: number
  _id: string
}
