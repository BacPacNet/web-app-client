'use client'
import PostContainer from '@/components/organisms/PostsContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType, PostType } from '@/types/constants'
import React, { useEffect, useRef } from 'react'

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll">
      <UserPostContainer type={PostInputType.Timeline} />
      <PostContainer containerRef={containerRef} type={PostType.Timeline} />
    </div>
  )
}
