import { StateCreator } from 'zustand'
import { userFollowType } from './userFollowingType'

type userFollowingState = {
  userFollowingData: userFollowType
}

type userFollowingAction = {
  setUserFollowingData: (userProfileData: userFollowType) => void
  resetUserFollowingData: () => void
}

const initialState: userFollowingState = {
  userFollowingData: {
    followerCount: 0,
    followingCount: 0,
  },
}

export type userFollowingSlice = userFollowingState & userFollowingAction

export const createUserFollowingSlice: StateCreator<userFollowingSlice> = (set) => ({
  userFollowingData: initialState.userFollowingData,
  setUserFollowingData: (userFollowingData: userFollowType) => set({ userFollowingData }),
  resetUserFollowingData: () => set(initialState),
})
