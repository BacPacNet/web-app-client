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
import { LuArrowUpDown, LuFilter } from 'react-icons/lu'
import { isEmpty } from '@/lib/utils'

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
  const [selectedCommunityImage, setSelectedCommunityImage] = useState(community?.communityLogoUrl.imageUrl)
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

  const isUserVerifiedForCommunity = useMemo(() => {
    return userProfileData?.email?.some((community) => community?.communityId === selectCommunityId)
  }, [community])

  const isFilterApplied = useMemo(() => !isEmpty(selectedFiltersMain) || !isEmpty(selectedTypeMain), [selectedFiltersMain, selectedTypeMain])

  const handleNewGroupModal = () => {
    openModal(<CreateNewGroupBox communityId={communityId || communityIdForNewGroup} setNewGroup={setShowNewGroup} />)
    toggleLeftNavbar && toggleLeftNavbar()
  }
  const handleAssignUsersModal = () => {
    openModal(<AssignGroupModerators assignUsers={assignUsers} setAssignUsers={setAssignUsers} id={currClickedID.id} isGroup={currClickedID.group} />)
  }
  const handleCommunityGroupFilter = () => {
    toggleLeftNavbar && toggleLeftNavbar()
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

  useEffect(() => {
    setSelectedCommunityImage(community?.communityLogoUrl.imageUrl)
  }, [community])

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
          selectedCommunityImage={selectedCommunityImage}
        />
      ),
    },

    {
      label: 'Create',
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
            selectedCommunityImage={selectedCommunityImage}
          />

          {isUserVerifiedForCommunity && (
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

  if (isLoading) return <UserListItemSkeleton />

  return (
    <>
      <div className="border-b-2 border-neutral-200 pb-4">
        <NavbarSubscribedUniversity
          userData={userData || {}}
          communityId={communityId}
          subscribedCommunities={subscribedCommunities as Community[]}
          handleCommunityClick={handleCommunityClick}
          isGroup={!!communityGroupId}
        />
      </div>

      <>
        <div className="flex gap-2 mt-4 py-2 items-center">
          <p className="text-xs text-neutral-500 font-bold  ">GROUPS</p>
          <div className="w-6 h-6 border-2 border-primary-500 overflow-hidden rounded-full flex justify-center items-center">
            <Image
              className="w-[16px] h-[16px] object-contain roundedfull overflow-hidden m-auto"
              src={(selectedCommunityImage as string) || avatar}
              width={16}
              height={16}
              alt=""
            />
          </div>
        </div>

        <GroupSearchBox placeholder="Search Groups" type="text" onChange={handleSearch} />

        <div className="flex gap-2 my-4">
          <div className="flex-1">
            <Buttons
              onClick={() => handleCommunityGroupFilter()}
              variant={isFilterApplied ? 'primary' : 'border'}
              className="h-10 w-full gap-1 text-xs"
            >
              Filter
              <LuFilter className={`h-3.5 w-3.5 ${isFilterApplied ? 'text-white' : 'text-primary-500'}`} />
            </Buttons>
          </div>

          <div className="flex-1">
            <Popover>
              <PopoverTrigger className="w-full">
                <Buttons variant="border" className="h-10 w-full gap-1 text-xs">
                  Sort
                  <LuArrowUpDown className="h-3.5 w-3.5 text-primary-500" />
                </Buttons>
              </PopoverTrigger>
              <PopoverContent className="w-32 px-2 py-0 border-none bg-white shadow-lg shadow-gray-light">
                <div className="flex flex-col justify-between">
                  {sortBy.map((item) => (
                    <p onClick={() => setSort(item)} key={item} className="capitalize text-neutral-800 cursor-pointer p-1 hover:bg-neutral-200">
                      {item}
                    </p>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </>
      <div className="h-fit">
        {subscribedCommunities?.length !== 0 ? (
          <Tabs tabs={tabData} tabAlign="center" className="my-4" labelSize="medium" />
        ) : (
          //  <CommunityGroupAll
          //    key={subscribedCommunities}
          //    communityGroups={subscribedCommunitiesAllGroups}
          //    showGroupTill={showGroupTill}
          //    setShowGroupTill={setShowGroupTill}
          //    currSelectedGroup={currSelectedGroup as Community}
          //    setCurrSelectedGroup={setCurrSelectedGroup}
          //    userData={userData}
          //    handleAssignUsersModal={handleAssignUsersModal}
          //    SetcurrClickedID={SetcurrClickedID}
          //    selectedCommuntyGroupdId={selectedCommuntyGroupdId}
          //    selectCommunityId={selectCommunityId}
          //    toggleLeftNavbar={toggleLeftNavbar}
          //  />
          <div className="px-4 w-full text-center font-poppins text-neutral-400">
            <p>Add your university to join or create groups</p>
          </div>
        )}
      </div>
    </>
  )
}
