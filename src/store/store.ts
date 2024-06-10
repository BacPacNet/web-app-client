import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createUserSlice } from './userSlice/userSlice'
import { createUserProfileSlice } from './userProfileSlice/userProfileSlice'
import { createUserFollowingSlice } from './userFollowingSlice/userFollowingSlice'
import { storeType } from './storeType'

export const useUniStore = create<storeType>()(
  devtools(
    persist(
      (...a) => ({
        ...createUserSlice(...a),
        ...createUserProfileSlice(...a),
        ...createUserFollowingSlice(...a),
      }),
      {
        name: 'store',
        // partialize: (state) => ({ products: state.products,userName:state.userName }),
        // skipHydration: true
      }
    )
  )
)
