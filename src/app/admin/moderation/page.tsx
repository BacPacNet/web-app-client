'use client'

import AdminPageHeader from '@/components/molecules/AdminDashboard/AdminPageHeader'
import ModerationGroupList from '@/components/molecules/AdminDashboard/ModerationGroupList'
import ModerationStatsBadges from '@/components/molecules/AdminDashboard/ModerationStatsBadges'
import { useOfficialGroupsStatsForCommunityAdmin, useOfficialGroupsWithPostCountForCommunityAdmin } from '@/services/community-group'
import { useUniStore } from '@/store/store'

export default function AdminModerationPage() {
  const { communityId } = useUniStore()
  const isEnabled = Boolean(communityId)

  const { data: stats, isLoading: isStatsLoading } = useOfficialGroupsStatsForCommunityAdmin(isEnabled)
  const { data: groups = [], isLoading: isGroupsLoading, isError, refetch } = useOfficialGroupsWithPostCountForCommunityAdmin(isEnabled)

  const isLoading = isStatsLoading || isGroupsLoading

  return (
    <div className="p-8">
      <div className="flex flex-col gap-3">
        <AdminPageHeader title="Moderation" />

        <ModerationStatsBadges groupCount={stats?.officialGroupsCount ?? 0} postCount={stats?.totalPostsInOfficialGroups ?? 0} />

        <p className="text-xs text-[#6B7280]">Expand a group to view posts. Click any post to preview it.</p>
      </div>

      <div className="mt-6">
        {!communityId ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
            University information is required to view moderation groups.
          </div>
        ) : (
          <ModerationGroupList groups={groups} communityId={communityId} isLoading={isLoading} isError={isError} onGroupRemoved={() => refetch()} />
        )}
      </div>
    </div>
  )
}
