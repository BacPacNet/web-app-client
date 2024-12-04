'use client'
import PostContainer from '@/components/organisms/PostsContainer'
import TimelinePostContainer from '@/components/organisms/TimelinePostContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType, PostType } from '@/types/constants'
import React, { useRef } from 'react'

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll hideScrollbar">
      <UserPostContainer type={PostInputType.Timeline} />
      <TimelinePostContainer containerRef={containerRef} />
    </div>
  )
}
