import React, { useState } from 'react'
import aibot from '@/assets/chatbot/mainBot.svg'
import Image from 'next/image'
import SettingsText from '@/components/atoms/SettingsText'
import SupportingText from '@/components/atoms/SupportingText'
import Buttons from '@/components/atoms/Buttons'
import { useCreateEndorsementAI, useGetEndorsementAI, useGetEndorsementAIOfUser } from '@/services/endorsement-ai'

const AINoUniversity = ({ communityId }: { communityId: string }) => {
  return (
    <div className="w-full flex justify-center items-center h-full font-poppins ">
      <div className="flex max-md:flex-col h-full gap-8 justify-center items-center w-full">
        <Image src={aibot} alt="bot" width={40} height={40} className="w-32 md:w-60 p-4" />
        <div className="w-1/2 max-md:w-11/12 flex flex-col gap-5 justify-center">
          <SettingsText className="text-sm md:text-md ">Sorry! It seems your university doesn’t support our AI Assistant!</SettingsText>
          <SupportingText className="text-neutral-700">
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
        <SettingsText className="text-xs">{endorsement?.totalUsersEndorsed} Have Endorsed</SettingsText>
        <SettingsText className="text-xs">{endorsement?.percentage}%</SettingsText>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden bg-neutral-100">
        <div
          className="bg-primary-500 h-6 text-white text-sm font-medium text-center flex items-center justify-center"
          style={{ width: `${endorsement?.percentage}%` }}
          role="progressbar"
          aria-valuenow={endorsement?.totalUsersEndorsed}
          aria-valuemin={0}
          aria-valuemax={endorsement?.totalGoal}
        ></div>
      </div>
      <SupportingText className="text-neutral-700 text-2xs md:text-xs">Target goal: {endorsement?.totalGoal} students</SupportingText>
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
