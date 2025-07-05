import React from 'react'
import { useGetUserRecommendations } from '@/services/recommendation'
import { RecommendationData as RecommendationDataType } from '@/types/Recommendation'
import RecommendationsUserCard from '../Timeline/UserCard'
import { UserRecommendations as UserRecommendationsType } from '@/types/Recommendation'

const UserRecommendations: React.FC = () => {
  const { data: recommendationsData, isLoading, error } = useGetUserRecommendations(true)

  // Transform recommendation data to match the User interface
  const transformedPeople: UserRecommendationsType[] =
    recommendationsData?.data?.map((rec: RecommendationDataType) => ({
      name: rec.name,
      university: rec.university_name,
      study_year: rec.study_year,
      major: rec.major,
      affiliation: rec.affiliation,
      occupation: rec.occupation,
      score: rec.score,
      profile_image: rec.profile_image,
      user_id: rec.user_id,
    })) || []

  if (isLoading || !recommendationsData?.data?.length) {
    return null
  }

  if (error) {
    return (
      <div>
        <p className="text-xs text-neutral-500 font-bold py-2 pb-4">GROW YOUR NETWORK</p>
        <p className="text-xs text-red-500">Failed to load recommendations</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs text-neutral-500 font-bold py-2 pb-4">GROW YOUR NETWORK</p>
      <div className="flex flex-col gap-4">
        {transformedPeople.slice(0, 5).map((user, index) => (
          <div key={index} className="border-b border-neutral-200 pb-4">
            <RecommendationsUserCard user={user} key={`${user?.profile_image}${user?.name}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserRecommendations
