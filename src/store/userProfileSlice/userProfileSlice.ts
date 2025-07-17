import { StateCreator } from 'zustand'
import { userProfileType } from './userProfileType'
import { UserProfile } from '@/models/auth'
import { UserCommunities } from '@/types/User'

type userProfileState = {
  userProfileData: Partial<userProfileType> | null
}

type userProfileAction = {
  setUserProfileData: (userProfileData: UserProfile) => void
  setUserFollowers: (communities: userProfileType['followers']) => void
  setUserfollowing: (communities: userProfileType['following']) => void
  setUserProfileCommunities: (communities: UserCommunities[]) => void
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
  setUserProfileCommunities: (communities: UserCommunities[]) =>
    set((state) => ({
      userProfileData: {
        ...state.userProfileData,
        communities: communities,
      },
    })),
})
