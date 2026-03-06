'use client'
import Buttons from '@/components/atoms/Buttons'

import RedeemRewardsModal from '../redeemRewardsModal'
import { useModal } from '@/context/ModalContext'

const ExpectedPayoutCard = ({ amount, previousMonthRedeemed }: { amount: number; previousMonthRedeemed: boolean }) => {
  const { openModal, closeModal } = useModal()

  const handleRedeemRewardModal = () => {
    openModal(<RedeemRewardsModal amount={amount} onClose={() => closeModal()} />, 'h-auto w-[350px] sm:w-[490px] hideScrollbar')
  }

  return (
    <div className="flex flex-col gap-3">
      <h6 className="text-[20px] font-bold font-poppins text-neutral-700">Expected Payout</h6>

      {previousMonthRedeemed ? (
        <p className="text-sm font-normal text-neutral-700">
          You can redeem your reward after completing a milestone. If you have trouble with your previous payout, contact us through our{' '}
          <span className="text-primary ">feedback form</span>.
        </p>
      ) : (
        <p className="text-sm font-normal text-neutral-700">
          You can redeem your <span className="">₹{amount}</span> gift card from last month&apos;s rewards using the button below.
        </p>
      )}

      <Buttons variant="primary" size="medium" className="w-max" disabled={previousMonthRedeemed || amount === 0} onClick={handleRedeemRewardModal}>
        Redeem Reward
      </Buttons>
    </div>
  )
}

export default ExpectedPayoutCard
