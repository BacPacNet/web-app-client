import { StateCreator } from 'zustand'
import { IsUserCommunityAdminResponse } from '@/types/User'

type userCommunityAdminState = {
  userCommunityAdmin: IsUserCommunityAdminResponse | null
  university_id: string
  communityId: string
  universityName: string
}

type userCommunityAdminAction = {
  setUserCommunityAdmin: (data: IsUserCommunityAdminResponse | null) => void
  resetUserCommunityAdmin: () => void
}

const initialState: userCommunityAdminState = {
  userCommunityAdmin: null,
  university_id: '',
  communityId: '',
  universityName: '',
}

export type UserCommunityAdminSlice = userCommunityAdminState & userCommunityAdminAction

export const createUserCommunityAdminSlice: StateCreator<UserCommunityAdminSlice> = (set) => ({
  userCommunityAdmin: initialState.userCommunityAdmin,
  university_id: initialState.university_id,
  communityId: initialState.communityId,
  universityName: initialState.universityName,
  setUserCommunityAdmin: (data) =>
    set({
      userCommunityAdmin: data,
      university_id: data?.university_id ?? '',
      communityId: data?.communityId ?? '',
      universityName: data?.universityName ?? '',
    }),
  resetUserCommunityAdmin: () => set(initialState),
})
