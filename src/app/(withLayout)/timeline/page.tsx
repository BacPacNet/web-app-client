'use client'
import TimelineCreatePost from '@/components/organisms/TimelineCreatePost'
import TimelinePostContainer from '@/components/organisms/TimelinePostContainer'
import React, { useRef } from 'react'

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll hideScrollbar outline-none pt-4">
      <TimelineCreatePost />
      <TimelinePostContainer containerRef={containerRef} />
    </div>
  )
}
