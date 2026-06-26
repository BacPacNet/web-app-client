import { StateCreator } from 'zustand'
import { IsUserCommunityAdminResponse } from '@/types/User'

type userCommunityAdminState = {
  userCommunityAdmin: IsUserCommunityAdminResponse | null
}

type userCommunityAdminAction = {
  setUserCommunityAdmin: (data: IsUserCommunityAdminResponse | null) => void
  resetUserCommunityAdmin: () => void
}

const initialState: userCommunityAdminState = {
  userCommunityAdmin: null,
}

export type UserCommunityAdminSlice = userCommunityAdminState & userCommunityAdminAction

export const createUserCommunityAdminSlice: StateCreator<UserCommunityAdminSlice> = (set) => ({
  userCommunityAdmin: initialState.userCommunityAdmin,
  setUserCommunityAdmin: (data) => set({ userCommunityAdmin: data }),
  resetUserCommunityAdmin: () => set(initialState),
})
