/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils'
import React from 'react'
import Button from '../atoms/Buttons'
import Image from 'next/image'

interface User {
  name: string
  university: string
  study_year: string
  avatar: any
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
        <Image src={user.avatar} alt={`${user.name}'s avatar`} width={14} height={14} className="rounded-full w-10 h-10" />
        <div>
          <p className="font-medium text-xs text-gray-dark">{user.name}</p>
          <p className="text-[10px] text-gray-1">{user.study_year}</p>
          <p className="text-[10px] text-gray-1 ">{user.university}</p>
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
    <div>
      <p className="text-xs text-neutral-500 font-bold py-2 pb-4">GROW YOUR NETWORK</p>
      <div className="flex flex-col gap-4">
        {people.map((user, index) => (
          <div key={index} className="border-b border-neutral-200 pb-4">
            <UserCard user={user} key={`${user?.avatar}${user?.name}`} />
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-500 font-bold mt-4">JOIN GROUPS</p>
      {people.map((user, index) => (
        <div key={index} className="border-b border-neutral-200">
          <div className="flex py-4 justify-between items-center">
            <div className="flex gap-2 items-center">
              <Image src={user.avatar} alt={`${user.name}'s avatar`} width={14} height={14} className="rounded-full w-10 h-10" />
              <div>
                <p className="font-medium text-xs text-gray-dark">{user.name}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
export default Recommendations
