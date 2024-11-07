'use client'
import GroupSearchBox from '@/components/atoms/GroupSearchBox'
import GroupSelectors from '@/components/communityUniversity/GroupSelectors'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { useGetCommunityGroups } from '@/services/community-university'
import { community, useGetUserSubscribedCommunityGroups } from '@/services/university-community'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FiFilter } from 'react-icons/fi'
import Tabs from '../Tabs'
import AssignGroupModerators from '@/components/communityUniversity/AssignGroupModerators'
import { useUniStore } from '@/store/store'
import { IoMdSettings } from 'react-icons/io'
import CreateNewGroupBox from '../CreateNewGroupBox'
import avatar from '@assets/avatar.svg'
import LoginButtons from '@/components/atoms/LoginButtons'
import CommunityGroupAll from './Tabs/communityGroupAll'

export default function NavbarUniversityItem({ setActiveMenu }: any) {
  const { userData } = useUniStore()
  const router = useRouter()
  const { id }: any = useParams()

  const [currSelectedGroup, setCurrSelectedGroup] = useState<community>()
  const [currClickedID, SetcurrClickedID] = useState<any>({ id: null, group: false })
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [assignUsers, setAssignUsers] = useState(false)
  const [showGroupTill, setShowGroupTill] = useState(5)

  const { data: SubscribedData, isFetching, isLoading } = useGetUserSubscribedCommunityGroups()
  const [community, setCommunity] = useState<community>()

  const { data: communityGroups, isLoading: isCommunityGroupsLoading } = useGetCommunityGroups(id || '', !!community?._id)
  const allCommunities = [...(userData.userVerifiedCommunities || []), ...(userData.userUnVerifiedCommunities || [])]

  const handleCommunityClick = (index: number) => {
    handleUniversityClick(index)
    setCurrSelectedGroup(community)
    setActiveMenu('')
  }

  const matchedGroups = allCommunities.flatMap((community) =>
    community.communityGroups.reduce((acc, group: any) => {
      const matchingApiGroup = communityGroups?.groups.find((apiGroup: any) => apiGroup._id === group.communityGroupId)

      if (matchingApiGroup) acc.push(matchingApiGroup)
      return acc
    }, [] as any[])
  )
  const yourGroups = communityGroups?.groups?.filter((item: any) => item.adminUserId._id.toString() == userData.id).slice(0, showGroupTill)

  useEffect(() => {
    if (SubscribedData) {
      setCommunity(SubscribedData?.community[0] as community)
    }
  }, [SubscribedData])

  const tabData = [
    {
      label: 'All',
      content: (
        <CommunityGroupAll
          communityGroups={communityGroups?.groups}
          showGroupTill={showGroupTill}
          setShowGroupTill={setShowGroupTill}
          currSelectedGroup={currSelectedGroup as community}
          setCurrSelectedGroup={setCurrSelectedGroup}
          userData={userData}
          setAssignUsers={setAssignUsers}
          SetcurrClickedID={SetcurrClickedID}
          paramGroupId={id}
        />
      ),
    },
    {
      label: 'Joined',
      content: (
        <CommunityGroupAll
          communityGroups={matchedGroups}
          showGroupTill={showGroupTill}
          setShowGroupTill={setShowGroupTill}
          currSelectedGroup={currSelectedGroup as community}
          setCurrSelectedGroup={setCurrSelectedGroup}
          userData={userData}
          setAssignUsers={setAssignUsers}
          SetcurrClickedID={SetcurrClickedID}
          paramGroupId={id}
        />
      ),
    },
    {
      label: 'Your Group',
      content: (
        <div>
          <CommunityGroupAll
            communityGroups={yourGroups}
            showGroupTill={showGroupTill}
            setShowGroupTill={setShowGroupTill}
            currSelectedGroup={currSelectedGroup as community}
            setCurrSelectedGroup={setCurrSelectedGroup}
            userData={userData}
            setAssignUsers={setAssignUsers}
            SetcurrClickedID={SetcurrClickedID}
            paramGroupId={id}
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
    setCommunity(SubscribedData?.community[indextoPush] as community)
    router.push(`/community/${SubscribedData?.community[indextoPush]._id}`)
  }

  if (isFetching || isLoading) return <UserListItemSkeleton />

  return (
    <>
      {SubscribedData?.community.length === 0 && (
        <div className="px-4 w-full">
          <LoginButtons variant="primary" className="w-full">
            Add Your University
          </LoginButtons>{' '}
        </div>
      )}
      {SubscribedData?.community.map((community, index) => {
        return (
          <div key={index} className={`flex items-center justify-between hover:bg-secondary ${id && id[0] === community._id && 'bg-secondary'}`}>
            <div
              onClick={() => {
                handleCommunityClick(index)
              }}
              className={` flex items-center gap-3 py-2 px-4 cursor-pointer`}
            >
              <Image
                width={40}
                height={40}
                className="w-[40px] h-[40px] object-cover rounded-full"
                src={community.communityLogoUrl.imageUrl || avatar}
                alt={community.name}
              />

              <p className="text-xs">{community.name}</p>
            </div>
            {community?.adminId == userData.id && (
              <button
                onClick={() => {
                  setAssignUsers(true), SetcurrClickedID({ id: community?._id, group: false })
                }}
                className="text-[#6647FF] font-medium bg-[#F3F2FF] px-2 py-2 w-max h-max  rounded-full max-lg:text-sm max-md:mr-0 mr-4"
              >
                <IoMdSettings />
              </button>
            )}
          </div>
        )
      })}
      <>
        <p className="px-4 pb-4 pt-9 text-neutral-500 text-2xs font-bold">UNIVERSITY GROUPS</p>
        <div className="flex items-center px-4 py-2">
          <div className="flex items-center justify-center bg-white rounded-full gap-3 ">
            <div
              style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
              className="flex items-center justify-center bg-white rounded-full w-[40px] h-[40px]"
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
        <div className="flex gap-2 justify-evenly cursor-pointer my-4">
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
        </div>
      </>

      {SubscribedData?.community.length !== 0 ? (
        <Tabs tabs={tabData} tabAlign="center" />
      ) : (
        <div className="px-4 w-full text-center font-poppins text-neutral-400">
          <p>Add your university to join or create groups</p>
        </div>
      )}

      {showNewGroup && <CreateNewGroupBox setNewGroup={setShowNewGroup} />}
      <AssignGroupModerators assignUsers={assignUsers} setAssignUsers={setAssignUsers} id={currClickedID.id} isGroup={currClickedID.group} />
    </>
  )
}
