import PostContainer from '@/components/organisms/PostsContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType } from '@/types/constants'
import React from 'react'

export default function Timeline() {
  return (
    <>
      <UserPostContainer type={PostInputType.Timeline} />
      <PostContainer />
    </>
  )
}
