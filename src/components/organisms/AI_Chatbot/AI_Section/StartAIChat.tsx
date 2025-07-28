import React from 'react'
import aiLogo from '@/assets/chatbot/aiIcon.svg'
import Image from 'next/image'
import { IoCalendarOutline } from 'react-icons/io5'
import { TbCashBanknote } from 'react-icons/tb'
import { FaRegEdit } from 'react-icons/fa'
import { IconType } from 'react-icons/lib'

const badgeData = [
  { icon: IoCalendarOutline, desc: 'Tell me the schedule for a specific course', color: 'text-primary-500 border border-primary-500' },
  { icon: TbCashBanknote, desc: 'Give me a list of all available scholarships', color: 'text-success-500 border border-success-500' },
  { icon: FaRegEdit, desc: 'How many credits do I need to graduate?', color: 'text-warning-500 border border-warning-500' },
]
const StartAIChat = () => {
  return (
    <div className="w-full flex justify-center items-center h-full ">
      <div className="flex flex-col gap-4 items-center">
        <Image src={aiLogo} width={40} height={40} alt="logo" className="w-40 h-40" />
        <div className="flex gap-6 flex-wrap justify-center">
          <Badge
            Icon={IoCalendarOutline}
            desc="Need help with courses, study skills, or academic planning?"
            color="text-primary-500 border border-primary-500"
          />
        </div>
      </div>
    </div>
  )
}

export default StartAIChat

type BadgeProps = {
  Icon: IconType
  desc: string
  color: string
}

const Badge = ({ Icon, desc, color }: BadgeProps) => {
  return (
    <div className={`${color} flex gap-2 rounded-full py-2 px-3 items-center w-fit border-2 cursor-pointer`}>
      <p>
        <Icon />
      </p>
      <p className="font-medium text-xs">{desc}</p>
    </div>
  )
}
