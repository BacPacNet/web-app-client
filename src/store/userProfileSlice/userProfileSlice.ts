import { StateCreator } from 'zustand'
import { userProfileType } from './userProfileType'

type userProfileState = {
  userProfileData: Partial<userProfileType> | null
}

type userProfileAction = {
  setUserProfileData: (userProfileData: userProfileType) => void
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
  setUserProfileData: (userProfileData: userProfileType) => set({ userProfileData }),
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
