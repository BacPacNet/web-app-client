'use client'
import React, { useState, useEffect, useRef } from 'react'
import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import CollegeResult from '@/components/CollegeResult'
import {
  filterData,
  filterFacultyData,
  getFilteredAffiliationCounts,
  getFilteredMajorCounts,
  getFilteredYearCounts,
  getOccupationCounts,
} from '@/lib/communityGroup'
import { useGetCommunity } from '@/services/community-university'
import { degreeAndMajors, occupationAndDepartment, value } from '@/types/RegisterForm'
import { Controller, useForm } from 'react-hook-form'
import { BiChevronDown } from 'react-icons/bi'
import { FaXmark } from 'react-icons/fa6'
import { FiCamera } from 'react-icons/fi'
import InputBox from '@/components/atoms/Input/InputBox'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { useUsersProfileForConnections } from '@/services/user'
import { useUniStore } from '@/store/store'
import { Users } from '@/types/Connections'
import SelectedUserTags from '@/components/atoms/SelectedUserTags'

type User = {
  _id: string
  name: string
  email: string
  firstName: string
  profile: any
}

type Props = {
  individualsUsers: any[]
  setIndividualsUsers: (value: Users[] | ((prev: Users[]) => Users[])) => void
  setFilterUsers: (value: User[]) => void
  setFilterFacultyUsers: (value: User[]) => void
  setGroupName: (value: string) => void
  setGroupLogoImage: (value: File | null) => void
  groupLogoImage: File | null
}

