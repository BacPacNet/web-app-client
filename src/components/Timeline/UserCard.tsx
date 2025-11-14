'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserRecommendations } from '@/types/Recommendation'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'

interface UserCardProps {
  user: UserRecommendations
}

const RecommendationsUserCard: React.FC<UserCardProps> = ({ user }) => {
  const router = useRouter()
  const [imgSrc, setImgSrc] = useState(user?.profile_image || '')
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
          <p className="text-3xs text-neutral-500">{user.role === 'student' ? user.study_year : user.occupation}</p>
          <p className="text-3xs text-neutral-500">{user.role === 'student' ? user.major : user.affiliation}</p>
        </div>
      </div>
    </div>
  )
}

export default RecommendationsUserCard
