import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { createUserSlice } from './userSlice/userSlice'
import { createUserProfileSlice } from './userProfileSlice/userProfileSlice'
import { createSocketSlice } from './socketSlice/socketSlice'
import { storeType } from './storeType'
import { createChatbotSlice } from './chatbotSlice/chatbotSlice'
import { createUserPasswordResetSlice } from './userPasswordResetSlice/userPasswordResetSlice'

let finalCookie: any = null
let hasResetPasswordToken = false

if (typeof document !== 'undefined') {
  const cookieValue = document.cookie.split('; ').find((row) => row.startsWith('uni_user_token='))
  finalCookie = cookieValue ? cookieValue.split('=')[1] : null

  const rawStore = localStorage.getItem('store')

  const parsedStore = rawStore ? JSON.parse(rawStore) : null

  const token = parsedStore?.state?.resetToken

  hasResetPasswordToken = !!token
}

export const useUniStore = create<storeType>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createUserSlice(set, get, api),
        ...createUserProfileSlice(set, get, api),
        ...createSocketSlice(set, get, api),
        ...createChatbotSlice(set, get, api),
        ...createUserPasswordResetSlice(set, get, api),
        reset: () => set({ userData: null, userProfileData: null, chatbotData: [] }),
      }),
      {
        name: 'store',
        partialize: (state) => ({
          ...state,
          socket: undefined, // Exclude socket from persisted state
        }),
        storage: createJSONStorage(() => localStorage),
        skipHydration: !finalCookie && !hasResetPasswordToken,
      }
    )
  )
)
