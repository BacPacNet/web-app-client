'use client'

import Spinner from '@/components/atoms/spinner'
import { useGetUserReferrals } from '@/services/user'
import { useRouter } from 'next/navigation'
import { FaChevronLeft } from 'react-icons/fa'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { useState } from 'react'
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
  const { data, isLoading, error } = useGetUserReferrals()
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
            View all users who have joined using your referral code. You have referred {data?.totalReferrals || 0} user
            {data?.totalReferrals !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>
      <div>
        {/* {isLoading ? (
          <div className="flex justify-center items-center h-full min-h-[300px]">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-neutral-500 text-sm">Error loading referrals. Please try again later.</p>
        ) : data?.referrals && data.referrals.length > 0 ? (
          data.referrals.map((referral) => <ReferralListItem key={referral._id} referral={referral} />)
        ) : (
          <p className="text-neutral-500 text-sm">No referrals found</p>
        )} */}

        {data?.referrals && data.referrals.length > 0 ? (
          data.referrals.map((referral) => <ReferralListItem key={referral._id} referral={referral} />)
        ) : (
          <p className="text-neutral-500 text-sm">No referrals found</p>
        )}
      </div>
    </div>
  )
}
