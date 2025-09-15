'use client'
import CommunityGroupPostFilterDropDown from '@/components/atoms/CommunityGroupPostFilterDropDown'
import CommunityGroupBanner from '@/components/molecules/CommunityGroupBanner'
import CommunityGroupNotLiveCard from '@/components/molecules/CommunityGroupNotLiveCard'
import CommunityCreatePost from '@/components/organisms/CommunityCreatePost'
import CommunityGroupPostContainer from '@/components/organisms/CommunityGroupPostContainer'
import { notificationRoleAccess } from '@/components/organisms/NotificationTabs/NotificationTab'
import { useGetCommunityGroup } from '@/services/community-university'
import { notificationStatus } from '@/services/notification'
import { useUniStore } from '@/store/store'
import { CommunityGroupType, CommunityGroupTypeEnum } from '@/types/CommuityGroup'
import { useRouter, useSearchParams } from 'next/navigation'
import { useRef, useState } from 'react'

// Types
interface PageParams {
  communityId: string
  groupId: string
}

export default function Page({ params: { communityId, groupId: communityGroupId } }: { params: PageParams }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterPostBy = searchParams.get('filterPostBy') ?? ''
  const [isGroupAdmin, setIsGroupAdmin] = useState(false)
  const [isUserJoinedCommunityGroup, setIsUserJoinedCommunityGroup] = useState<boolean | null>(null)
  const [isCommunityGroupLive, setIsCommunityGroupLive] = useState<boolean | null>(null)
  const [pendingPostCount, setPendingPostCount] = useState(0)
  const {
    data: communityGroups,
    isLoading: isCommunityGroupsLoading,
    refetch,
    isError: isCommunityGroupError,
  } = useGetCommunityGroup(communityId, communityGroupId)
  const changePostFilter = (filter: string) => {
    router.push(`?filterPostBy=${filter}`)
  }
  return (
    <div ref={containerRef} className="h-with-navbar overflow-y-scroll hideScrollbar outline-none">
      <CommunityGroupBanner
        communityID={communityId}
        communityGroupID={communityGroupId}
        isGroupAdmin={isGroupAdmin}
        setIsGroupAdmin={setIsGroupAdmin}
        setIsUserJoinedCommunityGroup={setIsUserJoinedCommunityGroup}
        isUserJoinedCommunityGroup={isUserJoinedCommunityGroup}
        communityGroups={communityGroups as CommunityGroupType}
        isCommunityGroupsLoading={isCommunityGroupsLoading}
        refetch={refetch}
        isCommunityGroupLive={isCommunityGroupLive}
        setIsCommunityGroupLive={setIsCommunityGroupLive}
        notificationType={communityGroups?.notificationTypes as string}
        notificationId={communityGroups?.notificationId as string}
      />

      {isCommunityGroupsLoading || isCommunityGroupLive == null || isCommunityGroupError ? null : !isCommunityGroupLive ? (
        <CommunityGroupNotLiveCard
          communityID={communityId}
          communityAdminId={communityGroups?.communityId.adminId as string}
          communityGroupId={communityGroups?._id as string}
          communityGroupAdminId={communityGroups?.adminUserId as string}
          notificationType={communityGroups?.notificationTypes as string}
          notificationId={communityGroups?.notificationId as string}
          notificationStatus={communityGroups?.notificationStatus as string}
          refetch={refetch}
          communityGroupTitle={communityGroups?.title || ''}
          communityName={communityGroups?.communityId?.name || ''}
        />
      ) : (
        <>
          {(isUserJoinedCommunityGroup || isGroupAdmin) && (
            <CommunityCreatePost
              communityGroupAdminId={communityGroups?.adminUserId as string}
              communityId={communityId}
              communityGroupId={communityGroupId}
              isOfficial={communityGroups?.communityGroupType === CommunityGroupTypeEnum.OFFICIAL}
            />
          )}

          {communityGroups && !isCommunityGroupsLoading && isUserJoinedCommunityGroup && (
            <CommunityGroupPostFilterDropDown pendingPostCount={pendingPostCount} changePostFilter={changePostFilter} filterPostBy={filterPostBy} />
          )}
          {communityGroups && !isCommunityGroupsLoading && (
            <CommunityGroupPostContainer
              communityGroupAdminId={communityGroups?.adminUserId as string}
              filterPostBy={filterPostBy}
              containerRef={containerRef}
              iscommunityGroups={!!communityGroups}
              setPendingPostCount={setPendingPostCount}
            />
          )}
        </>
      )}
    </div>
  )
}
