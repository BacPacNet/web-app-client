import { userSlice } from './userSlice/userSlice'
import { userProfileSlice } from './userProfileSlice/userProfileSlice'

import { SocketSlice } from './socketSlice/socketSlice'
import { ChatBotSlice } from './chatbotSlice/chatbotSlice'
import { UserPasswordResetSlice } from './userPasswordResetSlice/userPasswordResetSlice'
import { UserEligibleForRewardsSlice } from './userEligibleForRewardsSlice/userEligibleForRewardsSlice'

// export type storeType = userSlice & userProfileSlice & SocketSlice
export type storeType = userSlice &
  userProfileSlice &
  ChatBotSlice &
  UserPasswordResetSlice &
  UserEligibleForRewardsSlice &
  SocketSlice & {
    reset: () => void
  }
