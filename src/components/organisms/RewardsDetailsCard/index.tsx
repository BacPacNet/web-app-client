'use client'
import Buttons from '@/components/atoms/Buttons'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import InputBox from '@/components/atoms/Input/InputBox'
import MaxMonthInviteCardDetails from '@/components/molecules/Rewards/maxMonthInviteCardDetails'
import MilestoneCard from '@/components/molecules/Rewards/milestoneCard'
import MonthProgressCard from '@/components/molecules/Rewards/monthProgressCard'
import { useGetUserRewards } from '@/services/user'
import { useState } from 'react'
import infoIcon from '@/assets/rewards/info.svg'
import giftIcon from '@/assets/rewards/gift.svg'
import plusIcon from '@/assets/rewards/redem.svg'
import RewardInfoCard from '@/components/molecules/Rewards/rewardInfoCard'
import ExpectedPayoutCard from '@/components/molecules/Rewards/expectedPayoutCard'

const rewardTiers = [
  {
    invitesRequired: 10,
    rewardAmount: 100,
    perInviteAmount: 10,
    isActive: true,
    isCompleted: true,
  },
  {
    invitesRequired: 15,
    rewardAmount: 200,
    perInviteAmount: 13.33,
  },
  {
    invitesRequired: 20,
    rewardAmount: 400,
    perInviteAmount: 20,
  },
]

const cards = [
  {
    icon: infoIcon,
    title: 'Monthly Reset',
    description: 'Milestones reset on the 1st of every month. Start fresh and earn more rewards!',
  },
  {
    icon: giftIcon,
    title: 'Gift Card Delivery',
    description: 'Gift cards will be sent to your login email (personal or university email).',
  },
  {
    icon: plusIcon,
    title: 'Redemption',
    description: 'Rewards are redeemable on or after 1st April 2026. Gift cards will be issued in multiples of ₹100.',
  },
]

export default function RewardsDetailsCard() {
  const { data, isLoading, error } = useGetUserRewards()
  const [copied, setCopied] = useState(false)

  const referralLink = data?.referCode ? `${window.location.origin}/register?referralCode=${data.referCode}` : ''

  const handleCopyLink = async () => {
    if (!referralLink) return

    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      showCustomSuccessToast('Referral link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }
  return (
    <div className="p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h4 className="text-md-big font-extrabold font-poppins text-neutral-900">Rewards</h4>
        <p className="text-sm text-neutral-700 font-inter">
          Share your unique link, and earn cash rewards when a student or faculty member from your current university signs up.
        </p>
      </div>
      {/* referral link */}
      <div className="flex flex-col gap-4">
        {referralLink && (
          <div className="py-4 ">
            <div className="flex flex-col gap-2 mb-4">
              <label className="font-semibold text-xs text-neutral-900">Referral Link</label>
              <div className="flex gap-2">
                <InputBox type="text" value={referralLink} readOnly disabled className="flex-1" placeholder="Loading referral link..." />
                <Buttons variant="border_primary" size="medium" onClick={handleCopyLink} disabled={copied}>
                  {copied ? 'Copied!' : 'Copy'}
                </Buttons>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* payout  */}
      <ExpectedPayoutCard amount={data?.previousMonthReward || 0} previousMonthRedeemed={data?.previousMonthRedeemed || false} />

      {/* milestone */}
      <div className="flex flex-col gap-4">
        <h6 className="text-[20px] font-bold font-poppins text-neutral-700">Milestones</h6>
        <MonthProgressCard monthProgress={data?.thisMonthProgress || 0} monthEarnings={data?.thisMonthReward || 0} />
        <div className="flex flex-col gap-3">
          {rewardTiers.map((tier) => (
            <MilestoneCard
              key={tier.invitesRequired}
              invitesRequired={tier.invitesRequired}
              rewardAmount={tier.rewardAmount}
              perInviteAmount={tier.perInviteAmount}
              isActive={(data?.thisMonthProgress && data?.thisMonthProgress >= tier.invitesRequired) || false}
              isCompleted={(data?.thisMonthProgress && data?.thisMonthProgress >= tier.invitesRequired) || false}
              isDisabled={false}
            />
          ))}
        </div>
        <MaxMonthInviteCardDetails />
      </div>

      {/* //info cards */}
      <div className="flex flex-col gap-4">
        <h6 className="text-[20px] font-bold font-poppins text-neutral-700">How it Works</h6>
        <div className="flex flex-col gap-3">
          {cards.map((card) => (
            <RewardInfoCard key={card.title} icon={card.icon} title={card.title} description={card.description} />
          ))}
        </div>
      </div>
    </div>
  )
}
