import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createUserSlice } from './userSlice/userSlice'
import { storeType } from './storeType'

export const useUniStore = create<storeType>()(
  devtools(
    persist(
      (...a) => ({
        ...createUserSlice(...a),
      }),
      {
        name: 'UniStore',
        // partialize: (state) => ({ products: state.products,userName:state.userName }),
        // skipHydration: true
      }
    )
  )
)
