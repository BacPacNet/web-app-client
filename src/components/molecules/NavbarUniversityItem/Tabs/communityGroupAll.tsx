import GroupSelectors from '@/components/communityUniversity/GroupSelectors'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { community } from '@/services/university-community'
import { userType } from '@/store/userSlice/userType'
import React from 'react'

type Props = {
  communityGroups: { groups: any[] }
  showGroupTill: number
  currSelectedGroup: community
  userData: Partial<userType>
}

function CommunityGroupAll({
  communityGroups,
  showGroupTill,
  currSelectedGroup,
  userData,
  setAssignUsers,
  SetcurrClickedID,
  setCurrSelectedGroup,
  id,
  setShowGroupTill,
  isCommunityGroupsLoading,
}: any) {
  if (isCommunityGroupsLoading) return <UserListItemSkeleton className="px-4" />
  console.log(communityGroups, 'communityGroups')
  if (communityGroups?.length === 0 || !communityGroups) return <p className="text-center text-neutral-500"> No Groups Available</p>
  return (
    <>
      {communityGroups
        ?.slice(0, showGroupTill)
        .map((item: any) => (
          <GroupSelectors
            key={item.title}
            currSelectedGroup={currSelectedGroup}
            setCurrSelectedGroup={setCurrSelectedGroup}
            data={item}
            userId={userData?.id}
            setAssignUsers={setAssignUsers}
            SetcurrClickedID={SetcurrClickedID}
            paramGroupId={id}
          />
        ))}
      {communityGroups?.length > showGroupTill && (
        <p onClick={() => setShowGroupTill(showGroupTill + 5)} className="text-neutral-500 text-sm underline text-center mt-2 cursor-pointer">
          Load More
        </p>
      )}
    </>
  )
}

export default CommunityGroupAll
