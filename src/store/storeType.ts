import { userSlice } from './userSlice/userSlice'
import { userProfileSlice } from './userProfileSlice/userProfileSlice'
import { userFollowingSlice } from './userFollowingSlice/userFollowingSlice'

export type storeType = userSlice & userProfileSlice & userFollowingSlice