const GroupChatModal = ({
  individualsUsers,
  setIndividualsUsers,
  setFilterFacultyUsers,
  setFilterUsers,
  setGroupName,
  setGroupLogoImage,
  groupLogoImage,
}: Props) => {
  const { userProfileData } = useUniStore()
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [showDropdown, setShowDropdown] = useState(false)
  const [universityError, setUniversityError] = useState(false)

  const [selectedUniversity, setSelectedUniversity] = useState<{ name: string; id: string }>({ name: '', id: '' })
  const [filteredYearCount, setFilteredYearsCount] = useState<Record<string, number>>()
  const [filteredMajorsCount, setFilteredMajorsCount] = useState<Record<string, number>>()
  const [filteredOccupationCount, setFilteredOccupationCount] = useState<Record<string, number>>()
  const [filteredAffiliationCount, setFilteredAffiliationCount] = useState<Record<string, number>>()

  const { data: communityData } = useGetCommunity(selectedUniversity?.id)

  const [searchInput, setSearchInput] = useState('')
  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(false)
  const {
    data,
    //fetchNextPage,
    //isFetchingNextPage,
    //hasNextPage,
    //isLoading: isUserProfilesLoading,
  } = useUsersProfileForConnections(searchInput, 10, !!searchInput)

  const userProfiles = data?.pages.flatMap((page) => page.users).filter((user) => user._id !== userProfileData?.users_id) || []

  const {
    register,
    watch,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      selectedIndividualsUsers: [],
      selectedRadio: '',
      studentYear: [],
      major: [],
      occupation: [],
      affiliation: [],
      title: '',
    },
  })

  //  const selectedIndividualsUsers = watch('selectedIndividualsUsers') || []
  const studentYear = watch('studentYear') || []
  const major = watch('major') || []
  const occupation = watch('occupation') || []
  const affiliation = watch('affiliation') || []
  const title = watch('title') || ''

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (showDropdown) inputRef.current?.focus()
  }, [showDropdown])

  useEffect(() => {
    setGroupName(title)
  }, [title])

  useEffect(() => {
    const allUsers = communityData?.users || []
    const allStudentUsers = allUsers.filter((user) => user.role == 'student')

    const filters = { year: studentYear, major: major }

    const filtered = filterData(allStudentUsers, filters)

    const yearOnlyFiltered = filterData(allStudentUsers, { year: studentYear, major: [] })
    const yearCounts = getFilteredYearCounts(yearOnlyFiltered)

    const majorCounts = getFilteredMajorCounts(filtered)

    setFilterUsers(filtered)
    setFilteredYearsCount(yearCounts)
    setFilteredMajorsCount(majorCounts)
  }, [studentYear, major, communityData])

  useEffect(() => {
    const allUsers = communityData?.users || []
    const allFacultyUsers = allUsers.filter((user) => user.role == 'faculty')

    const filters = { occupation: occupation, affiliation: affiliation }
    const filtered = filterFacultyData(allFacultyUsers, filters)

    const occupationOnlyFiltered = filterFacultyData(allFacultyUsers, { occupation: occupation, affiliation: [] })

    const occupationCounts = getOccupationCounts(occupationOnlyFiltered)

    const affiliationCounts = getFilteredAffiliationCounts(filtered)

    setFilterFacultyUsers(filtered)
    setFilteredOccupationCount(occupationCounts)
    setFilteredAffiliationCount(affiliationCounts)
  }, [occupation, affiliation])

  const removeUser = (userId: string) => {
    //const currentSelected = watch('selectedIndividualsUsers') as unknown as User[]
    //setValue('selectedIndividualsUsers', individualsUsers.filter((u) => u._id !== userId) as any)
    setIndividualsUsers((prev: any[]) => prev.filter((u) => u._id !== userId))
  }

  const handleSelectIndividuals = (e: React.MouseEvent, user: Users) => {
    e.preventDefault()
    e.stopPropagation()
    setShowSelectUsers(false)
    //const currentSelected = watch('selectedIndividualsUsers') as unknown as Users[]

    const isAlreadySelected = individualsUsers.some((u) => u._id === user._id)

    if (!isAlreadySelected) {
      setIndividualsUsers((prev) => [...prev, user])
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSearchInput('')
  }

  return (
    <div className="relative w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-medium text-sm text-neutral-900">
          Group Profile
        </label>
        <div className={` border-2 border-neutral-200 bg-white flex  items-center justify-center w-[100px] h-[100px] rounded-full`}>
          {groupLogoImage && (
            <Image
              width={96}
              height={96}
              className="w-24 h-24 rounded-full absolute  object-cover"
              src={URL.createObjectURL(groupLogoImage)}
              alt=""
            />
          )}
          <input style={{ display: 'none' }} type="file" id="CreateGroupLogoImage" onChange={(e: any) => setGroupLogoImage(e.target.files[0])} />

          {groupLogoImage ? (
            <label htmlFor="CreateGroupLogoImage" className="relative flex flex-col items-center gap-2 z-10  ">
              <div className="w-12 h-12 rounded-full bg-black opacity-50 absolute -z-10 top-1/2 -translate-y-1/2"></div>
              <FiCamera size={32} className="text-white" />
            </label>
          ) : (
            <label htmlFor="CreateGroupLogoImage" className="flex flex-col items-center gap-2">
              <FiCamera size={32} className="text-slate-400 z-30" />
            </label>
          )}
        </div>
      </div>
      {/* //name  */}
      <div className="flex gap-4 items-center justify-between">
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="name" className="font-medium text-sm text-neutral-900">
            Group Name
          </label>
          <InputBox
            className="text-xs"
            placeholder="Enter Group Name "
            type="title"
            {...register('title', {
              required: true,
            })}
          />

          {errors.title && <span className="text-red-500 text-2xs font-normal text-"> This field is required</span>}
        </div>
      </div>
      {/* start  */}
      <div className="relative w-full flex flex-col">
        <label htmlFor="inviteFriends" className="font-medium text-sm text-neutral-900 mb-2">
          Add Individuals
        </label>
        <div>
          <InputBox
            isCancel={searchInput ? true : false}
            onCancel={handleClear}
            onClick={() => setShowSelectUsers(true)}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search Users"
          />

          {showSelectUsers && (
            <div ref={dropdownRef} className="w-full mt-2 rounded-b-lg shadow-xl bg-white max-h-64 overflow-y-auto">
              {userProfiles.length > 0 ? (
                userProfiles.map((user) => (
                  <div
                    key={user._id}
                    onClick={(e) => handleSelectIndividuals(e, user)}
                    className="flex justify-between w-full hover:bg-neutral-200 px-6 py-2 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={user?.profile?.profile_dp?.imageUrl || avatar}
                        alt="dp"
                        width={44}
                        height={44}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold">{user?.firstName}</p>
                        <p className="text-2xs text-neutral-600">
                          {user?.profile?.role == 'student' ? `${user.profile.study_year} ` : user?.profile?.occupation}
                        </p>
                        <p className="text-2xs text-neutral-600">
                          {user?.profile?.role == 'student' ? user?.profile?.major : user?.profile?.affiliation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-neutral-500 py-4">No users found.</p>
              )}
            </div>
          )}
          <div className="flex flex-wrap mt-2">
            <SelectedUserTags users={individualsUsers} onRemove={(id) => removeUser(id as string)} />
          </div>
        </div>
      </div>
      {/* end  */}
      <div className="relative mb-2" ref={dropdownRef}>
        <label className="text-xs font-medium mb-2">University</label>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`w-full flex justify-between items-center border ${
            universityError ? 'border-destructive-600' : 'border-neutral-200'
          } rounded-lg p-3 text-xs text-neutral-700 h-10 bg-white shadow-sm`}
        >
          {selectedUniversity?.name || 'Select University'}
          {selectedUniversity?.name ? (
            <FaXmark
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setSelectedUniversity({ name: '', id: '' })
              }}
              className="w-4 h-4 ml-2"
            />
          ) : (
            <BiChevronDown className="w-4 h-4 ml-2" />
          )}
        </button>
        {universityError && <p className="text-destructive-600 text-xs mt-1">Select university to filter based on student or faculty.</p>}
        {showDropdown && (
          <div className="absolute left-0 top-full mt-2 w-full max-h-64 bg-white shadow-lg border border-neutral-300 rounded-lg z-50 overflow-y-auto custom-scrollbar">
            {userProfileData && userProfileData.email!.length > 0 ? (
              userProfileData.email!.map((university: any) => (
                <div
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedUniversity({ name: university.UniversityName, id: university?.communityId })
                    setShowDropdown(false)
                    setUniversityError(false)
                  }}
                  key={university?._id}
                  className="bg-white rounded-md hover:bg-surface-primary-50 py-1 cursor-pointer"
                >
                  <CollegeResult university={university} />
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg border-b border-neutral-200 text-black">
                <p className="p-3 text-gray-500">No results found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8 mb-4">
        <Controller
          name="studentYear"
          control={control}
          render={({ field }) => (
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <MultiSelectDropdown
                options={Object.keys(degreeAndMajors)}
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add By Year"
                label="Year (Students)"
                err={false}
                filteredCount={filteredYearCount}
                multiSelect={false}
                disabled={!selectedUniversity?.name?.length}
                setUniversityErr={setUniversityError}
              />
            </div>
          )}
        />
        <Controller
          name="major"
          control={control}
          render={({ field }) => (
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <MultiSelectDropdown
                options={value}
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add By Major"
                label="Major (Students)"
                err={false}
                search
                filteredCount={filteredMajorsCount}
                parentCategory={studentYear}
                disabled={!selectedUniversity?.name?.length}
                setUniversityErr={setUniversityError}
              />
            </div>
          )}
        />
      </div>

      <div className="flex flex-col gap-8">
        <Controller
          name="occupation"
          control={control}
          render={({ field }) => (
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <MultiSelectDropdown
                options={Object.keys(occupationAndDepartment)}
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add By Occupation"
                label="Occupation (Faculty)"
                err={false}
                search
                multiSelect={false}
                filteredCount={filteredOccupationCount}
                disabled={!selectedUniversity?.name?.length}
                setUniversityErr={setUniversityError}
              />
            </div>
          )}
        />
        <Controller
          name="affiliation"
          control={control}
          render={({ field }) => (
            <div
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <MultiSelectDropdown
                options={value}
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add By Affiliation"
                label="Affiliation/Department (Faculty)"
                err={false}
                search
                filteredCount={filteredAffiliationCount}
                parentCategory={occupation}
                disabled={!selectedUniversity?.name?.length}
                setUniversityErr={setUniversityError}
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}

export default GroupChatModal
