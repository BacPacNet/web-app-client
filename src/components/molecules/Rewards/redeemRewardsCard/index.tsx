'use client'

import Buttons from '@/components/atoms/Buttons'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import InputBox from '@/components/atoms/Input/InputBox'
import { isValidUpi } from '@/lib/utils'
import { useUpdateLatestRewardRedemptionUpiId } from '@/services/user'
import { useState } from 'react'

export default function RedeemRewardsCard({ currentUpiId }: { currentUpiId: string | null }) {
  const [upiId, setUpiId] = useState('')
  const { mutate: updateUpiId, isPending } = useUpdateLatestRewardRedemptionUpiId()

  const handleSubmit = () => {
    const trimmedUpi = upiId.trim()

    if (!trimmedUpi) {
      showCustomDangerToast('Please enter your UPI ID')
      return
    }

    if (!isValidUpi(trimmedUpi)) {
      showCustomDangerToast('Invalid UPI ID format')
      return
    }

    updateUpiId(
      { upiId: trimmedUpi },
      {
        onSuccess: () => {
          showCustomSuccessToast('✓ UPI ID submitted to receive rewards.')
          setUpiId('')
        },
        onError: () => {
          showCustomDangerToast('Unable to submit UPI ID. Please try again.')
        },
      }
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h6 className="text-[20px] font-bold font-poppins text-neutral-700">Redeem Rewards</h6>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <InputBox type="text" value={upiId} onChange={(event) => setUpiId(event.target.value)} className="flex-1" placeholder="Enter your UPI ID" />

          <Buttons size="medium" onClick={handleSubmit} disabled={isPending || !upiId.trim()}>
            {isPending ? 'Submitting...' : 'Submit'}
          </Buttons>
        </div>
        {currentUpiId && (
          <p className="text-neutral-500 text-xs leading-relaxed">
            Your active UPI ID: <span className="font-bold">{currentUpiId}</span>
          </p>
        )}
      </div>
      <p className="text-neutral-700 text-sm leading-relaxed">
        We will send the cash reward to your UPI ID. Rewards are redeemable after May 1, 2026, and will continue to be available at the start of each
        month. This can take up to several business days.
      </p>
    </div>
  )
}
