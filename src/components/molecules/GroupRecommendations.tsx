import React from 'react'
import { useGetGroupRecommendations } from '@/services/recommendation'
import { GroupRecommendationData as GroupRecommendationDataType } from '@/types/Recommendation'
import UserListItemSkeleton from '../Connections/UserListItemSkeleton'
import GroupCard from '../Timeline/GroupCard'
import { GroupRecommendation } from '@/types/Recommendation'

const GroupRecommendations: React.FC = () => {
  const { data: groupRecommendationsData, isLoading: groupLoading, error: groupError } = useGetGroupRecommendations(true)

  // Transform group recommendation data to match the Group interface
  const transformedGroups: GroupRecommendation[] =
    groupRecommendationsData?.data?.map((group: GroupRecommendationDataType) => ({
      group_id: group.group_id,
      name: group.name,
      score: group.score,
      communityId: group.communityId,
      communityCoverUrl: group.communityCoverUrl,
      communityGroupLogoUrl: group.communityGroupLogoUrl,
      communityGroupAccess: group.communityGroupAccess,
      communityGroupType: group.communityGroupType,
      communityGroupCategory: group.communityGroupCategory,
    })) || []

  return (
    <div>
      <p className="text-xs text-neutral-500 font-bold my-4">JOIN GROUPS</p>
      {groupLoading ? (
        <UserListItemSkeleton count={2} />
      ) : groupError ? (
        <p className="text-xs text-red-500">Failed to load group recommendations</p>
      ) : (
        <div className="flex flex-col gap-4">
          {transformedGroups.slice(0, 5).map((group, index) => (
            <div key={index} className="border-b border-neutral-200 pb-4">
              <GroupCard group={group} key={`${group.group_id}${group.name}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GroupRecommendations
