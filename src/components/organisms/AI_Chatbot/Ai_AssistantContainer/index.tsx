'use client'
import SelectAIUniversityDropdown from '@/components/atoms/SelectAIUniversityDropdown.tsx'
import { useGetSubscribedCommunties } from '@/services/university-community'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { SlReload } from 'react-icons/sl'
import { IoIosArrowDown } from 'react-icons/io'
import AINoUniversity from '../AI_Section/AINoUniversity'
import Spinner from '@/components/atoms/spinner'
import universityLogoPlaceholder from '@assets/unibuzz_rounded.svg'
import AIChat from '../AI_Section/AIChat'
import { useUniStore } from '@/store/store'
import { useCheckAssistantAvailable } from '@/services/chatbot'
import Buttons from '@/components/atoms/Buttons'

type dataType = {
  _id: string
  communityLogoUrl: {
    imageUrl: string
  }
  name: string
}
const Ai_AssistantContainer = () => {
  const [selectedUniversity, setSelectedUniversity] = useState<dataType>()
  const [show, setShow] = useState(false)
  const { data: isAssistantExist, isLoading: isAssistantLoading, refetch } = useCheckAssistantAvailable(selectedUniversity?._id || '')

  const { data: subscribedCommunities, isLoading } = useGetSubscribedCommunties()
  const otherUniversity = subscribedCommunities?.filter((item) => item._id !== selectedUniversity?._id)
  const { chatbotData, setChatbotData, resetChatbotData } = useUniStore()

  const handleRefresh = () => {
    resetChatbotData()
  }

  useEffect(() => {
    refetch()
  }, [selectedUniversity])

  useEffect(() => {
    if (subscribedCommunities?.length) {
      setSelectedUniversity(subscribedCommunities[0])
    }
  }, [subscribedCommunities])

  const UniversityDropdown = () => {
    return (
      <div className="relative">
        <div className="flex items-center gap-2 text-2xs cursor-pointer" onClick={() => setShow(!show)}>
          <div className=" flex  items-center gap-3 ">
            <Image
              width={48}
              height={48}
              className="w-12 h-12 object-contain rounded-full shadow-logo p-1"
              src={selectedUniversity?.communityLogoUrl?.imageUrl || universityLogoPlaceholder}
              alt="logo"
            />
          </div>
          <p className="text-xs text-neutral-500">{selectedUniversity?.name}</p>
          <IoIosArrowDown className="cursor-pointer w-7 h-8 text-neutral-800" />
        </div>

        <SelectAIUniversityDropdown data={otherUniversity || []} show={show} setShow={setShow} setSelectedUniversity={setSelectedUniversity} />
      </div>
    )
  }

  if (isLoading || isAssistantLoading) {
    return (
      <div className="bg-white mt-4 rounded-2xl drop-shadow-lg h-with-navbar-space flex  justify-center items-center pb-4 ">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl drop-shadow-lg h-with-navbar-space flex flex-col p-6 ">
      <div className=" pb-4   flex flex-col gap-9 relative border-b-[1px] border-neutral-200 font-poppins ">
        <div className="flex justify-between">
          <div className="relative">
            <UniversityDropdown />
          </div>
          <Buttons
            disabled={!isAssistantExist?.isAssistantAvailable}
            size="medium"
            variant="shade"
            className="flex items-center gap-1"
            onClick={handleRefresh}
          >
            <span>Refresh</span>
            <SlReload />
          </Buttons>
        </div>
      </div>
      {isAssistantExist?.isAssistantAvailable ? (
        <AIChat chatbotData={chatbotData} setChatbotData={setChatbotData} communityId={selectedUniversity?._id || ''} />
      ) : (
        <AINoUniversity communityId={subscribedCommunities ? subscribedCommunities![0].university_id : ''} />
      )}
    </div>
  )
}

export default Ai_AssistantContainer
