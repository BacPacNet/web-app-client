'use client'
import { useGetUserFollowingAndFollowers } from '@/services/Messages'
import React, { useState } from 'react'
import SelectUsers from '../communityUniversity/SelectUsers'

type media = {
  imageUrl: string
  publicId: string
}
type User = {
  _id: string
  firstName: string
  isOnline?: boolean
  profile: {
    profile_dp: media
    _id: string
  }
}

type Props = {
  setSelectedUsers: (value: User[]) => void
  selectedUsers: User[]
}

const SelectGroupUsers = ({ setSelectedUsers, selectedUsers }: Props) => {
  const [searchInput, setSearchInput] = useState('')

  const { data } = useGetUserFollowingAndFollowers(searchInput)

  return (
    <>
      <div className=" w-full max-sm:w-11/12 z-50 h-3/4   top-[10%] bg-white flex flex-col items-center gap-6 shadow-lg px-10 py-6 rounded-lg">
        {/* search  */}
        <div className="relative w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            type="text"
            placeholder="Search users by name"
            className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border border-neutral-300  rounded-2xl"
          />
        </div>
        <button onClick={() => setSelectedUsers(data?.user)} className="self-end bg-slate-200 p-2 text-xs rounded-xl shadow-sm">
          Select All
        </button>
        {data?.user?.map((item: User) => (
          <SelectUsers key={item._id} data={item} setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} />
        ))}
      </div>
    </>
  )
}

export default SelectGroupUsers
