import React from 'react'
import { Skeleton } from '../ui/Skeleton'

interface UserListItemSkeletonProps {
  count?: number
  className?: string
}

const UserListItemSkeleton: React.FC<UserListItemSkeletonProps> = ({ count = 1, className }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${className} rounded-lg`}>
          <div className="my-4 ml-2 flex gap-2 items-center">
            <Skeleton className="bg-slate-400 p-2 h-14 w-14 rounded-full flex-none" />
            <div>
              <Skeleton className="bg-slate-300 h-4 w-40" />
              <Skeleton className="mt-1 bg-slate-300 h-3 w-20" />
              <Skeleton className="mt-1 bg-slate-300 h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default UserListItemSkeleton
