'use client'
import TimelinePostContainer from '@/components/organisms/TimelinePostContainer'
import UserPostForm from '@/components/organisms/userPostForm'
import { PostInputType } from '@/types/constants'
import React, { useRef } from 'react'

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="h-with-navbar hideScrollbar">
      <UserPostForm type={PostInputType.Timeline} />
      {/*<UserPostContainer type={PostInputType.Timeline} />*/}
      <TimelinePostContainer containerRef={containerRef} />
    </div>
  )
}
