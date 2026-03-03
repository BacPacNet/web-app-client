import React from 'react'
import blueBgTick from '@/assets/blueBGTick.svg'
import Image from 'next/image'
import { FaCheck } from 'react-icons/fa'

const MilestoneCard = ({
  invitesRequired,
  rewardAmount,
  perInviteAmount,
  isActive = false,
  isCompleted = false,
  isDisabled = false,
}: {
  invitesRequired: number
  rewardAmount: number
  perInviteAmount: number
  isActive: boolean
  isCompleted: boolean
  isDisabled: boolean
}) => {
  return (
    <div
      className={`rounded-xl border p-3 flex items-center justify-between transition-all
        ${isActive ? 'border-primary bg-[#6744FF1A] border-2' : 'border-[#E5E7EB]'}
        ${isDisabled ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Circle */}
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full font-semibold
            ${isCompleted ? 'bg-primary text-white' : 'bg-[#F3F2FF] text-primary '}
          `}
        >
          {isCompleted ? <FaCheck className="text-white" size={24} /> : invitesRequired}
        </div>

        {/* Text */}
        <div>
          <p className={`font-normal ${isActive ? 'text-primary ' : 'text-[#18191A]'} text-sm`}>{invitesRequired} Invites</p>
          <p className="text-sm text-[#6B7280] font-normal">₹{perInviteAmount.toFixed(2)} per invite</p>
        </div>
      </div>

      {/* Reward */}
      <div className={`font-normal flex flex-col justify-end items-end  text-sm ${isActive ? 'text-primary' : 'text-[#18191A]'} `}>
        ₹{rewardAmount}
        {isActive ? <span>Earned</span> : ''}
      </div>
    </div>
  )
}

export default MilestoneCard
