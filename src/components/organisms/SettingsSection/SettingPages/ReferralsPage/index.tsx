'use client'

import { useGetUserReferrals } from '@/services/user'
import { useRouter } from 'next/navigation'
import { FaChevronLeft } from 'react-icons/fa'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { useEffect, useMemo, useRef, useState } from 'react'
import { userTypeEnum } from '@/types/RegisterForm'
import { Referral } from '@/types/User'
import { formatDate } from '@/lib/date'
import InputBox from '@/components/atoms/Input/InputBox'
import Buttons from '@/components/atoms/Buttons'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'

const ReferralListItem = ({ referral }: { referral: Referral }) => {
  const router = useRouter()
  const [imgSrc, setImgSrc] = useState(referral.profile?.profile_dp?.imageUrl || avatar)
  const isStudent = referral.profile?.role === userTypeEnum.Student

  const handleProfileClick = () => {
    if (referral.profile?.users_id) {
      router.push(`/profile/${referral.profile.users_id}`)
    }
  }

  return (
    <div className="flex items-center py-4 border-b border-neutral-200">
      <div onClick={handleProfileClick} className="flex gap-4 items-center cursor-pointer flex-1">
        <Image
          onError={() => setImgSrc(avatar)}
          src={imgSrc}
          alt={`${referral.firstName} ${referral.lastName}`}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-700 text-sm">
            {referral.firstName} {referral.lastName}
          </h3>
          {isStudent ? (
            <>
              {referral.profile?.study_year && <p className="text-2xs text-neutral-500">{referral.profile.study_year}</p>}
              {referral.profile?.major && <p className="text-2xs text-neutral-500">{referral.profile.major}</p>}
            </>
          ) : (
            <>
              {referral.profile?.occupation && <p className="text-2xs text-neutral-500">{referral.profile.occupation}</p>}
              {referral.profile?.affiliation && <p className="text-2xs text-neutral-500">{referral.profile.affiliation}</p>}
            </>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-neutral-500">Referred</p>
        <p className="text-xs text-neutral-400">{formatDate(referral.createdAt)}</p>
      </div>
    </div>
  )
}

export const ReferralsPage = () => {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetUserReferrals(10)
  const [copied, setCopied] = useState(false)
  const referralData = data?.pages?.[0]
  const referrals = useMemo(() => data?.pages?.flatMap((page) => page.referrals) || [], [data])

  const referralLink = referralData?.referCode ? `${window.location.origin}/register?referralCode=${referralData.referCode}` : ''

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { scrollTop, scrollHeight, clientHeight } = ref.current
        const bottom = scrollTop + clientHeight >= scrollHeight - 10
        if (bottom && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }
    }

    const container = ref.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

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
    <div className="rounded-lg">
      <div onClick={() => router.back()} className="flex items-center gap-2 pb-4 pt-0 border-b border-neutral-300 cursor-pointer">
        <FaChevronLeft className="text-neutral-500" />
        <span className="text-neutral-500 font-medium text-sm">Account</span>
      </div>

      {referralLink && (
        <div className="py-4 border-b border-neutral-300">
          <div className="flex flex-col gap-2 mb-4">
            <label className="font-medium text-neutral-900">Your Referral Link</label>
            <div className="flex gap-2">
              <InputBox type="text" value={referralLink} readOnly disabled className="flex-1" placeholder="Loading referral link..." />
              <Buttons variant="primary" size="medium" onClick={handleCopyLink} disabled={copied}>
                {copied ? 'Copied!' : 'Copy'}
              </Buttons>
            </div>
          </div>
        </div>
      )}

      <div className="py-4">
        <div className="flex flex-col gap-2">
          <h6 className="font-poppins font-bold text-neutral-700 text-[20px]">Referrals</h6>
          <p className="text-neutral-500 text-xs">
            View all users who have joined using your referral code. You have referred {referralData?.totalReferrals || 0} user
            {referralData?.totalReferrals !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>
      <div ref={ref} className="max-h-[420px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <p className="text-neutral-500 text-sm">Loading referrals...</p>
        ) : error ? (
          <p className="text-neutral-500 text-sm">Error loading referrals. Please try again later.</p>
        ) : referrals?.length > 0 ? (
          referrals.map((referral) => <ReferralListItem key={referral._id} referral={referral} />)
        ) : (
          <p className="text-neutral-500 text-sm">No referrals found</p>
        )}
        {isFetchingNextPage && <p className="text-neutral-500 text-xs py-3 text-center">Loading more referrals...</p>}
      </div>
    </div>
  )
}
