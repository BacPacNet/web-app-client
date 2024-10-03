import LeftNavWrapper from '@/components/molecules/LeftNavWrapper'
import UniversityCard from '@/components/molecules/UniversityCard'
import LeftNavbar from '@/components/organisms/LeftNavbar'
import PostContainer from '@/components/organisms/PostsContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType } from '@/types/constants'
import React from 'react'

export default function Timeline() {
  return (
    <LeftNavWrapper>
      <UserPostContainer type={PostInputType.Timeline} />
      {/* <PostContainer /> */}
    </LeftNavWrapper>
  )
}
