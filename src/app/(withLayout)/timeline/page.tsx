import PostContainer from '@/components/organisms/PostsContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType, PostType } from '@/types/constants'
import React from 'react'

export default function Timeline() {
  return (
    <div className="h-with-navbar overflow-hidden">
      <UserPostContainer type={PostInputType.Timeline} />
      <PostContainer type={PostType.Timeline} />
    </div>
  )
}
