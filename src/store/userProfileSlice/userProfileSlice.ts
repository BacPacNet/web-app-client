import { StateCreator } from 'zustand'
import { userProfileType } from './userProfileType'
import { UserProfile } from '@/models/auth'

type userProfileState = {
  userProfileData: Partial<userProfileType> | null
}

type userProfileAction = {
  setUserProfileData: (userProfileData: UserProfile) => void
  setUserFollowers: (communities: userProfileType['followers']) => void
  setUserfollowing: (communities: userProfileType['following']) => void
}

const initialState: userProfileState = {
  userProfileData: null,
  // userProfileData: {},
}

export type userProfileSlice = userProfileState & userProfileAction

export const createUserProfileSlice: StateCreator<userProfileSlice> = (set) => ({
  userProfileData: initialState.userProfileData,
  setUserProfileData: (userProfileData: UserProfile) => set((state) => ({ ...state, userProfileData })),
  setUserFollowers: (followers: any) =>
    set((state) => ({
      userProfileData: {
        ...state.userProfileData,
        followers: followers,
      },
    })),
  setUserfollowing: (followings: any) =>
    set((state) => ({
      userProfileData: {
        ...state.userProfileData,
        following: followings,
      },
    })),
})
