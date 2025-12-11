'use client'
import GroupSearchBox from '@/components/atoms/GroupSearchBox'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { useGetSubscribedCommunties } from '@/services/university-community'
import { useFilterCommunityGroups } from '@/hooks/useFilterCommunityGroups'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import Tabs from '../Tabs'
import AssignGroupModerators from '@/components/communityUniversity/AssignGroupModerators'
import { useUniStore } from '@/store/store'
import CreateNewGroupBox from '../CreateNewGroupBox'
import CommunityGroupAll from './Tabs/communityGroupAll'
import NavbarSubscribedUniversity from './NavbarSubscribedUniversity'
import { Community } from '@/types/Community'
import CommunityGroupFilterComponent from '../CommunityGroupFilter'
import Buttons from '@/components/atoms/Buttons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import placeholder from '@/assets/Logo Circle.svg'

import useCookie from '@/hooks/useCookie'
import useDebounce from '@/hooks/useDebounce'
import { LuArrowUpDown, LuFilter } from 'react-icons/lu'
import { isEmpty } from '@/lib/utils'
import { BsSortDownAlt, BsSortUpAlt } from 'react-icons/bs'
import { useModal } from '@/context/ModalContext'
import { status } from '@/types/CommuityGroup'
import GenericInfoModal from '../VerifyUniversityToJoinModal/VerifyUniversityToJoinModal'
import { LeftNavGroupsCommunityHolder } from '../LeftNavGroupsCommunityHolder'
import { IoIosArrowDown } from 'react-icons/io'
import mixpanel from 'mixpanel-browser'
import { TRACK_EVENT } from '@/content/constant'

interface Props {
  setActiveMenu: (activeMenu: string) => void
  toggleLeftNavbar: () => void | null
}

const sortOptions = [
  {
    label: 'Newest',
    value: 'latest',
    // icon: <BsSortUpAlt className="text-primary-500" />,
  },
  {
    label: 'Oldest',
    value: 'oldest',
    // icon: <BsSortDownAlt className="text-primary-500" />,
  },
  {
    label: 'Alphabet A-Z',
    value: 'alphabetAsc',
    // icon: <BsSortUpAlt className="text-primary-500" />,
  },
  {
    label: 'Alphabet Z-A',
    value: 'alphabetDesc',
    // icon: <BsSortDownAlt className="text-primary-500" />,
  },
  {
    label: 'User Count',
    value: 'userCountAsc',
    icon: <BsSortUpAlt className="text-primary-500" />,
  },
  {
    label: 'User Count ',
    value: 'userCountDesc',
    icon: <BsSortDownAlt className="text-primary-500" />,
  },
  //   {
  //     label: 'Users',
  //     value: 'users',
  //   },
]

