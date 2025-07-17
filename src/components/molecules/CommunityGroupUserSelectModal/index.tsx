'use client'
import SelectUsers from '@/components/communityUniversity/SelectUsers'
import { useGetCommunity } from '@/services/community-university'
import React, { useCallback, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
type Props = {
  setSelectedUsers: (value: string[]) => void
  communityId: string
  selectedUsersId: string[]
}

const CommunityGroupUserSelectModal = ({ setSelectedUsers, communityId, selectedUsersId }: Props) => {
  const [searchInput, setSearchInput] = useState('')

  const { data: communityData } = useGetCommunity(communityId)

  const handleSelectAll = useCallback(() => {
    const getAlluserIds = communityData?.users?.map((user) => user?._id)
    setSelectedUsers(getAlluserIds as string[])
  }, [])

  return (
    <div className="h-96">
      <div className="flex justify-between w-full ">
        <h3>Add Community members</h3>
      </div>
      {/* search  */}
      <div className="relative w-full">
        <IoSearch className="absolute top-2 left-2" />
        <input
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          type="text"
          placeholder="Search users by name"
          className="w-full pl-12 pr-3 py-1 text-gray-500 bg-transparent outline-none border border-neutral-300 rounded-2xl text-xs"
        />
      </div>
      <div className="flex justify-end mt-2">
        <button onClick={handleSelectAll} className=" bg-slate-200 px-4 py-1 text-xs rounded-xl shadow-sm">
          Select All
        </button>
      </div>
      {communityData?.users?.map((user) => (
        <SelectUsers
          key={user?._id}
          userID={user?._id || ''}
          user={user}
          setSelectedUsers={setSelectedUsers}
          selectedUsers={selectedUsersId as string[]}
        />
      ))}
    </div>
  )
}

export default CommunityGroupUserSelectModal
