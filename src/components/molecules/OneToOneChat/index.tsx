import { useCreateUserChat, useGetUserFollowingAndFollowers } from '@/services/Messages'
import Image from 'next/image'
import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import avatar from '@assets/avatar.svg'
type Props = {
  setShowOneToOne: (value: boolean) => void
  setShowCreateGroup: (value: boolean) => void
  showOneToOne: boolean
}

const UsersModal = ({ setShowOneToOne, showOneToOne, setShowCreateGroup }: Props) => {
  const [searchInput, setSearchInput] = useState('')
  const { data } = useGetUserFollowingAndFollowers(searchInput)
  const { mutate: createUserChat } = useCreateUserChat()
  console.log('users', data)

  return (
    <>
      <div
        onClick={() => setShowOneToOne(false)}
        className="fixed    w-full  h-full  top-0 left-0 bg-[#f3f2ff] backdrop-blur-2xl  opacity-50 z-30 "
      ></div>

      {showOneToOne && (
        <>
          <div className="fixed   w-full h-screen top-0 left-0 bg-[#f3f2ff] backdrop-blur-xl opacity-50 z-30"></div>

          <div className="fixed w-1/2 max-sm:w-11/12 z-50 min-h-[400px]   top-[10%] left-1/3 bg-white flex flex-col items-center gap-6 shadow-lg px-10 py-4 rounded-lg">
            <div className="flex justify-between w-full">
              <h3>Select User</h3>
              <RxCross2 onClick={() => setShowOneToOne(false)} size={24} color="#737373" />
            </div>
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
            {data?.user?.map((data: any) => (
              <div
                key={data._id}
                onClick={() => createUserChat({ userId: data._id })}
                className="flex justify-between w-full hover:bg-neutral-200 px-2 rounded-xl py-2"
              >
                <div className="flex items-center gap-2">
                  <Image src={data?.profile?.profile_dp?.imageUrl || avatar} alt="dp" width={44} height={44} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold">{data?.firstName}</p>
                    <p className="text-xs ">{data?.profile?.university_name ? data?.profile?.university_name : 'Not Availaible'}</p>
                    <p className="text-xs">
                      {data?.profile?.study_year} {data?.profile?.study_year ? 'Year' : ''} {data?.profile?.degree}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <p
              className=" bottom-10 cursor-pointer text-sm text-primary-500"
              onClick={() => {
                setShowCreateGroup(true), setShowOneToOne(false)
              }}
            >
              Go to Create group
            </p>
          </div>
        </>
      )}
    </>
  )
}

interface onetoone {
  setShowOneToOne: (value: boolean) => void
  setShowCreateGroup: (value: boolean) => void
  showOneToOne: boolean
}
const OneToChat = ({ setShowOneToOne, showOneToOne, setShowCreateGroup }: onetoone) => {
  return <UsersModal setShowOneToOne={setShowOneToOne} showOneToOne={showOneToOne} setShowCreateGroup={setShowCreateGroup} />
}

export default OneToChat
