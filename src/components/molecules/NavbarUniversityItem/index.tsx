'use client'
import GroupSearchBox from '@/components/atoms/GroupSearchBox'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { useGetSubscribedCommunties } from '@/services/university-community'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import Tabs from '../Tabs'
import AssignGroupModerators from '@/components/communityUniversity/AssignGroupModerators'
import { useUniStore } from '@/store/store'
import CreateNewGroupBox from '../CreateNewGroupBox'
import avatar from '@assets/avatar.svg'
import CommunityGroupAll from './Tabs/communityGroupAll'
import NavbarSubscribedUniversity from './NavbarSubscribedUniversity'
import { Community } from '@/types/Community'

export default function NavbarUniversityItem({ setActiveMenu }: any) {
  const { userData, userProfileData } = useUniStore()
  const router = useRouter()
  const { communityId, groupId: communityGroupId }: { communityId: string; groupId: string } = useParams()
  const [currSelectedGroup, setCurrSelectedGroup] = useState<Community>()
  const [currClickedID, SetcurrClickedID] = useState<any>({ id: null, group: false })
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [assignUsers, setAssignUsers] = useState(false)
  const [showGroupTill, setShowGroupTill] = useState(5)
  const [community, setCommunity] = useState<Community>()
  const [selectCommunityId, selectedCommuntyGroupdId] = [communityId || community?._id, communityGroupId]

  const { data: subscribedCommunities, isFetching, isLoading } = useGetSubscribedCommunties()

  const handleCommunityClick = (index: number) => {
    handleUniversityClick(index)
    setCurrSelectedGroup(community)
    setActiveMenu('')
  }

  const subscribedCommunitiesAllGroups = useMemo(() => {
    if (communityId) {
      return subscribedCommunities?.find((community) => community._id === communityId)?.communityGroups
    } else {
      return subscribedCommunities && subscribedCommunities[0]?.communityGroups
    }
  }, [subscribedCommunities, communityId])

  const joinedSubscribedCommunitiesGroup = useMemo(() => {
    const selectedCommunityGroup = subscribedCommunities?.find((community) => community?._id === (communityId || subscribedCommunities?.[0]._id))
      ?.communityGroups
    return selectedCommunityGroup?.filter(
      (userCommunityGroup) =>
        userCommunityGroup?.users?.some((selectCommunityGroup) => selectCommunityGroup?.userId?.toString() === userData?.id?.toString())
    )
  }, [subscribedCommunities, communityId, userData])

  const subscribedCommunitiesMyGroup = useMemo(
    () =>
      subscribedCommunities
        ?.find((community) => community._id === (communityId || subscribedCommunities?.[0]._id))
        ?.communityGroups.filter((communityGroup) => communityGroup.adminUserId === userData.id),
    [subscribedCommunities, communityId, userData.id]
  )

  useEffect(() => {
    if (communityId && subscribedCommunities) {
      setCommunity(subscribedCommunities?.find((community) => community._id === communityId))
    } else {
      subscribedCommunities && setCommunity(subscribedCommunities?.[0] as Community)
    }
  }, [subscribedCommunities])

  const tabData = [
    {
      label: 'All',
      content: (
        <CommunityGroupAll
          communityGroups={subscribedCommunitiesAllGroups}
          showGroupTill={showGroupTill}
          setShowGroupTill={setShowGroupTill}
          currSelectedGroup={currSelectedGroup as Community}
          setCurrSelectedGroup={setCurrSelectedGroup}
          userData={userData}
          setAssignUsers={setAssignUsers}
          SetcurrClickedID={SetcurrClickedID}
          selectedCommuntyGroupdId={selectedCommuntyGroupdId}
          selectCommunityId={selectCommunityId}
        />
      ),
    },
    {
      label: 'Joined',
      content: (
        <CommunityGroupAll
          communityGroups={joinedSubscribedCommunitiesGroup}
          showGroupTill={showGroupTill}
          setShowGroupTill={setShowGroupTill}
          currSelectedGroup={currSelectedGroup as Community}
          setCurrSelectedGroup={setCurrSelectedGroup}
          userData={userData}
          setAssignUsers={setAssignUsers}
          SetcurrClickedID={SetcurrClickedID}
          selectedCommuntyGroupdId={selectedCommuntyGroupdId}
          selectCommunityId={selectCommunityId}
        />
      ),
    },
    {
      label: 'Your Group',
      content: (
        <div>
          <CommunityGroupAll
            communityGroups={subscribedCommunitiesMyGroup}
            showGroupTill={showGroupTill}
            setShowGroupTill={setShowGroupTill}
            currSelectedGroup={currSelectedGroup as Community}
            setCurrSelectedGroup={setCurrSelectedGroup}
            userData={userData}
            setAssignUsers={setAssignUsers}
            SetcurrClickedID={SetcurrClickedID}
            selectedCommuntyGroupdId={selectedCommuntyGroupdId}
            selectCommunityId={selectCommunityId}
          />

          <div className="flex justify-center items-center p-2">
            <button onClick={() => setShowNewGroup(true)} className="bg-[#6647FF] py-2 w-11/12  rounded-lg text-white">
              Create Group
            </button>
          </div>
        </div>
      ),
    },
  ]

  const handleUniversityClick = (index: React.SetStateAction<number>) => {
    const indextoPush = Number(index)
    setCommunity(subscribedCommunities?.[indextoPush] as Community)
    router.push(`/community/${subscribedCommunities?.[indextoPush]._id}`)
  }

  if (isFetching || isLoading) return <UserListItemSkeleton />

  return (
    <>
      <NavbarSubscribedUniversity
        userData={userData}
        communityId={communityId}
        subscribedCommunities={subscribedCommunities as Community[]}
        handleCommunityClick={handleCommunityClick}
      />

      <>
        <p className="px-4 pb-4 pt-9 text-neutral-500 text-2xs font-bold">UNIVERSITY GROUPS</p>
        <div className="flex items-center px-4 py-2 w-full">
          <div className="flex items-center justify-center bg-white rounded-full gap-3 ">
            <div
              style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
              className="flex items-center justify-center bg-white rounded-full w-[40px] h-[40px] cursor-pointer"
            >
              <Image
                width={40}
                height={40}
                className="w-[40px] h-[40px] object-cover rounded-full"
                src={community?.communityLogoUrl?.imageUrl || avatar}
                alt="communtiy image"
              />
            </div>
            <GroupSearchBox placeholder="Search Groups" type="text" />
          </div>
        </div>
        {/*<div className="flex gap-2 justify-evenly cursor-pointer my-4">
          <div
            style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.04), 0px 1px 2px 0px rgba(16, 24, 40, 0.04)' }}
            className="border-2 border-solid border-neutral-200 rounded-lg "
          >
            <div className="flex gap-6 justify-center items-center h-8 px-4 ">
              <p className="text-xs text-neutral-700">Filter</p>
              <FiFilter width={16} height={16} className="text-primary-500 font-bold" />
            </div>
          </div>
          <div
            style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.04), 0px 1px 2px 0px rgba(16, 24, 40, 0.04)' }}
            className="border-2 border-solid border-neutral-200 rounded-lg "
          >
            <div className="flex gap-6 justify-center items-center h-8 px-4">
              <p className="text-xs text-neutral-700">Filter</p>
              <FiFilter width={16} height={16} className="text-primary-500 font-bold" />
            </div>
          </div>
        </div>*/}
      </>

      {subscribedCommunities?.length !== 0 ? (
        <Tabs tabs={tabData} tabAlign="center" />
      ) : (
        <div className="px-4 w-full text-center font-poppins text-neutral-400">
          <p>Add your university to join or create groups</p>
        </div>
      )}

      {showNewGroup && <CreateNewGroupBox communityId={communityId} setNewGroup={setShowNewGroup} />}
      <AssignGroupModerators assignUsers={assignUsers} setAssignUsers={setAssignUsers} id={currClickedID.id} isGroup={currClickedID.group} />
    </>
  )
}
