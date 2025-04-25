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
import { useGetCommunityFromUniversityId } from '@/services/community-university'
import { useUniversitySearch } from '@/services/universitySearch'
import { degreeAndMajors, occupationAndDepartment, value } from '@/types/RegisterForm'
import { Controller, useForm } from 'react-hook-form'
import { BiChevronDown } from 'react-icons/bi'
import { FaXmark } from 'react-icons/fa6'
import { FiCamera } from 'react-icons/fi'
import InputBox from '@/components/atoms/Input/InputBox'
import { useEditGroupChat, useGetUserFollowingAndFollowers } from '@/services/Messages'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { replaceImage } from '@/services/uploadImage'
import { closeModal } from '../Modal/ModalManager'
import Buttons from '@/components/atoms/Buttons'
import { Spinner } from '@/components/spinner/Spinner'

const EditGroupChatModal = ({ chatId, groupLogo, groupCurrentName }: { chatId: string; groupLogo: string; groupCurrentName: string }) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [universityError, setUniversityError] = useState(false)

  const [selectedUniversity, setSelectedUniversity] = useState<{ name: string; id: string }>({ name: '', id: '' })
  const [filteredYearCount, setFilteredYearsCount] = useState<Record<string, number>>()
  const [filteredMajorsCount, setFilteredMajorsCount] = useState<Record<string, number>>()
  const [filteredOccupationCount, setFilteredOccupationCount] = useState<Record<string, number>>()
  const [filteredAffiliationCount, setFilteredAffiliationCount] = useState<Record<string, number>>()

  const [selectedGroupUser, setSelectedGroupUser] = useState<any>(null)
  const [groupLogoImage, setGroupLogoImage] = useState<File | null>(null)
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false)
  const [filterUsers, setFilterUsers] = useState<any[]>([])
  const [filterFacultyUsers, setFilterFacultyUsers] = useState<any[]>([])
  const [groupName, setGroupName] = useState('')

  const { data: universitiesData } = useUniversitySearch(searchTerm || 'india', 1, 10)
  const universities = universitiesData?.result?.universities

  const { data: communityData } = useGetCommunityFromUniversityId(selectedUniversity?.id)

  const [searchInput, setSearchInput] = useState('')
  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(false)
  const { data } = useGetUserFollowingAndFollowers(searchInput)
  const { mutate: editGroup, isPending } = useEditGroupChat(chatId)
  const {
    register,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      selectedRadio: '',
      studentYear: [],
      major: [],
      occupation: [],
      affiliation: [],
      title: groupCurrentName || '',
    },
  })

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

  const handleGroupChatClick = async () => {
    let ImageData
    if (groupLogoImage) {
      setIsImageLoading(true)
      const imagedata: any = await replaceImage(groupLogoImage, '')
      ImageData = { groupLogo: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }
    }

    const mergedUsers = [selectedGroupUser, ...filterUsers, ...filterFacultyUsers]
    const uniqueUsers = Array.from(new Map(mergedUsers.map((user) => [user.id, user])).values())
    const dataToPush = {
      ...(ImageData?.groupLogo && { groupLogo: ImageData.groupLogo }),
      groupName: groupName,

      users: uniqueUsers,
    }

    editGroup(dataToPush)
    setIsImageLoading(false)
    closeModal()
  }

  return (
    <div className="relative w-full h-[400px] flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-medium text-sm text-neutral-900">
          Edit Profile
        </label>
        <div className={` border-2 border-neutral-200 bg-white flex  items-center justify-center w-[100px] h-[100px] rounded-full`}>
          {groupLogoImage && !groupLogo?.length ? (
            <img className="w-24 h-24 rounded-full absolute  object-cover" src={URL.createObjectURL(groupLogoImage)} alt="" />
          ) : (
            ''
          )}
          {!groupLogoImage && groupLogo?.length ? <img className="w-24 h-24 rounded-full absolute  object-cover" src={groupLogo} alt="" /> : ''}
          {groupLogoImage && groupLogo?.length ? (
            <img className="w-24 h-24 rounded-full absolute  object-cover" src={URL.createObjectURL(groupLogoImage)} alt="" />
          ) : (
            ''
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
            isCancel={true}
            onCancel={() => setShowSelectUsers(false)}
            onClick={() => setShowSelectUsers(true)}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search Users"
          />

          {showSelectUsers && (
            <div ref={dropdownRef} className="w-full mt-2 rounded-b-lg shadow-xl bg-white max-h-64 overflow-y-auto">
              {data?.user?.length > 0 ? (
                data.user.map((user: any) => (
                  <div
                    key={user._id}
                    // onClick={() => handleUserClick(user._id)}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowSelectUsers(false)
                      setSelectedGroupUser({ ...user, id: user?._id })
                    }}
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

          {selectedGroupUser?.firstName ? (
            <div className="flex items-center gap-4 mt-4">
              <Image
                src={selectedGroupUser?.profile?.profile_dp?.imageUrl || avatar}
                alt="dp"
                width={44}
                height={44}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold">{selectedGroupUser?.firstName}</p>
                {/* <p className="text-2xs text-neutral-600">{selectedGroupUser?.profile?.university_name || ''}</p>
              <p className="text-2xs text-neutral-600">
                {selectedGroupUser?.profile?.study_year ? `${selectedGroupUser.profile.study_year} Year` : ''} {selectedGroupUser?.profile?.degree}
              </p> */}
                <p className="text-2xs text-neutral-600">
                  {selectedGroupUser?.profile?.role == 'student'
                    ? `${selectedGroupUser.profile.study_year} `
                    : selectedGroupUser?.profile?.occupation}
                </p>
                <p className="text-2xs text-neutral-600">
                  {selectedGroupUser?.profile?.role == 'student' ? selectedGroupUser?.profile?.major : selectedGroupUser?.profile?.affiliation}
                </p>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      {/* end  */}
      <div className="relative mb-2" ref={dropdownRef}>
        <label className="text-xs font-medium mb-2">University</label>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`w-full flex justify-between items-center border ${
            universityError ? 'border-destructive-600' : 'border-neutral-200'
          } rounded-lg p-3 text-xs text-neutral-400 h-10 bg-white shadow-sm`}
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
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 outline-none"
              ref={inputRef}
            />
            {universities?.length > 0 ? (
              universities.map((university: any) => (
                <div
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedUniversity({ name: university.name, id: university?._id })
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

      <Buttons disabled={isPending} onClick={handleGroupChatClick} className="w-full my-4">
        {isPending || isImageLoading ? <Spinner /> : 'Edit Group'}
      </Buttons>
      <div className=" min-h-[10px] w-4"></div>
    </div>
  )
}

export default EditGroupChatModal
