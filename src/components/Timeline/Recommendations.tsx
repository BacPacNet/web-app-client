/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils'
import React from 'react'

interface User {
  name: string
  university: string
  affilation: string
  avatar: string
}
interface Props {
  people: User[]
  userItemButtonStyle?: string
  containerStyle?: string
  itemStyle?: string
}

const UserCard = ({ user, buttonStyle, itemStyle }: { user: User; buttonStyle?: string; itemStyle?: string }) => {
  return (
    <div className={cn('flex justify-between sm:pr-7 lg:pr-0', itemStyle)}>
      <div className="flex gap-2 items-center">
        <img src={user.avatar} alt={`${user.name}'s avatar`} width={14} height={14} className="rounded-full w-10 h-10" />
        <div>
          <p className="font-medium text-xs text-gray-dark">{user.name}</p>
          <p className="text-[10px] text-gray-1 ">{user.university}</p>
          <p className="text-[10px] text-gray-1">{user.affilation}</p>
        </div>
      </div>
      <button
        className={cn(
          'bg-primary-50 text-primary text-center align-middle font-semibold text-xs px-3 rounded-xl hidden sm:block lg:hidden my-2',
          buttonStyle
        )}
      >
        Visit Profile
      </button>
    </div>
  )
}

const Recommendations: React.FC<Props> = ({ people, userItemButtonStyle, containerStyle, itemStyle }) => {
  return (
    <div className={cn('bg-white border-2 border-gray-dark rounded-lg py-5 px-7 shadow-md', containerStyle)}>
      <h1 className="text-sm font-semibold mb-4">Recommendations</h1>
      <div className="flex flex-col gap-6">
        {people.map((user) => (
          <UserCard user={user} key={`${user?.avatar}${user?.name}`} buttonStyle={userItemButtonStyle} itemStyle={itemStyle} />
        ))}
      </div>
    </div>
  )
}
// <userCard user={user} key={`${user?.avatar}${user?.name}`} buttonStyle={userItemButtonStyle} />
export default Recommendations
