import GroupSelectors from '@/components/communityUniversity/GroupSelectors'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import React from 'react'

function CommunityGroupAll({
  communityGroups,
  showGroupTill,
  currSelectedGroup,
  userData,
  SetcurrClickedID,
  setCurrSelectedGroup,
  selectedCommuntyGroupdId,
  setShowGroupTill,
  isCommunityGroupsLoading,
  selectCommunityId,
  handleAssignUsersModal,
  toggleLeftNavbar,
  selectedCommunityImage,
}: any) {
  if (isCommunityGroupsLoading || communityGroups === 'undefined') return <UserListItemSkeleton className="px-4" />
  if (communityGroups?.length === 0) return <p className="text-center text-neutral-500"> No Groups Available</p>
  return (
    <>
      {communityGroups
        ?.slice(0, showGroupTill)
        .map((item: any) => (
          <GroupSelectors
            key={item._id}
            currSelectedGroup={currSelectedGroup}
            setCurrSelectedGroup={setCurrSelectedGroup}
            data={item}
            userId={userData?.id}
            handleAssignUsersModal={handleAssignUsersModal}
            SetcurrClickedID={SetcurrClickedID}
            selectedCommuntyGroupdId={selectedCommuntyGroupdId}
            selectCommunityId={selectCommunityId}
            toggleLeftNavbar={toggleLeftNavbar}
            selectedCommunityImage={selectedCommunityImage}
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
