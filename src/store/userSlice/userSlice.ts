import { StateCreator } from 'zustand'
import { userType } from './userType'

type userState = {
  userData: Partial<userType>
}

type userAction = {
  setUserData: (userData: userType) => void
  resetUserData: () => void
  setUserVerifiedCommunities: (communities: userType['userVerifiedCommunities']) => void
  setUserUnVerifiedCommunities: (communities: userType['userUnVerifiedCommunities']) => void
}

const initialState: userState = {
  userData: {},
}

export type userSlice = userState & userAction

export const createUserSlice: StateCreator<userSlice> = (set) => ({
  userData: initialState.userData,
  setUserData: (userData: userType) => set({ userData }),
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
