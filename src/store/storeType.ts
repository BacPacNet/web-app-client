import { userSlice } from './userSlice/userSlice'
import { userProfileSlice } from './userProfileSlice/userProfileSlice'

import { SocketSlice } from './socketSlice/socketSlice'
import { ChatBotSlice } from './chatbotSlice/chatbotSlice'

// export type storeType = userSlice & userProfileSlice & SocketSlice
export type storeType = userSlice &
  userProfileSlice &
  ChatBotSlice &
  SocketSlice & {
    reset: () => void
  }
