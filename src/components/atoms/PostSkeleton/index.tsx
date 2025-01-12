import React from 'react'

function PostSkeleton() {
  return (
    <div>
      <div className="p-4 border border-neutral-300 rounded-xl shadow-card animate-pulse">
        {/* Title */}
        <div className="h-6 bg-neutral-300 rounded w-3/4 mb-4"></div>

        {/* Image */}
        <div className="h-48 bg-neutral-300 rounded mb-4"></div>

        {/* Content lines */}
        <div className="space-y-2">
          <div className="h-4 bg-neutral-300rounded w-full"></div>
          <div className="h-4 bg-neutral-300rounded w-5/6"></div>
          <div className="h-4 bg-neutral-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  )
}

export default PostSkeleton
