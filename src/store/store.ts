import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createUserSlice } from './userSlice/userSlice'
import { createUserProfileSlice } from './userProfileSlice/userProfileSlice'
import { createSocketSlice } from './socketSlice/socketSlice'
import { storeType } from './storeType'

export const useUniStore = create<storeType>()(
  devtools(
    persist(
      (...a) => ({
        ...createUserSlice(...a),
        ...createUserProfileSlice(...a),
        ...createSocketSlice(...a),
      }),
      {
        name: 'store',
        partialize: (state) => ({
          ...state,
          socket: undefined, // Exclude socket from persisted state
        }),
        // partialize: (state) => ({ products: state.products,userName:state.userName }),
        // skipHydration: true
      }
    )
  )
)
