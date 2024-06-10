interface emailType {
  UniversityName: string
  UniversityEmail: string
}

export interface userProfileType {
  users_id: string
  profile_dp?: string
  email: emailType[]
  cover_dp?: string
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
