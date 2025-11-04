import Buttons from '@/components/atoms/Buttons'
import SegmentedControl, { SegmentedOption } from '@/components/atoms/SegmentControl'
import Spinner from '@/components/atoms/spinner'
import Title from '@/components/atoms/Title'
import UserListItem from '@/components/Timeline/UserListItem'
import { useGetCommunityGroupMembersUser, useRemoveUserFromCommunityGroup } from '@/services/community-group'
import { useUniStore } from '@/store/store'
import { CommunityGroupUsers, status } from '@/types/CommuityGroup'
import React, { useEffect, useMemo, useRef, useState } from 'react'

interface Props {
  users: CommunityGroupUsers[]
  adminId: string
  communityGroupId: string
  communityAdminIds: string[]
  isOfficialGroup: boolean
  isGroupAdmin?: boolean
}

export const CommunityGroupModal = ({ users, isGroupAdmin = false, adminId, communityGroupId, communityAdminIds, isOfficialGroup }: Props) => {
  const { userProfileData } = useUniStore()
  const ref = useRef<HTMLDivElement>(null)
  const { mutate: mutateRemoveUserFromCommunityGroup, isPending: isPending } = useRemoveUserFromCommunityGroup()
  const [userStatus, setUserStatus] = useState<string>(status.accepted)

  const {
    data: communityGroupMembers,
    refetch: refetchCommunityGroupMembers,
    isFetching: isFetchingCommunityGroupMembers,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useGetCommunityGroupMembersUser(communityGroupId, userStatus, 10)

  const communityGroupMembersData = useMemo(() => {
    return communityGroupMembers?.pages?.flatMap((page) => page?.data) ?? []
  }, [communityGroupMembers])

  useEffect(() => {
    setUserStatus(status.accepted)
    refetchCommunityGroupMembers()
  }, [communityGroupId])

  const handleRemoveUser = (id: string) => {
    mutateRemoveUserFromCommunityGroup(
      { communityGroupId, userId: id },
      {
        onSuccess: (response: any) => {
          refetchCommunityGroupMembers()
        },
      }
    )
  }

  const statusOptions: SegmentedOption[] = [
    { label: 'Joined', value: status.accepted },
    { label: 'Invited', value: status.pending },
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { scrollTop, scrollHeight, clientHeight } = ref.current
        const bottom = scrollTop + clientHeight >= scrollHeight - 10

        if (bottom && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }
    }

    const container = ref.current
    container?.addEventListener('scroll', handleScroll)

    return () => {
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div>
      <Title className="mb-6">Members</Title>
      <SegmentedControl options={statusOptions} value={userStatus} onChange={setUserStatus} className="w-full" />

      <div ref={ref} className="overflow-y-auto h-80  custom-scrollbar mt-7">
        {isFetchingCommunityGroupMembers && !isFetchingNextPage ? (
          <div className="flex justify-center items-center h-full min-h-[300px]">
            <Spinner />
          </div>
        ) : communityGroupMembersData?.length < 1 ? (
          <div className="flex justify-center items-center h-full min-h-[300px]">
            <p>No members found.</p>
          </div>
        ) : (
          communityGroupMembersData?.map((user) => {
            return (
              <UserListItem
                key={user._id as string}
                firstName={user.firstName}
                lastName={user.lastName}
                id={user._id as string}
                university={''}
                study_year={user.year}
                degree={''}
                major={user.major}
                occupation={user.occupation}
                imageUrl={user.profileImageUrl}
                type={''}
                isSelfProfile={userStatus === status.accepted ? userProfileData?.users_id === user._id : true}
                isFollowing={userProfileData?.following?.some((userItem) => userItem.userId === user._id) as boolean}
                role={user.role || 'student'}
                affiliation={user.affiliation}
                showCommunityGroupMember={userStatus === status.accepted ? true : false}
                isViewerAdmin={adminId === userProfileData?.users_id}
                isGroupAdmin={user._id.toString() === adminId.toString()}
                handleRemoveClick={(id) => handleRemoveUser(id)}
                isRemovePending={isPending}
                isCommunityAdmin={communityAdminIds?.includes(user?._id?.toString())}
                isOfficialGroup={isOfficialGroup}
                isVerifiedUserOfCommunity={user?.isVerified}
              />
            )
          })
        )}
        {isFetchingNextPage && (
          <div className="text-center pt-2">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  )
}
