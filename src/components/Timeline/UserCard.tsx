import React from 'react'
import Buttons from '../atoms/Buttons'
import { useRouter } from 'next/navigation'
import { UserRecommendations } from '@/types/Recommendation'

interface UserCardProps {
  user: UserRecommendations
}

const RecommendationsUserCard: React.FC<UserCardProps> = ({ user }) => {
  const router = useRouter()

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          {/* {user.avatar ? (
            <Image
              src={user.avatar}
              alt={`${user.name} avatar`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : ( */}
          <span className="text-primary font-bold text-md">{user.name.charAt(0).toUpperCase()}</span>
          {/* )} */}
        </div>
        <div>
          <p className="font-semibold text-neutral-700 text-xs flex items-center gap-1">{user.name}</p>
          <p className="text-3xs text-neutral-500">{user.study_year}</p>
          <p className="text-3xs text-neutral-500 ">{user.major}</p>
        </div>
      </div>
      <div>
        <Buttons
          onClick={() => {
            router.push(`/profile/${user.user_id}`)
          }}
          variant="border"
          size="small"
        >
          View
        </Buttons>
      </div>
    </div>
  )
}

export default RecommendationsUserCard
