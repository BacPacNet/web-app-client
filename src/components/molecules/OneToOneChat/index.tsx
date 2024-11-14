import { useCreateUserChat, useGetUserFollowingAndFollowers } from '@/services/Messages'
import Image from 'next/image'
import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import avatar from '@assets/avatar.svg'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import Buttons from '@/components/atoms/Buttons'
type Props = {
  setShowOneToOne: (value: boolean) => void
  setShowCreateGroup: (value: boolean) => void
  showOneToOne: boolean
  setSelectedChat: (value: any) => void
}

const UsersModal = ({ setShowOneToOne, showOneToOne, setShowCreateGroup, setSelectedChat }: Props) => {
  const [searchInput, setSearchInput] = useState('')
  const { data } = useGetUserFollowingAndFollowers(searchInput)
  const { mutate: mutateCreateUserChat } = useCreateUserChat()

  const handleUserClick = async () => {
    setShowOneToOne(false)
    const createChatResponse = mutateCreateUserChat({ userId: data._id })
    console.log(createChatResponse, 'createChatResponse')
    setSelectedChat(createChatResponse)
  }

  return (
    <div>
      {/*<div onClick={() => setShowOneToOne(false)} className="fixed w-full h-full top-0 left-0 bg-[#f3f2ff] backdrop-blur-2xl  opacity-50 z-30 "></div>*/}

      {showOneToOne && (
        <>
          {/*<div className="fixed w-full h-screen top-0 left-0 bg-[#f3f2ff] backdrop-blur-xl opacity-50 z-30"></div>*/}
          <div className="h-[500px] overflow-y-auto w-[90%] lg:w-[70%]  left-1/2 transform -translate-x-1/2  mx-auto fixed z-50 bg-white pt-4 flex flex-col items-center shadow-lg rounded-lg">
            <div className="absolute top-1 right-2">
              <RxCross2 onClick={() => setShowOneToOne(false)} size={24} color="#737373" />
            </div>

            <div className="relative w-full mt-4 mb-2 px-6">
              <FaMagnifyingGlass className="absolute top-1/2 -translate-y-1/2 left-10" />
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
                onClick={() => handleUserClick()}
                className="flex justify-between w-full hover:bg-neutral-200 px-6 py-2 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <Image src={data?.profile?.profile_dp?.imageUrl || avatar} alt="dp" width={44} height={44} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold">{data?.firstName}</p>
                    <p className="text-2xs text-neutral-600">{data?.profile?.university_name ? data?.profile?.university_name : ''}</p>
                    <p className="text-2xs text-neutral-600">
                      {data?.profile?.study_year} {data?.profile?.study_year ? 'Year' : ''} {data?.profile?.degree}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <Buttons
              className="w-full sticky bottom-0"
              variant="shade"
              onClick={() => {
                setShowCreateGroup(true), setShowOneToOne(false)
              }}
            >
              Create Group
            </Buttons>
          </div>
        </>
      )}
    </div>
  )
}

interface OneToOneProps {
  setShowOneToOne: (value: boolean) => void
  setShowCreateGroup: (value: boolean) => void
  showOneToOne: boolean
  setSelectedChat: (value: any) => void
}
const OneToChat = ({ setShowOneToOne, showOneToOne, setShowCreateGroup, setSelectedChat }: OneToOneProps) => {
  return (
    <UsersModal
      setSelectedChat={setSelectedChat}
      setShowOneToOne={setShowOneToOne}
      showOneToOne={showOneToOne}
      setShowCreateGroup={setShowCreateGroup}
    />
  )
}

export default OneToChat
