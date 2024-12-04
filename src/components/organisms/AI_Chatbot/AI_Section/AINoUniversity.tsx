import React, { useState } from 'react'
import aibot from '@/assets/chatbot/mainBot.svg'
import Image from 'next/image'
import SettingsText from '@/components/atoms/SettingsText'
import SupportingText from '@/components/atoms/SupportingText'
import Buttons from '@/components/atoms/Buttons'

const AINoUniversity = () => {
  return (
    <div className="w-full flex justify-center items-center h-full ">
      <div className="flex max-md:flex-col h-full gap-4 justify-center max-md:items-center w-full">
        <Image src={aibot} alt="bot" width={40} height={40} className="h-80 w-1/3 max-md:h-60 max-sm:h-52 max-sm:w-60" />
        <div className="w-1/2 max-md:w-11/12 flex flex-col gap-5 justify-center">
          <SettingsText className="text-[24px] font-poppins">Sorry! It seems your university doesn’t support our AI Assistant!</SettingsText>
          <SupportingText className="text-neutral-700 font-poppins">
            Let them know you would like it to have this feature for your university! Your voice matters!
          </SupportingText>
          <EndorsementTracker />
        </div>
      </div>
    </div>
  )
}

export default AINoUniversity

const EndorsementTracker = () => {
  const [endorsedCount, setEndorsedCount] = useState(440)
  const [endorsed, setEndorsed] = useState(false)
  const targetGoal = 1000

  const progressPercentage = Math.floor((endorsedCount / targetGoal) * 100)

  const handleEndorseClick = () => {
    const newEndorsedCount = endorsedCount + 100
    if (newEndorsedCount >= 1000) {
      return
    } else {
      setEndorsedCount(newEndorsedCount)
    }
    setEndorsed(true)
  }

  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex justify-between">
        <SettingsText className="text-sm">{endorsedCount} Have Endorsed</SettingsText>
        <SettingsText className="text-sm">{progressPercentage}%</SettingsText>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden ">
        <div
          className="bg-primary-500 h-6 text-white text-sm font-medium text-center flex items-center justify-center"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={endorsedCount}
          aria-valuemin={0}
          aria-valuemax={targetGoal}
        ></div>
      </div>
      <SupportingText className="text-neutral-700">Target goal: {targetGoal} students</SupportingText>
      <div className="flex justify-end">
        {endorsed ? (
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
