import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { Spinner } from '@/components/spinner/Spinner'
import UserListItem from '@/components/Timeline/UserListItem'
import { useUsersProfileForConnections } from '@/services/user'
import { useUniStore } from '@/store/store'
import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa6'
import { GoSearch } from 'react-icons/go'
import ConnectionUserSelectModal from '../ConnectionModals/UniversitySearchConnectionModal'

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
  const [selectedFilters, setSelectedFilters] = useState({
    selectedRadio: '',
    studentYear: [],
    major: [],
    occupation: [],
    affiliation: [],
    university: { name: '', id: '' },
  })

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const { userProfileData } = useUniStore()
  const {
    data: userProfilesData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
  } = useUsersProfileForConnections(name, 10, !isFiltered)

  const userProfiles = userProfilesData?.pages.flatMap((page) => page.users).filter((user) => user._id !== userProfileData?.users_id) || []

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { scrollTop, scrollHeight, clientHeight } = ref.current

        if (scrollTop + clientHeight >= scrollHeight - 10 && hasNextPage && !isFetchingNextPage) {
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

  const renderUserProfileList = () => {
    if (isUserProfilesLoading) {
      return (
        <>
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
          <UserListItemSkeleton />
        </>
      )
    }
    return (
      <>
        {isFiltered
          ? filteredUsers?.map((item, index: number) => (
              <UserListItem
                key={index}
                id={item?.id}
                firstName={item?.firstName}
                lastName={item?.lastName}
                // university={item?.universityName || ''}
                university={''}
                study_year={item?.year || ''}
                degree={item?.degree || ''}
                role={item?.role || ''}
                affiliation={item?.affiliation || ''}
                major={item?.major || ''}
                occupation={item?.occupation || ''}
                imageUrl={item?.profileImageUrl || ''}
                type={'FIND_PEOPLE'}
                isFollowing={userProfileData?.following?.some((f) => f.userId === item.id) || false}
              />
            ))
          : userProfiles?.map((item, index: number) => (
              <UserListItem
                key={index}
                id={item?._id}
                firstName={item?.firstName}
                lastName={item?.lastName}
                university={item?.profile?.university || ''}
                study_year={item?.profile?.study_year || ''}
                degree={item?.profile?.degree || ''}
                role={item?.profile?.role || ''}
                affiliation={item?.profile?.affiliation || ''}
                major={item?.profile?.major || ''}
                occupation={item?.profile?.occupation || ''}
                imageUrl={item?.profile?.profile_dp?.imageUrl || ''}
                type={'FIND_PEOPLE'}
                isFollowing={item?.isFollowing}
              />
            ))}
      </>
    )
  }

  return (
    <>
      <div className="flex gap-4 justify-between items-center mb-2">
        <div className="w-full px-3 py-2 border border-neutral-200 shadow-sm rounded-lg flex items-center gap-4  h-10">
          <input
            onChange={(e) => {
              const input = e.target.value
              setName(input)

              if (isFiltered) {
                const trimmed = input.trim()

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
            }}
            type="text"
            value={name}
            className="text-xs w-full outline-none text-neutral-400"
            placeholder="Searching All Users"
          />
          <GoSearch className="text-neutral-500" size={20} />
        </div>
        <div
          onClick={openModal}
          className="cursor-pointer bg-[#F3F2FF] border border-[#E9E8FF] text-primary-500 h-10 w-10 flex items-center justify-center rounded-lg"
        >
          <FaFilter className="text-primary-500" />
        </div>
      </div>
      <div ref={ref} className="overflow-y-auto h-[85%] custom-scrollbar pb-10">
        {renderUserProfileList()}
      </div>
      {isFetchingNextPage && (
        <div className="text-center pt-2">
          {' '}
          <Spinner />
        </div>
      )}
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
        />
      )}
    </>
  )
}
