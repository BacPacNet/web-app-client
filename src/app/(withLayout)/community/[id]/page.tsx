'use client'
import UniversityCard from '@/components/molecules/UniversityCard'
import PostContainer from '@/components/organisms/PostsContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType } from '@/types/constants'
import { useParams } from 'next/navigation'
import React from 'react'

const Community = () => {
  const { id } = useParams()
  return (
    <>
      <UniversityCard
        universityLogo={''}
        universityName={'Lorem University'}
        isAiPowered={true}
        joinedSince={'07/12/23'}
        description={
          'Official community page for Lorem University. For inquiries contact the Human Resources Department in B-Wing of Northern Campus.'
        }
        memberCount={200}
      />
      <UserPostContainer type={PostInputType.Community} />
      <PostContainer communityId={id} />
    </>
  )
}

export default Community
