import { userSlice } from './userSlice/userSlice'
import { userProfileSlice } from './userProfileSlice/userProfileSlice'

import { SocketSlice } from './socketSlice/socketSlice'

export type storeType = userSlice & userProfileSlice & SocketSlice
