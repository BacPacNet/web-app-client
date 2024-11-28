'use client'
import SelectAIUniversityDropdown from '@/components/atoms/SelectAIUniversityDropdown.tsx'
import { useGetSubscribedCommunties } from '@/services/university-community'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { SlReload } from 'react-icons/sl'
import { IoIosArrowDown } from 'react-icons/io'
import Ai_AssistantInput from '@/components/atoms/AI_AssistantInput'
import Buttons from '@/components/atoms/Buttons'
import StartAIChat from '../AI_Section/StartAIChat'
import AINoUniversity from '../AI_Section/AINoUniversity'
import Spinner from '@/components/atoms/spinner'

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
  const [universityExist, setUniversityExist] = useState(false)
  const { data: subscribedCommunities, isFetching, isLoading, isPending } = useGetSubscribedCommunties()
  const otherUniversity = subscribedCommunities?.filter((item) => item._id !== selectedUniversity?._id)
  useEffect(() => {
    if (subscribedCommunities?.length) {
      setSelectedUniversity(subscribedCommunities[0])
    }
  }, [subscribedCommunities])

  if (isFetching || isPending) {
    return (
      <div className="bg-white mt-4 rounded-2xl drop-shadow-lg h-with-navbar-space flex  justify-center items-center pb-4 ">
        <Spinner />
      </div>
    )
  }

  if (!universityExist) {
    return (
      <div className="bg-white mt-4 rounded-2xl drop-shadow-lg py-10 flex flex-col justify-between pb-4 ">
        <AINoUniversity />
      </div>
    )
  }

  return (
    <div className="bg-white mt-4 rounded-2xl drop-shadow-lg h-with-navbar-space flex flex-col justify-between pb-4 ">
      <div className=" px-4 py-4   flex flex-col gap-9 relative border-b-[1px] border-neutral-200 font-poppins">
        <div className="flex justify-between">
          <div className="relative">
            <div className="flex items-center gap-2 text-2xs ">
              <Image
                width={20}
                height={20}
                className="w-6 h-6 rounded-full bg-white shadow-lg"
                src={selectedUniversity?.communityLogoUrl?.imageUrl || ''}
                alt={selectedUniversity?.name || 'img'}
              />
              <p>{selectedUniversity?.name}</p>
              <IoIosArrowDown className="cursor-pointer" onClick={() => setShow(!show)} />
            </div>

            <SelectAIUniversityDropdown data={otherUniversity || []} show={show} setShow={setShow} setSelectedUniversity={setSelectedUniversity} />
          </div>
          <p className="flex items-center gap-2 cursor-pointer">
            <SlReload className="text-primary-500" /> <span className="text-neutral-700 text-xs max-sm:hidden">Refresh Assistant</span>
          </p>
        </div>
      </div>
      {/* //main  */}
      <StartAIChat />
      {/* <AIChat /> */}

      {/* input      */}
      <div className="w-full flex justify-center relative">
        <Ai_AssistantInput className="pe-20" />
        <Buttons className="absolute right-[6%] top-1/2 -translate-y-1/2 w-14" variant="primary" size="extra_small_paddind_2">
          Ask
        </Buttons>
      </div>
    </div>
  )
}

export default Ai_AssistantContainer
