'use client'
import Buttons from '@/components/atoms/Buttons'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import InputBox from '@/components/atoms/Input/InputBox'
import MaxMonthInviteCardDetails from '@/components/molecules/Rewards/maxMonthInviteCardDetails'
import MilestoneCard from '@/components/molecules/Rewards/milestoneCard'
import MonthProgressCard from '@/components/molecules/Rewards/monthProgressCard'
import { useGetUserRewards } from '@/services/user'
import { useState } from 'react'
import RedeemRewardsCard from '@/components/molecules/Rewards/redeemRewardsCard'
import EarningsHistoryCard from '@/components/molecules/Rewards/earningsHistoryCard'

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

export default function RewardsDetailsCard() {
  const { data, isLoading, error } = useGetUserRewards()
  const [copied, setCopied] = useState(false)
  const currentProgress = data?.thisMonthProgress || 0
  const latestCompletedMilestone = rewardTiers.filter((tier) => currentProgress >= tier.invitesRequired).at(-1)?.invitesRequired || null

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
          Share your unique link and earn cash rewards when someone from your university signs up.
          <span className=" font-bold"> Only verified students or faculty from your current university </span>
          will count toward your rewards, so please remind them to complete their university verification during or after signing up!
        </p>
      </div>
      {/* referral link */}
      <div className="flex flex-col gap-4">
        {referralLink && (
          <div className="">
            <div className="flex flex-col gap-2 ">
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

      {/* milestone */}
      <div className="flex flex-col gap-4">
        <h6 className="text-[20px] font-bold font-poppins text-neutral-700">Milestones</h6>
        <MonthProgressCard monthProgress={currentProgress} monthEarnings={data?.thisMonthReward || 0} />
        <div className="flex flex-col gap-3">
          {rewardTiers.map((tier) => (
            <MilestoneCard
              key={tier.invitesRequired}
              invitesRequired={tier.invitesRequired}
              rewardAmount={tier.rewardAmount}
              perInviteAmount={tier.perInviteAmount}
              isActive={currentProgress >= tier.invitesRequired}
              isCompleted={currentProgress >= tier.invitesRequired}
              showEarned={latestCompletedMilestone === tier.invitesRequired}
              isDisabled={false}
            />
          ))}
        </div>
        <MaxMonthInviteCardDetails />
      </div>

      <RedeemRewardsCard currentUpiId={data?.currentUPI || null} />
      <EarningsHistoryCard completedReferrals={data?.totalInvites || 0} totalEarnings={data?.totalEarning || 0} />
    </div>
  )
}
