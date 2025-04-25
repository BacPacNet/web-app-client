'use client'

import { useCreateUserChat, useGetUserFollowingAndFollowers } from '@/services/Messages'
import Image from 'next/image'

import React, { useEffect, useRef, useState } from 'react'
import avatar from '@assets/avatar.svg'
import InputBox from '@/components/atoms/Input/InputBox'
import { useRouter } from 'next/navigation'

type Props = {
  selectedUser: any
  setSelectedUser: (value: any) => void
}
const IndividualUsers = ({ selectedUser, setSelectedUser }: Props) => {
  const [searchInput, setSearchInput] = useState('')
  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(false)
  //   const [selectedUser, setSelectedUser] = useState<any>()
  const { data } = useGetUserFollowingAndFollowers(searchInput)
  const { mutateAsync: mutateCreateUserChat } = useCreateUserChat()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSelectUsers(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  console.log('seele', selectedUser)

  return (
    <div className="relative w-full flex flex-col">
      <label htmlFor="inviteFriends" className="font-medium text-sm text-neutral-900 mb-2">
        Add Individuals
      </label>
      <div>
        <InputBox
          isCancel={true}
          onCancel={() => setShowSelectUsers(false)}
          onClick={() => setShowSelectUsers(true)}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder="Search Users"
        />

        {showSelectUsers && (
          <div ref={dropdownRef} className="w-full mt-2 rounded-b-lg shadow-xl bg-white max-h-64 overflow-y-auto">
            {data?.user?.length > 0 ? (
              data.user.map((user: any) => (
                <div
                  key={user._id}
                  // onClick={() => handleUserClick(user._id)}
                  onClick={() => {
                    setShowSelectUsers(false)
                    setSelectedUser(user)
                  }}
                  className="flex justify-between w-full hover:bg-neutral-200 px-6 py-2 cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={user?.profile?.profile_dp?.imageUrl || avatar}
                      alt="dp"
                      width={44}
                      height={44}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold">{user?.firstName}</p>
                      <p className="text-2xs text-neutral-600">{user?.profile?.university_name || ''}</p>
                      <p className="text-2xs text-neutral-600">
                        {user?.profile?.study_year ? `${user.profile.study_year} Year` : ''} {user?.profile?.degree}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-neutral-500 py-4">No users found.</p>
            )}
          </div>
        )}

        {selectedUser?.firstName ? (
          <div className="flex items-center gap-4 mt-4">
            <Image
              src={selectedUser?.profile?.profile_dp?.imageUrl || avatar}
              alt="dp"
              width={44}
              height={44}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{selectedUser?.firstName}</p>
              <p className="text-2xs text-neutral-600">{selectedUser?.profile?.university_name || ''}</p>
              <p className="text-2xs text-neutral-600">
                {selectedUser?.profile?.study_year ? `${selectedUser.profile.study_year} Year` : ''} {selectedUser?.profile?.degree}
              </p>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default IndividualUsers
