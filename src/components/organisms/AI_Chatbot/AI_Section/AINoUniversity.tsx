import React, { useState } from 'react'
import aibot from '@/assets/chatbot/mainBot.svg'
import Image from 'next/image'
import SettingsText from '@/components/atoms/SettingsText'
import SupportingText from '@/components/atoms/SupportingText'
import Buttons from '@/components/atoms/Buttons'
import { useCreateEndorsementAI, useGetEndorsementAI, useGetEndorsementAIOfUser } from '@/services/endorsement-ai'

const AINoUniversity = ({ communityId }: { communityId: string }) => {
  return (
    <div className="w-full flex justify-center items-center h-full ">
      <div className="flex max-md:flex-col h-full gap-4 justify-center max-md:items-center w-full">
        <Image src={aibot} alt="bot" width={40} height={40} className="h-80 w-1/3 max-md:h-60 max-sm:h-52 max-sm:w-60" />
        <div className="w-1/2 max-md:w-11/12 flex flex-col gap-5 justify-center">
          <SettingsText className="text-[24px] font-poppins">Sorry! It seems your university doesn’t support our AI Assistant!</SettingsText>
          <SupportingText className="text-neutral-700 font-poppins">
            Let them know you would like it to have this feature for your university! Your voice matters!
          </SupportingText>
          <EndorsementTracker communityId={communityId} />
        </div>
      </div>
    </div>
  )
}

export default AINoUniversity

const EndorsementTracker = ({ communityId }: { communityId: string }) => {
  const [endorsedCount, setEndorsedCount] = useState(440)
  const [endorsed, setEndorsed] = useState(false)
  const targetGoal = 1000
  const { data: endorsement } = useGetEndorsementAI(communityId)
  const { data: endorsementUser } = useGetEndorsementAIOfUser(communityId)
  const { mutate: mutateEndorse } = useCreateEndorsementAI()

  const progressPercentage = Math.floor((endorsedCount / targetGoal) * 100)

  const handleEndorseClick = () => {
    mutateEndorse(communityId)
    setEndorsed(true)
  }

  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex justify-between">
        <SettingsText className="text-sm">{endorsement?.totalUsersEndorsed} Have Endorsed</SettingsText>
        <SettingsText className="text-sm">{endorsement?.percentage}%</SettingsText>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden ">
        <div
          className="bg-primary-500 h-6 text-white text-sm font-medium text-center flex items-center justify-center"
          style={{ width: `${endorsement?.percentage}%` }}
          role="progressbar"
          aria-valuenow={endorsement?.totalUsersEndorsed}
          aria-valuemin={0}
          aria-valuemax={endorsement?.totalGoal}
        ></div>
      </div>
      <SupportingText className="text-neutral-700">Target goal: {endorsement?.totalGoal} students</SupportingText>
      <div className="flex justify-end">
        {endorsementUser?.isAlreadyEndorse ? (
          <Buttons onClick={() => handleEndorseClick()} disabled={endorsed} className=" w-24" variant="border" size="extra_small_paddind_2">
            <span className="text-neutral-400">Thank You!</span>
          </Buttons>
        ) : (
          <Buttons onClick={() => handleEndorseClick()} disabled={endorsed} className=" w-24" variant="primary" size="extra_small_paddind_2">
            Endorse
          </Buttons>
        )}
      </div>
    </div>
  )
}
