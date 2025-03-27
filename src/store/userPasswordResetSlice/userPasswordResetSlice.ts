import { StateCreator } from 'zustand'
let tokenTimeout: NodeJS.Timeout | null = null

interface UserPasswordResetState {
  resetEmail: string
  resetToken: string
  resetPassword: string
}

interface UserPasswordResetAction {
  setResetPasswordEmail: (email: string) => void
  setResetPasswordToken: (token: string) => void
  setResetPassword: (password: string) => void
  setResetPasswordData: (data: Partial<UserPasswordResetState>) => void
  resetPasswordResetData: () => void
  reinitResetPasswordTimeout: () => void
}

export type UserPasswordResetSlice = UserPasswordResetState & UserPasswordResetAction

const initialState: UserPasswordResetState = {
  resetEmail: '',
  resetToken: '',
  resetPassword: '',
}

export const createUserPasswordResetSlice: StateCreator<UserPasswordResetSlice> = (set, get) => ({
  ...initialState,

  setResetPasswordEmail: (email) =>
    set(() => ({
      resetEmail: email,
    })),

  //   setResetPasswordToken: (token) =>
  //     set(() => ({
  //       token,
  //     })),

  setResetPasswordToken: (token) => {
    // Clear any existing timeout
    if (tokenTimeout) {
      clearTimeout(tokenTimeout)
    }

    // Set the token
    set(() => ({ resetToken: token }))

    tokenTimeout = setTimeout(() => {
      set(() => ({ resetToken: '' }))
      console.log('Token expired and cleared.')
    }, 300 * 1000)
  },

  reinitResetPasswordTimeout: () => {
    const token = get().resetToken
    if (token && !tokenTimeout) {
      tokenTimeout = setTimeout(() => {
        set(() => ({ resetToken: '' }))
      }, 300 * 1000)
    }
  },

  setResetPassword: (password) =>
    set(() => ({
      resetPassword: password,
    })),

  setResetPasswordData: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  resetPasswordResetData: () =>
    set(() => ({
      ...initialState,
    })),
})
