import { StateCreator } from 'zustand'
import { userType } from './userType'
import { User } from '@/models/auth'

type userState = {
  // userData: Partial<userType>
  userData: Partial<userType> | null
}

type userAction = {
  setUserData: (userData: User) => void
  resetUserData: () => void
  setUserVerifiedCommunities: (communities: userType['userVerifiedCommunities']) => void
  setUserUnVerifiedCommunities: (communities: userType['userUnVerifiedCommunities']) => void
}

const initialState: userState = {
  // userData: {},
  userData: null,
}

export type userSlice = userState & userAction

export const createUserSlice: StateCreator<userSlice> = (set) => ({
  userData: initialState.userData,
  setUserData: (userData: User) => set((state) => ({ ...state, userData })),
  resetUserData: () => set(initialState),
  setUserVerifiedCommunities: (communities) =>
    set((state) => ({
      userData: {
        ...state.userData,
        userVerifiedCommunities: communities,
      },
    })),
  setUserUnVerifiedCommunities: (communities) =>
    set((state) => ({
      userData: {
        ...state.userData,
        userUnVerifiedCommunities: communities,
      },
    })),
})
