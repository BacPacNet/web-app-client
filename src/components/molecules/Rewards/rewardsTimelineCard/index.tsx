import React from 'react'
import rewardIcon from '@/assets/rewards/Container.svg'
import Image from 'next/image'
import Buttons from '@/components/atoms/Buttons'
import { useRouter } from 'next/navigation'

export default function RewardsTimelineCard() {
  const router = useRouter()
  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-card mb-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Image src={rewardIcon} alt="rewardIcon" width={32} height={32} />
          <h6 className="text-[20px] font-poppins text-[#18191A] font-extrabold">Refer and Earn Money</h6>
        </div>
        <p className="text-xs text-neutral-700 font-inter">
          Share your unique link, and earn cash rewards when a student or faculty member from your current university signs up.
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Buttons size="medium" onClick={() => router.push('/rewards')}>
          Learn More
        </Buttons>
      </div>
    </div>
  )
}
