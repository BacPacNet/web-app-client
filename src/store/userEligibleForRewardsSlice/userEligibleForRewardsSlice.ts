import { StateCreator } from 'zustand'
import { EligibleForRewardsResponse } from '@/types/User'

type userEligibleForRewardsState = {
  userEligibleForRewards: EligibleForRewardsResponse | null
}

type userEligibleForRewardsAction = {
  setUserEligibleForRewards: (data: EligibleForRewardsResponse | null) => void
  resetUserEligibleForRewards: () => void
}

const initialState: userEligibleForRewardsState = {
  userEligibleForRewards: null,
}

export type UserEligibleForRewardsSlice = userEligibleForRewardsState & userEligibleForRewardsAction

export const createUserEligibleForRewardsSlice: StateCreator<UserEligibleForRewardsSlice> = (set) => ({
  userEligibleForRewards: initialState.userEligibleForRewards,
  setUserEligibleForRewards: (data) => set({ userEligibleForRewards: data }),
  resetUserEligibleForRewards: () => set(initialState),
})
