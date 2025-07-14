import { useCreateUserChat, useGetUserFollowingAndFollowers } from '@/services/Messages'
import Image from 'next/image'
import React, { useState } from 'react'
import avatar from '@assets/avatar.svg'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import Buttons from '@/components/atoms/Buttons'
import CreateGroupChat from '../CreateGroupChat'
import { useRouter } from 'next/navigation'
import { useModal } from '@/context/ModalContext'
type Props = {
  setSelectedChat: (value: any) => void
}

const UsersModal = ({ setSelectedChat }: Props) => {
  const [searchInput, setSearchInput] = useState('')
  const { data } = useGetUserFollowingAndFollowers(searchInput)
  const { mutateAsync: mutateCreateUserChat } = useCreateUserChat()
  const router = useRouter()
  const { openModal, closeModal } = useModal()
  const handleUserClick = async (userId: string) => {
    const createChatResponse: any = await mutateCreateUserChat({ userId: userId })

    setSelectedChat(createChatResponse)
    router.replace(`/messages?id=${createChatResponse._id}`)
    closeModal()
  }

  const handleShowModal = () => {
    closeModal()
    openModal(<CreateGroupChat setSelectedChat={setSelectedChat} />)
  }

  return (
    <div>
      <div className="h-96">
        <div className="relative w-full mt-4 mb-2 px-6">
          <FaMagnifyingGlass className="absolute top-1/2 -translate-y-1/2 left-10" />
          <input
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            type="text"
            placeholder="Search users by name"
            className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border border-neutral-300  rounded-lg"
          />
        </div>
        {data?.user?.map((data: any) => (
          <div
            key={data._id}
            onClick={() => handleUserClick(data._id)}
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
        <Buttons className="w-full sticky bottom-0" variant="shade" size="large" onClick={() => handleShowModal()}>
          Create Group
        </Buttons>
      </div>
    </div>
  )
}

interface OneToOneProps {
  setSelectedChat: (value: any) => void
}
const OneToChat = ({ setSelectedChat }: OneToOneProps) => {
  return <UsersModal setSelectedChat={setSelectedChat} />
}

export default OneToChat
