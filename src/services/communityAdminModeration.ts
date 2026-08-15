import { OfficialGroupWithPostCount } from '@/services/community-group'
import { CommunityGroupPostForCommunityAdmin } from '@/services/community-post'
import { useQueryClient } from '@tanstack/react-query'
import { useUniStore } from '@/store/store'

export type ModerationGroup = OfficialGroupWithPostCount

export type ModerationGroupPost = CommunityGroupPostForCommunityAdmin

export function useInvalidateModerationQueries() {
  const queryClient = useQueryClient()
  const communityId = useUniStore((state) => state.communityId)

  return () => {
    queryClient.invalidateQueries({ queryKey: ['officialGroupsStats', communityId] })
    queryClient.invalidateQueries({ queryKey: ['officialGroupsWithPostCount', communityId] })
    queryClient.invalidateQueries({ queryKey: ['moderationGroupPosts', communityId] })
    queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
  }
}
