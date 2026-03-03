'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/atoms/Card'
import RewardsDetailsCard from '@/components/organisms/RewardsDetailsCard'
import { useUniStore } from '@/store/store'
import { useGetUserEligibleForRewards } from '@/services/user'
import Spinner from '@/components/atoms/spinner'

export default function Rewards() {
  const router = useRouter()
  const { setUserEligibleForRewards } = useUniStore()
  const { data: userEligibleForRewardsData, isSuccess } = useGetUserEligibleForRewards()

  useEffect(() => {
    setUserEligibleForRewards(userEligibleForRewardsData ?? null)
  }, [userEligibleForRewardsData, setUserEligibleForRewards])

  useEffect(() => {
    if (!isSuccess) return
    if (userEligibleForRewardsData?.eligible === false) {
      router.replace('/timeline')
    }
  }, [isSuccess, userEligibleForRewardsData?.eligible, router])

  if (!isSuccess || userEligibleForRewardsData?.eligible === false) {
    return (
      <div className="py-4 h-[inherit] flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="py-4 h-[inherit]">
      <Card defaultPadding={false} className="rounded-lg h-full w-full overflow-y-scroll hideScrollbar">
        <RewardsDetailsCard />
      </Card>
    </div>
  )
}
