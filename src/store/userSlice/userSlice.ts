import { StateCreator } from 'zustand'
import { userType } from './userType'

type userState = {
  userData: userType
}

type userAction = {
  setUserData: (userData: userType) => void
  resetUserData: () => void
}

const initialState: userState = {
  userData: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    // password: '',
    gender: '',
    dob: '',
    role: '',
    isEmailVerified: false,
    // createdAt: '',
    userVerifiedCommunities: [{ communityId: '', communityName: '', communityGroups: [{ communityGroupName: '', communityGroupId: '' }] }],
    userUnVerifiedCommunities: [{ communityId: '', communityName: '', communityGroups: [{ communityGroupName: '', communityGroupId: '' }] }],
  },
}

export type userSlice = userState & userAction

export const createUserSlice: StateCreator<userSlice> = (set) => ({
  userData: initialState.userData,
  setUserData: (userData: userType) => set({ userData }),
  resetUserData: () => set(initialState),
})
