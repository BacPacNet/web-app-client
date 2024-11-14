/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils'
import React from 'react'
import Button from '../atoms/Buttons'

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

const UserCard = ({ user }: { user: User }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <img src={user.avatar} alt={`${user.name}'s avatar`} width={14} height={14} className="rounded-full w-10 h-10" />
        <div>
          <p className="font-medium text-xs text-gray-dark">{user.name}</p>
          <p className="text-[10px] text-gray-1 ">{user.university}</p>
          <p className="text-[10px] text-gray-1">{user.affilation}</p>
        </div>
      </div>
      <div>
        {/*<Button variant="border" size="extra_small">
          Following
        </Button>*/}
        <Button variant="shade" size="extra_small">
          Follow
        </Button>
      </div>
    </div>
  )
}

const Recommendations: React.FC<Props> = ({ people, userItemButtonStyle, containerStyle, itemStyle }) => {
  return (
    <div className="py-4">
      <p className="text-neutral-700 text-xs font-semibold py-4">Recommendations</p>
      <div className="flex flex-col gap-6">
        {people.map((user) => (
          <UserCard user={user} key={`${user?.avatar}${user?.name}`} />
        ))}
      </div>
    </div>
  )
}
// <userCard user={user} key={`${user?.avatar}${user?.name}`} buttonStyle={userItemButtonStyle} />
export default Recommendations
