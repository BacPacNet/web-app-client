import { StateCreator } from 'zustand'
import { userProfileType } from './userProfileType'

type userProfileState = {
  userProfileData: userProfileType
}

type userProfileAction = {
  setUserProfileData: (userProfileData: userProfileType) => void
  resetUserProfileData: () => void
}

const initialState: userProfileState = {
  userProfileData: {
    _id: '',
    users_id: '',
    profile_dp: { imageUrl: '', publicId: '' },
    email: [{ UniversityName: '', UniversityEmail: '' }],
    cover_dp: { imageUrl: '', publicId: '' },
    bio: '',
    phone_number: '',
    dob: '',
    country: '',
    city: '',
    university_name: '',
    study_year: '',
    degree: '',
    major: '',
    affiliation: '',
    occupation: '',
    totalFilled: 0,
  },
}

export type userProfileSlice = userProfileState & userProfileAction

export const createUserProfileSlice: StateCreator<userProfileSlice> = (set) => ({
  userProfileData: initialState.userProfileData,
  setUserProfileData: (userProfileData: userProfileType) => set({ userProfileData }),
  resetUserProfileData: () => set(initialState),
})
