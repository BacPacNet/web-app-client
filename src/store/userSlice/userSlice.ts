import { StateCreator } from 'zustand'
import { userType } from './userType'
import { User } from '@/models/auth'

type userState = {
  userData: Partial<userType> | null
}

type userAction = {
  setUserData: (userData: User) => void
  resetUserData: () => void
}

const initialState: userState = {
  userData: null,
}

export type userSlice = userState & userAction

export const createUserSlice: StateCreator<userSlice> = (set) => ({
  userData: initialState.userData,
  setUserData: (userData: User) => set((state) => ({ ...state, userData })),
  resetUserData: () => set(initialState),
})