export default function NavbarUniversityItem({ setActiveMenu, toggleLeftNavbar }: Props) {
  const { userData, userProfileData } = useUniStore()
  const { openModal } = useModal()
  const [cookieValue] = useCookie('uni_user_token')
  const [selectedCommunityGroupCommunityId, setSelectedCommunityGroupCommunityId] = useCookie('selectedCommunityGroupCommunityId')
  const [isOpen, setIsOpen] = useState(false)
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const { communityId, groupId: communityGroupId }: { communityId: string; groupId: string } = useParams()
  const [currSelectedGroup, setCurrSelectedGroup] = useState<Community>()

  const [currClickedID, SetcurrClickedID] = useState<any>({ id: null, group: false })
  const [showNewGroup, setShowNewGroup] = useState<boolean>(false)
  const [selectedFiltersMain, setSelectedFiltersMain] = useState<Record<string, string[]>>({})
  const [selectedTypeMain, setSelectedTypeMain] = useState<string[]>([])
  const [selectedLabel, setSelectedLabel] = useState<string[]>([])
  const [sort, setSort] = useState<string>('userCountDesc')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 1000)
  const [assignUsers, setAssignUsers] = useState(false)
  const [showGroupTill, setShowGroupTill] = useState(5)
  const [community, setCommunity] = useState<Community>()
  const [selectedCommunityImage, setSelectedCommunityImage] = useState(community?.communityLogoUrl.imageUrl || placeholder)
  const [selectCommunityId, selectedCommuntyGroupdId] = [communityId || community?._id, communityGroupId]
  const { data: subscribedCommunities, isLoading } = useGetSubscribedCommunties()
  const { applyFilters, filteredCommunityGroups, mutateFilterCommunityGroups } = useFilterCommunityGroups({
    communityId: community?._id,
    selectedType: selectedTypeMain,
    selectedFilters: selectedFiltersMain,
    sort,
  })

  const handleCommunityClick = (index: number) => {
    handleUniversityClick(index)
    setCurrSelectedGroup(community)
    setActiveMenu('')
    toggleLeftNavbar && toggleLeftNavbar()
  }

  const isUserVerifiedForCommunity: boolean = userProfileData?.email?.some((community) => community?.communityId === selectCommunityId) || false

  const canUserCreateGroup = community?.users.some((user) => user._id === userData?.id) && isUserVerifiedForCommunity

  const isFilterApplied = useMemo(
    () => !isEmpty(selectedFiltersMain) || !isEmpty(selectedTypeMain) || !isEmpty(selectedLabel),
    [selectedFiltersMain, selectedTypeMain, selectedLabel]
  )

  const handleNewGroupModal = () => {
    if (!canUserCreateGroup) {
      openModal(
        <GenericInfoModal
          buttonLabel="Verify University Email"
          redirectUrl="/setting/university-verification"
          title="Verify Account to Create Groups"
          description="Verify your account to unlock group creation and start building your own community. Please complete verification to continue."
        />,
        'w-[350px] sm:w-[490px] hideScrollbar'
      )
    } else {
      openModal(
        <CreateNewGroupBox
          communityName={community?.name || 'Sd'}
          communityId={community?._id || ''}
          setNewGroup={setShowNewGroup}
          isCommunityAdmin={community?.adminId.includes(userData?.id?.toString() || '') || false}
        />,
        'h-[80vh] w-[350px] sm:w-[490px] hideScrollbar'
      )
    }
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
        setSelectedLabel={setSelectedLabel}
        selectedLabel={selectedLabel}
        sort={sort}
      />
    )
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  useEffect(() => {
    if (selectedCommunityGroupCommunityId) {
      setSelectedCommunityImage(
        subscribedCommunities?.find((community) => community._id === selectedCommunityGroupCommunityId)?.communityLogoUrl.imageUrl || placeholder
      )
    } else {
      setSelectedCommunityImage(community?.communityLogoUrl.imageUrl || placeholder)
    }
  }, [community])

  const subscribedCommunitiesAllGroups = useMemo(() => {
    const groups = filteredCommunityGroups?.communityGroups || []
    return groups?.filter((group: { title: string }) => group.title.toLowerCase().includes(debouncedSearchQuery))
  }, [debouncedSearchQuery, filteredCommunityGroups])

  const joinedSubscribedCommunitiesGroup = useMemo(() => {
    const groups = filteredCommunityGroups?.communityGroups || []

    return groups
      .filter(
        (group: { users: any[]; adminUserId: string }) =>
          group.adminUserId === userData?.id ||
          group.users?.some((u: { _id: string; status: string }) => u._id === userData?.id && u.status === status.accepted)
      )
      .filter((group: { title: string }) => group.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
  }, [userData, debouncedSearchQuery, filteredCommunityGroups])

  const subscribedCommunitiesMyGroup = useMemo(() => {
    const groups = filteredCommunityGroups?.communityGroups || []

    return groups
      .filter((group: { adminUserId: string }) => group.adminUserId === userData?.id)
      .filter((group: { title: string }) => group.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
  }, [userData, debouncedSearchQuery, filteredCommunityGroups])
  useEffect(() => {
    if (selectedCommunityGroupCommunityId && subscribedCommunities) {
      setCommunity(subscribedCommunities?.find((community) => community._id === selectedCommunityGroupCommunityId))
    } else if (subscribedCommunities) {
      setCommunity(subscribedCommunities[0] as Community)
    }
  }, [subscribedCommunities, communityId, selectedCommunityGroupCommunityId])

  // Filter community groups - automatically triggered by useFilterCommunityGroups hook

  const handleSelect = (value: string) => {
    setSort(value)
    setIsOpen(false)
  }

  const handleCommunityGroupClick = (communityId: string, logo: string) => {
    setSelectedCommunityImage(logo)
    setCommunity(subscribedCommunities?.find((community) => community._id === communityId))
    const expirationDateForLoginData = new Date(Date.now() + 400 * 24 * 60 * 60 * 1000).toUTCString()
    // roughly 400 days from now — Chrome's current cap
    setSelectedCommunityGroupCommunityId(communityId, expirationDateForLoginData)
    applyFilters()
    setOpen(false)
  }

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
          selectedCommunityImage={selectedCommunityImage}
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
          <div className="flex justify-center items-center p-2">
            <button onClick={() => handleNewGroupModal()} className="bg-[#6647FF] py-2 w-11/12  rounded-lg text-white">
              Create Group
            </button>
          </div>

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
        </div>
      ),
    },
  ]

  const handleUniversityClick = (index: React.SetStateAction<number>) => {
    const indextoPush = Number(index)
    mixpanel.track(TRACK_EVENT.UNIVERSITY_COMMUNITY_PAGE_VIEW, {
      communityId: subscribedCommunities?.[indextoPush]._id,
      communityName: subscribedCommunities?.[indextoPush]?.name,
    })
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
        <div className="flex gap-2 mt-4 py-2 items-center ">
          <p className="text-xs text-neutral-500 font-bold  ">GROUPS</p>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className=" cursor-pointer  overflow-hidden rounded-full flex justify-center items-center">
                <Image
                  className="w-6 h-6 object-contain rounded-full overflow-hidden m-auto"
                  src={(selectedCommunityImage as string) || placeholder}
                  width={24}
                  height={24}
                  alt=""
                  onError={() => setSelectedCommunityImage(placeholder)}
                />
                <IoIosArrowDown size={16} strokeWidth={3} />
              </div>
            </PopoverTrigger>
            <PopoverContent className="relative w-[236px]  left-6 top-0  p-5 border-none shadow-lg bg-white shadow-gray-light">
              <div className=" w-full flex flex-col gap-2">
                {subscribedCommunities?.map((community) => (
                  <LeftNavGroupsCommunityHolder
                    key={community._id}
                    name={community.name}
                    logo={community.communityLogoUrl.imageUrl}
                    communityId={community._id}
                    handleChange={handleCommunityGroupClick}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <GroupSearchBox placeholder="Search Groups" type="text" onChange={handleSearch} />

        <div className="flex gap-2 my-4">
          <div className="flex-1">
            <Buttons onClick={() => handleCommunityGroupFilter()} variant={'border'} size="small" className="h-9 w-full gap-1 relative">
              {isFilterApplied && <span className="w-[5px] h-[5px] bg-red-600 rounded-full"></span>}
              Filter
              <LuFilter className={`h-3.5 w-3.5 ${'text-primary-500'}`} />
            </Buttons>
          </div>

          <div className="flex-1">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger className="w-full">
                <Buttons variant="border" size="small" className="h-9 w-full gap-1">
                  Sort
                  <LuArrowUpDown className="h-3.5 w-3.5 text-primary-500" />
                </Buttons>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-32 border-none bg-white shadow-lg shadow-gray-light">
                <div className="flex flex-col justify-between">
                  {sortOptions.map(({ label, value, icon }) => (
                    <p
                      key={value}
                      onClick={() => handleSelect(value)}
                      className={`flex items-center  gap-2 cursor-pointer p-2 text-neutral-800 hover:bg-neutral-200 transition ${
                        sort === value ? 'bg-neutral-300 font-medium' : ''
                      }`}
                    >
                      <span className="capitalize text-xs w-max">{label}</span>
                      {icon && icon}
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
