import React from 'react'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import { IoIosArrowBack } from 'react-icons/io'
import { CiStar } from 'react-icons/ci'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { useAcceptGroupRequest, useAcceptRequest, useToggleBlockMessages, useToggleStarred } from '@/services/Messages'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { MdAddCircle } from 'react-icons/md'
import { MdBlockFlipped } from 'react-icons/md'
import { FaRegFlag } from 'react-icons/fa6'
import { FaStar } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
type Props = {
  setSelectedChat: (value: any) => void
  yourID: string
  users: User[]
  name: string
  isRequestNotAccepted: boolean
  isGroupChat: boolean
  chatId: string
  profileCover: string | undefined
  description: string
  studyYear: string
  universitry: string
  degree: string
  setAcceptedId: (value: string) => void
  setCurrTab: (value: string) => void
}

type User = {
  userId: {
    _id: string
    firstName: string
    lastName: string
  }
  isOnline?: boolean
  isStarred: boolean
}

const MessageUserStickyBar = ({
  setSelectedChat,
  users,
  yourID,
  name,
  isRequestNotAccepted,
  isGroupChat,
  chatId,
  profileCover,
  description,
  studyYear,
  degree,
  universitry,
  setAcceptedId,
  setCurrTab,
}: Props) => {
  const userName = users?.flat().filter((item) => item.userId._id != yourID)
  const YourDetails = users?.flat().filter((item) => item.userId._id == yourID)
  const { mutate: acceptRequest } = useAcceptRequest()
  const { mutate: acceptGroupRequest } = useAcceptGroupRequest()
  const { mutate: toggleStarred } = useToggleStarred()
  const { mutate: toggleBlockMessage } = useToggleBlockMessages(userName[0].userId._id)
  const router = useRouter()
  const handleMoveToInbox = () => {
    if (isGroupChat) {
      acceptGroupRequest({ chatId })
    } else {
      acceptRequest({ chatId })
    }
    setCurrTab('Inbox')
    setAcceptedId(chatId)
  }

  const handleStarred = () => {
    toggleStarred({ chatId })
  }

  const handleBack = () => {
    setSelectedChat(undefined)
    router.push('/messages')
  }

  return (
    <div className="fixed w-full top-0 z-10 flex justify-between border-b border-neutral-300 rounded-t-2xl bg-white py-2 px-4">
      <div className="flex items-center gap-4">
        <p onClick={() => handleBack()}>
          <IoIosArrowBack className="w-8 h-8 text-[#6744FF] cursor-pointer" />
        </p>
        <div className="relative">
          <Image src={profileCover || avatar} alt="dp" width={44} height={44} className="w-12 h-12 rounded-full" />
          <p
            className={`w-4 h-4 ${
              userName?.some((item) => item?.isOnline) ? 'bg-success-500' : 'bg-neutral-300'
            } rounded-full border-2 border-white absolute bottom-0 right-0 `}
          ></p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-700">{name}</h3>
          {isGroupChat ? (
            <p className="text-2xs font-normal text-neutral-500">{description}</p>
          ) : (
            <>
              <p className="text-2xs font-normal text-neutral-500">{universitry}</p>
              {/*<p className="text-2xs font-normal text-neutral-500">
                {studyYear} Yr. {degree}
              </p>*/}
            </>
          )}
        </div>
      </div>
      <div className="flex gap-4 items-center">
        {isRequestNotAccepted && (
          <button
            onClick={() => handleMoveToInbox()}
            className="bg-[#F3F2FF] border border-[#E9E8FF] text-primary-500 px-2 py-1 text-2xs font-medium rounded-lg drop-shadow-sm"
          >
            Move to inbox
          </button>
        )}
        {YourDetails[0]?.isStarred ? (
          <FaStar onClick={() => handleStarred()} className={`w-6 h-6 text-yellow-300`} />
        ) : (
          <CiStar onClick={() => handleStarred()} className={`w-6 h-6 `} />
        )}
        <Popover>
          <PopoverTrigger>
            <BiDotsHorizontalRounded className="w-8 h-8" />
          </PopoverTrigger>
          <PopoverContent className="p-0 relative drop-shadow-lg right-16 top-4 w-44 h-32 bg-white shadow-card border-none">
            <div className="text-2xs  text-neutral-700 font-medium flex flex-col justify-evenly items-center h-full w-full ps-10">
              <div className="flex gap-1 items-center   w-40 cursor-pointer">
                <MdAddCircle />
                <p>Invite Others to Chat </p>
              </div>
              <div onClick={() => toggleBlockMessage({ chatId })} className="flex gap-1 items-center   w-40 cursor-pointer">
                <MdBlockFlipped />
                <p>Block Messages </p>
              </div>
              <div className="flex gap-1 items-center  w-40 cursor-pointer">
                <FaRegFlag />
                <p>Report User Profile</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default MessageUserStickyBar
