'use client'
import GroupSearchBox from '@/components/atoms/GroupSearchBox'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { useGetFilteredSubscribedCommunities, useGetSubscribedCommunties } from '@/services/university-community'
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
import { openModal } from '../Modal/ModalManager'
import CommunityGroupFilterComponent from '../CommunityGroupFilter'
import Buttons from '@/components/atoms/Buttons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { sortBy } from '@/types/CommuityGroup'
import useCookie from '@/hooks/useCookie'
import useDebounce from '@/hooks/useDebounce'

interface Props {
  setActiveMenu: (activeMenu: string) => void
  toggleLeftNavbar: () => void | null
}

export default function NavbarUniversityItem({ setActiveMenu, toggleLeftNavbar }: Props) {
  const { userData, userProfileData } = useUniStore()
  const [cookieValue] = useCookie('uni_user_token')

  const router = useRouter()
  const { communityId, groupId: communityGroupId }: { communityId: string; groupId: string } = useParams()
  const [currSelectedGroup, setCurrSelectedGroup] = useState<Community>()
  const [currClickedID, SetcurrClickedID] = useState<any>({ id: null, group: false })
  const [showNewGroup, setShowNewGroup] = useState<boolean>(false)
  const [selectedFiltersMain, setSelectedFiltersMain] = useState<Record<string, string[]>>({})
  const [selectedTypeMain, setSelectedTypeMain] = useState<string[]>([])
  const [sort, setSort] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 1000)
  const [assignUsers, setAssignUsers] = useState(false)
  const [showGroupTill, setShowGroupTill] = useState(5)
  const [community, setCommunity] = useState<Community>()
  const [selectCommunityId, selectedCommuntyGroupdId] = [communityId || community?._id, communityGroupId]
  const { data: subscribedCommunities, isFetching, isLoading } = useGetSubscribedCommunties()
  const [communityOpen, setCommunityOpen] = useState(false)

  const targetCommunityId = subscribedCommunities?.[0]?._id
  const communityIdForNewGroup = userProfileData?.email?.find((item) => item.communityId === targetCommunityId)?.communityId ?? ''

  const { mutate: mutateFilterCommunityGroups } = useGetFilteredSubscribedCommunities(community?._id)

  const handleCommunityClick = (index: number) => {
    handleUniversityClick(index)
    setCurrSelectedGroup(community)
    setActiveMenu('')
    toggleLeftNavbar && toggleLeftNavbar()
  }

  const isUserJoinedSelectedCommunity = useMemo(() => {
    return community?.users?.some((user) => user?.id?.toString() === userData?.id)
  }, [community])

  const handleNewGroupModal = () => {
    openModal(<CreateNewGroupBox communityId={communityId || communityIdForNewGroup} setNewGroup={setShowNewGroup} />)
  }
  const handleAssignUsersModal = () => {
    openModal(<AssignGroupModerators assignUsers={assignUsers} setAssignUsers={setAssignUsers} id={currClickedID.id} isGroup={currClickedID.group} />)
  }
  const handleCommunityGroupFilter = () => {
    openModal(
      <CommunityGroupFilterComponent
        communityId={community?._id || ''}
        setSelectedFiltersMain={setSelectedFiltersMain}
        selectedFiltersMain={selectedFiltersMain}
        setSelectedTypeMain={setSelectedTypeMain}
        selectedTypeMain={selectedTypeMain}
        sort={sort}
      />
    )
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const subscribedCommunitiesAllGroups = useMemo(() => {
    const groups = communityId
      ? subscribedCommunities?.find((community) => community._id === communityId)?.communityGroups
      : subscribedCommunities?.[0]?.communityGroups
    return groups?.filter((group) => group.title.toLowerCase().includes(debouncedSearchQuery))
  }, [subscribedCommunities, communityId, debouncedSearchQuery])

  const joinedSubscribedCommunitiesGroup = useMemo(() => {
    const selectedCommunityGroup = subscribedCommunities?.find((community) => community?._id === (communityId || subscribedCommunities?.[0]._id))
      ?.communityGroups
    return selectedCommunityGroup
      ?.filter(
        (userCommunityGroup) =>
          userCommunityGroup?.users?.some((selectCommunityGroup) => selectCommunityGroup?.userId?.toString() === userData?.id?.toString())
      )
      ?.filter((group) => group.title.toLowerCase().includes(debouncedSearchQuery))
  }, [subscribedCommunities, communityId, userData, debouncedSearchQuery])

  const subscribedCommunitiesMyGroup = useMemo(() => {
    const groups = subscribedCommunities
      ?.find((community) => community._id === (communityId || subscribedCommunities?.[0]._id))
      ?.communityGroups.filter((communityGroup) => communityGroup.adminUserId === userData?.id)
    return groups?.filter((group) => group.title.toLowerCase().includes(debouncedSearchQuery))
  }, [subscribedCommunities, communityId, userData, debouncedSearchQuery])

  useEffect(() => {
    if (communityId && subscribedCommunities) {
      setCommunity(subscribedCommunities.find((community) => community._id === communityId))
    } else if (subscribedCommunities) {
      setCommunity(subscribedCommunities[0] as Community)
    }
  }, [subscribedCommunities, communityId])

  //sort
  useEffect(() => {
    const data = { selectedType: selectedTypeMain, selectedFilters: selectedFiltersMain, sort }
    if (cookieValue && community?._id && (selectedFiltersMain?.length || selectedTypeMain?.length || sort.length)) {
      mutateFilterCommunityGroups(data)
    }
  }, [sort, cookieValue, community?._id])

  const tabData = [
    {
      label: 'All',
      content: (
        <CommunityGroupAll
          key={subscribedCommunities}
          communityGroups={subscribedCommunitiesAllGroups}
          showGroupTill={showGroupTill}
          setShowGroupTill={setShowGroupTill}
          currSelectedGroup={currSelectedGroup as Community}
          setCurrSelectedGroup={setCurrSelectedGroup}
          userData={userData}
          handleAssignUsersModal={handleAssignUsersModal}
          SetcurrClickedID={SetcurrClickedID}
          selectedCommuntyGroupdId={selectedCommuntyGroupdId}
          selectCommunityId={selectCommunityId}
          toggleLeftNavbar={toggleLeftNavbar}
        />
      ),
    },
    {
      label: 'Joined',
      content: (
        <CommunityGroupAll
          key={joinedSubscribedCommunitiesGroup}
          communityGroups={joinedSubscribedCommunitiesGroup}
          showGroupTill={showGroupTill}
          setShowGroupTill={setShowGroupTill}
          currSelectedGroup={currSelectedGroup as Community}
          setCurrSelectedGroup={setCurrSelectedGroup}
          userData={userData}
          handleAssignUsersModal={handleAssignUsersModal}
          SetcurrClickedID={SetcurrClickedID}
          selectedCommuntyGroupdId={selectedCommuntyGroupdId}
          selectCommunityId={selectCommunityId}
          toggleLeftNavbar={toggleLeftNavbar}
        />
      ),
    },
    {
      label: 'Your Group',
      content: (
        <div>
          <CommunityGroupAll
            key={subscribedCommunitiesMyGroup}
            communityGroups={subscribedCommunitiesMyGroup}
            showGroupTill={showGroupTill}
            setShowGroupTill={setShowGroupTill}
            currSelectedGroup={currSelectedGroup as Community}
            setCurrSelectedGroup={setCurrSelectedGroup}
            userData={userData}
            handleAssignUsersModal={handleAssignUsersModal}
            SetcurrClickedID={SetcurrClickedID}
            selectedCommuntyGroupdId={selectedCommuntyGroupdId}
            selectCommunityId={selectCommunityId}
            toggleLeftNavbar={toggleLeftNavbar}
          />

          {isUserJoinedSelectedCommunity && (
            <div className="flex justify-center items-center p-2">
              <button onClick={() => handleNewGroupModal()} className="bg-[#6647FF] py-2 w-11/12  rounded-lg text-white">
                Create Group
              </button>
            </div>
          )}
        </div>
      ),
    },
  ]

  const handleUniversityClick = (index: React.SetStateAction<number>) => {
    setCommunityOpen(false)
    const indextoPush = Number(index)
    setCommunity(subscribedCommunities?.[indextoPush] as Community)
    router.push(`/community/${subscribedCommunities?.[indextoPush]._id}`)
  }

  if (isFetching || isLoading) return <UserListItemSkeleton />

  return (
    <>
      <NavbarSubscribedUniversity
        userData={userData || {}}
        communityId={communityId}
        subscribedCommunities={subscribedCommunities as Community[]}
        handleCommunityClick={handleCommunityClick}
      />

      <>
        <p className="px-4 pb-4 pt-9 text-neutral-500 text-2xs font-bold">UNIVERSITY GROUPS</p>
        <div className="flex justify-between gap-4 px-4 w-full pb-4">
          <Buttons onClick={() => handleCommunityGroupFilter()} className="w-32" size="extra_small" variant="border_primary">
            Filter
          </Buttons>
          <Popover>
            <PopoverTrigger>
              <div className="w-32 border border-primary text-primary text-2xs py-1 px-2 rounded-md active:scale-95 transition-transform duration-150">
                Sort
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-32 px-2 py-0 border-none bg-white shadow-lg shadow-gray-light">
              <div className="flex flex-col justify-between">
                {sortBy.map((item) => (
                  <p onClick={() => setSort(item)} key={item} className="capitalize cursor-pointer">
                    {item}
                  </p>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center px-4 py-2 w-full">
          <div className="flex items-center justify-start bg-white rounded-full gap-3 w-full">
            <div
              style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
              className="flex items-center justify-center bg-white rounded-full w-[40px] h-[40px] cursor-pointer"
            >
              <Popover open={communityOpen} onOpenChange={() => setCommunityOpen(!communityOpen)}>
                <PopoverTrigger asChild>
                  <Image
                    width={40}
                    height={40}
                    className="w-[40px] h-[40px] object-cover rounded-full"
                    src={community?.communityLogoUrl?.imageUrl || avatar}
                    alt="communtiy image"
                  />
                </PopoverTrigger>
                <PopoverContent className="bg-white border-none shadow-lg w-fit px-0 rounded-full flex flex-col gap-2 cursor-pointer">
                  {subscribedCommunities?.map((community, index) => {
                    return (
                      <Image
                        key={community?._id}
                        onClick={() => handleUniversityClick(index)}
                        width={40}
                        height={40}
                        className="w-[40px] h-[40px] object-cover rounded-full"
                        src={community?.communityLogoUrl?.imageUrl || avatar}
                        alt="communtiy image"
                      />
                    )
                  })}
                </PopoverContent>
              </Popover>
            </div>
            <GroupSearchBox placeholder="Search Groups" type="text" onChange={handleSearch} />
          </div>
        </div>
      </>

      {subscribedCommunities?.length !== 0 ? (
        <Tabs tabs={tabData} tabAlign="left" className="my-4" />
      ) : (
        <div className="px-4 w-full text-center font-poppins text-neutral-400">
          <p>Add your university to join or create groups</p>
        </div>
      )}
    </>
  )
}
