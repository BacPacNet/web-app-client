'use client'

import Buttons from '@/components/atoms/Buttons'
import Image from 'next/image'
import infoIcon from '@/assets/rewards/info.svg'
import checkIcon from '@/assets/blueBGTick.svg'

export default function RedeemSuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-center gap-2">
        <Image src={checkIcon} alt="success" width={24} height={24} />
        <h2 className="text-md font-poppins font-bold text-neutral-700">Request Received</h2>
      </div>

      <p className="text-sm text-neutral-700 text-start leading-relaxed">
        Congratulations! We’ve received your redemption request. You can keep earning rewards and redeem again once you reach your next milestone.
      </p>

      <div className="flex flex-col gap-2 items-start px-4 py-3 bg-[#F3F2FF] border border-[#6744FF33] rounded-lg">
        <div className="flex  gap-2">
          <div className="flex-shrink-0">
            <Image src={infoIcon} alt="info" width={24} height={24} />
          </div>
          <p className="text-sm font-medium text-neutral-700">Important Reminder</p>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Your reward will be added directly to your Amazon account, but you may not receive a notification. Check your account within five business
          days after submitting your request to confirm it’s been applied.
        </p>
      </div>

      <div className="flex justify-end mt-2">
        <Buttons variant="shade" size="large" className="w-max" onClick={onClose}>
          Close
        </Buttons>
      </div>
    </div>
  )
}
