'use client'

import ModerationGroupCard from '@/components/molecules/AdminDashboard/ModerationGroupCard'
import { ModerationGroup } from '@/services/communityAdminModeration'
import { useEffect, useState } from 'react'

type Props = {
  groups: ModerationGroup[]
  communityId: string
  isLoading?: boolean
  isError?: boolean
  onGroupRemoved?: () => void
}

export default function ModerationGroupList({ groups, communityId, isLoading = false, isError = false, onGroupRemoved }: Props) {
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null)

  // useEffect(() => {
  //   if (groups.length > 0 && !expandedGroupId) {
  //     setExpandedGroupId(groups[0]._id)
  //   }
  // }, [groups, expandedGroupId])

  useEffect(() => {
    if (expandedGroupId && !groups.some((group) => group._id === expandedGroupId)) {
      setExpandedGroupId(groups[0]?._id ?? null)
    }
  }, [expandedGroupId, groups])

  if (isLoading) {
    return <p className="text-sm text-neutral-500">Loading groups...</p>
  }

  if (isError) {
    return <p className="text-sm text-red-500">Failed to load moderation groups.</p>
  }

  if (groups.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">No official groups found for moderation.</div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <ModerationGroupCard
          key={group._id}
          group={group}
          communityId={communityId}
          isExpanded={expandedGroupId === group._id}
          onToggle={() => setExpandedGroupId((current) => (current === group._id ? null : group._id))}
          onGroupRemoved={onGroupRemoved}
        />
      ))}
    </div>
  )
}
