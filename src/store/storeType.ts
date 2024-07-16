import { userSlice } from './userSlice/userSlice'
import { userProfileSlice } from './userProfileSlice/userProfileSlice'
import { userFollowingSlice } from './userFollowingSlice/userFollowingSlice'
import { SocketSlice } from './socketSlice/socketSlice'

export type storeType = userSlice & userProfileSlice & userFollowingSlice & SocketSlice
