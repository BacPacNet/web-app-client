import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import UserListItem from '@/components/Timeline/UserListItem'
import { useUsersProfileForConnections } from '@/services/user'
import { useUniStore } from '@/store/store'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa6'
import ConnectionUserSelectModal from '../ConnectionModals/UniversitySearchConnectionModal'
import UserSearchInput from '@/components/atoms/UserSearchBox'

type User = {
  _id: string
  id: string
  firstName: string
  lastName: string
  degree: string
  major: string
  occupation: string
  affiliation: string
  universityName: string
  year: string
  role: string
  isVerified: boolean
  profileImageUrl: string | null
}

type UserList = User[]

export default function FindPeople() {
  const { userProfileData } = useUniStore()
  const [name, setName] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState<UserList>([])
  const [baseFilteredUsers, setBaseFilteredUsers] = useState<UserList>([])
  const [isFiltered, setIsFiltered] = useState(false)
  const [filteredYearCount, setFilteredYearsCount] = useState<Record<string, number>>()
  const [filteredMajorsCount, setFilteredMajorsCount] = useState<Record<string, number>>()
  const [filteredOccupationCount, setFilteredOccupationCount] = useState<Record<string, number>>()
  const [filteredAffiliationCount, setFilteredAffiliationCount] = useState<Record<string, number>>()
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    selectedRadio: '',
    studentYear: [],
    major: [],
    occupation: [],
    affiliation: [],
    university: { name: '' as string, id: '' as string, communityId: '' },
  })

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const {
    data: userProfilesData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
    refetch,
  } = useUsersProfileForConnections(
    name,
    10,
    true,

    selectedFilters?.university?.name ?? userProfileData?.university_name,
    selectedFilters.studentYear,
    selectedFilters.major,
    selectedFilters.occupation,
    selectedFilters.affiliation
  )

  useEffect(() => {
    if (
      selectedFilters?.university?.name ||
      selectedFilters?.studentYear?.length ||
      selectedFilters?.major?.length ||
      selectedFilters?.occupation?.length ||
      selectedFilters?.affiliation?.length
    ) {
      setIsFilterLoading(true)
      refetch().finally(() => setIsFilterLoading(false))
    }
  }, [
    selectedFilters?.university?.name,
    selectedFilters?.studentYear,
    selectedFilters?.major,
    selectedFilters?.occupation,
    selectedFilters?.affiliation,
  ])

  const userProfiles = userProfilesData?.pages.flatMap((page) => page.users).filter((user) => user._id !== userProfileData?.users_id) || null

  //  useInfiniteScroll({
  //    containerRef: ref,
  //    onBottomReach: () => {
  //      fetchNextPage()
  //    },
  //    deps: [fetchNextPage, hasNextPage, isFetchingNextPage],
  //  })

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

  const renderUserProfileList = useCallback(() => {
    if (userProfiles === null) return <UserListItemSkeleton count={8} />
    if (isUserProfilesLoading || isFilterLoading) return <UserListItemSkeleton count={8} />
    if (userProfiles.length === 0) return <p className="text-center my-4 text-2sm text-neutral-600 font-semibold">No User Found</p>

    return userProfiles.map((item, index) => (
      <UserListItem
        key={index}
        id={item._id}
        firstName={item.firstName}
        lastName={item.lastName}
        university={item.profile?.university || ''}
        study_year={item.profile?.study_year || ''}
        degree={item.profile?.degree || ''}
        role={item.profile?.role || ''}
        affiliation={item.profile?.affiliation || ''}
        major={item.profile?.major || ''}
        occupation={item.profile?.occupation || ''}
        imageUrl={item.profile?.profile_dp?.imageUrl || ''}
        type={'FIND_PEOPLE'}
        isFollowing={item.isFollowing}
      />
    ))
  }, [isUserProfilesLoading, isFilterLoading, userProfiles])

  const handleClear = () => {
    setSelectedFilters({
      selectedRadio: '',
      studentYear: [],
      major: [],
      occupation: [],
      affiliation: [],
      university: { name: '', id: '', communityId: '' },
    })
  }

  const handleChange = (value: string) => {
    setName(value)

    if (isFiltered) {
      const trimmed = value.trim()

      if (trimmed === '') {
        setFilteredUsers(baseFilteredUsers)
      } else {
        const lowerInput = trimmed.toLowerCase()
        const searched = baseFilteredUsers.filter((user) => {
          const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
          const match = fullName.includes(lowerInput)
          return match
        })
        setFilteredUsers(searched)
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-4 justify-between items-center mb-2 flex-shrink-0">
        <div className="flex px-6 w-full gap-4">
          <UserSearchInput value={name} onChange={(value) => handleChange(value)} />
          <div
            onClick={openModal}
            className="cursor-pointer bg-[#F3F2FF] border border-[#E9E8FF] text-primary-500 h-10 w-10 flex items-center justify-center rounded-lg"
          >
            <FaFilter className="text-primary-500" />
          </div>
        </div>
      </div>
      <div ref={ref} className="flex-1 relative overflow-y-auto custom-scrollbar px-2">
        {renderUserProfileList()}
        {isFetchingNextPage && (
          <div className="text-center pt-2">
            <UserListItemSkeleton count={1} />
          </div>
        )}
      </div>

      {isModalOpen && (
        <ConnectionUserSelectModal
          closeModal={closeModal}
          setFilteredUsers={(users) => {
            setFilteredUsers(users)
            setBaseFilteredUsers(users)
          }}
          setIsFiltered={setIsFiltered}
          filteredYearCount={filteredYearCount}
          setFilteredYearsCount={setFilteredYearsCount}
          filteredMajorsCount={filteredMajorsCount}
          setFilteredMajorsCount={setFilteredMajorsCount}
          filteredOccupationCount={filteredOccupationCount}
          setFilteredOccupationCount={setFilteredOccupationCount}
          filteredAffiliationCount={filteredAffiliationCount}
          setFilteredAffiliationCount={setFilteredAffiliationCount}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          handleClear={handleClear}
        />
      )}
    </div>
  )
}
