import React from 'react'
import { Skeleton } from '../ui/Skeleton'

interface PostSkeletonProps {
  count?: number
}

const PostSkeleton: React.FC<PostSkeletonProps> = ({ count = 1 }) => {
  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg pt-2 pb-10 bg-slate-50 my-4">
          <div className="my-10 ml-10 flex gap-4 items-center">
            <Skeleton className="bg-slate-400 p-2 h-14 w-14 rounded-full" />
            <div>
              <Skeleton className="bg-slate-300 h-4 w-24" />
              <Skeleton className="mt-1 bg-slate-300 h-3 w-20" />
              <Skeleton className="mt-1 bg-slate-300 h-3 w-16" />
            </div>
          </div>
          <Skeleton className="mx-10 h-3 bg-slate-300" />
          <Skeleton className="mx-10 my-1 h-3 bg-slate-300" />
          <Skeleton className="mx-10 h-3 bg-slate-300" />
        </div>
      ))}
    </div>
  )
}

export default PostSkeleton
