'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserRecommendations } from '@/types/Recommendation'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { getUserProfileSubtitleLines } from '@/lib/userProfileSubtitle'

interface UserCardProps {
  user: UserRecommendations
}

const RecommendationsUserCard: React.FC<UserCardProps> = ({ user }) => {
  const router = useRouter()
  const [imgSrc, setImgSrc] = useState(user?.profile_image || '')
  const { line1, line2 } = getUserProfileSubtitleLines({
    role: user.role,
    study_year: user.study_year,
    major: user.major,
    occupation: user.occupation,
    affiliation: user.affiliation,
  })

  return (
    <div className="flex justify-between items-center">
      <div
        onClick={() => {
          router.push(`/profile/${user.user_id}`)
        }}
        className="flex gap-2 items-center hover:cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          <Image
            onError={() => setImgSrc(avatar)}
            src={imgSrc}
            alt={`${user.name}`}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-neutral-700 text-xs flex items-center gap-1">{user.name}</p>
          {line1 && <p className="text-3xs text-neutral-500">{line1}</p>}
          {line2 && <p className="text-3xs text-neutral-500">{line2}</p>}
        </div>
      </div>
    </div>
  )
}

export default RecommendationsUserCard
