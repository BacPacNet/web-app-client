/* eslint-disable @next/next/no-img-element */
import React from 'react'

interface User {
  name: string
  university: string
  affilation: string
  avatar: string
}
interface Props {
  people: User[]
}

const userCard = (user: User) => {
  return (
    <div className="flex gap-2 items-center">
      <img src={user.avatar} alt={`${user.name}'s avatar`} width={14} height={14} className="rounded-full w-10 h-10" />
      <div>
        <p className="font-medium text-xs text-gray-dark">{user.name}</p>
        <p className="text-[10px] text-gray-1 ">{user.university}</p>
        <p className="text-[10px] text-gray-1">{user.affilation}</p>
      </div>
    </div>
  )
}

const Recommendations: React.FC<Props> = ({ people }) => {
  return (
    <div className="bg-white border-2 border-gray-dark rounded-lg py-5 pl-7 shadow-md">
      <h1 className="text-sm font-semibold mb-4">Recommendations</h1>
      <div className="flex flex-col gap-6">{people.map((user) => userCard(user))}</div>
    </div>
  )
}

export default Recommendations
