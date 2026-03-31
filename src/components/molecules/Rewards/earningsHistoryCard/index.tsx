import { FaUsers } from 'react-icons/fa'
import { ReactNode } from 'react'
import RewardsIcon from '@/components/atoms/RewardsIcon'

type EarningsHistoryCardProps = {
  completedReferrals: number
  totalEarnings: number
}

type MetricCardProps = {
  title: string
  value: string
  icon: ReactNode
}

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="flex-1 border border-neutral-200 rounded-lg p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#F3F2FF] text-primary flex items-center justify-center">{icon}</div>
      <div className="flex flex-col gap-1">
        <p className="text-2xs text-neutral-500">{title}</p>
        <p className="text-2xl leading-none font-poppins font-semibold text-neutral-900">{value}</p>
      </div>
    </div>
  )
}

export default function EarningsHistoryCard({ completedReferrals, totalEarnings }: EarningsHistoryCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h6 className="text-[20px] font-bold font-poppins text-neutral-700">Earnings History</h6>
        <p className="text-neutral-700 text-sm leading-relaxed">
          You can see your total referral earnings calculated up to the end of the previous month.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <MetricCard title="Completed Referrals" value={String(completedReferrals)} icon={<FaUsers size={24} />} />
        <MetricCard title="Total Earnings" value={`₹${totalEarnings}`} icon={<RewardsIcon size={24} />} />
      </div>
    </div>
  )
}
