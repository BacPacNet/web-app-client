import React from 'react'
import { Skeleton } from '../ui/Skeleton'
const UserListItemSkeleton = () => {
  return (
    <div className=" rounded-lg  ">
      <div className="my-2 ml-2  flex gap-8 items-center ">
        <Skeleton className=" bg-slate-400 p-2 h-14 w-14 rounded-full" />
        <div>
          <Skeleton className="bg-slate-300 h-4 w-40" />
          <Skeleton className="mt-1 bg-slate-300 h-3 w-20" />
          <Skeleton className="mt-1 bg-slate-300 h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

export default UserListItemSkeleton
