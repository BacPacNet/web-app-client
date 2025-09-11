'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { FiCamera } from 'react-icons/fi'
import InputBox from '@/components/atoms/Input/InputBox'
import { useEditGroupChat } from '@/services/Messages'
import Image from 'next/image'
import Buttons from '@/components/atoms/Buttons'
import { Spinner } from '@/components/spinner/Spinner'
import { useUsersProfileForConnections } from '@/services/user'
import { Controller, useForm } from 'react-hook-form'
import { useUniStore } from '@/store/store'
import SelectedUserTags from '@/components/atoms/SelectedUserTags'
import { Users } from '@/types/Connections'
import { ChatUser, CommunityChat } from '@/types/constants'
import { useUploadToS3 } from '@/services/upload'
import { UPLOAD_CONTEXT } from '@/types/Uploads'
import { useModal } from '@/context/ModalContext'
import UserSelectDropdown from '../UserSearchList'
import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import { degreeAndMajors, occupationAndDepartment, value } from '@/types/RegisterForm'
import { filterData, filterFacultyData } from '@/lib/communityGroup'
import { FaXmark } from 'react-icons/fa6'
import CollegeResult from '@/components/CollegeResult'
import { BiChevronDown } from 'react-icons/bi'
import { useCommunityUsers } from '@/services/community'
import { useGetCommunity } from '@/services/community-university'

const EditGroupChatModal = ({
  users,
  chatId,
  groupLogo,
  groupCurrentName,
  communitySelected,
}: {
  users: ChatUser[]
  chatId: string
  groupLogo: string
  groupCurrentName: string
  communitySelected: CommunityChat
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const { userProfileData } = useUniStore()

  const {
    data,
    //fetchNextPage,
    //isFetchingNextPage,
    //hasNextPage,
    //isLoading: isUserProfilesLoading,
  } = useUsersProfileForConnections(searchInput, 10, true)

  // Inside your component
  const filteredUserProfiles = useMemo(() => {
    // 1. Flatten and filter user profiles (exclude current user)
    const userProfiles = data?.pages.flatMap((page) => page.users).filter((user) => user._id !== userProfileData?.users_id) || []

    // 2. Create Set of userIds for O(1) lookups
    const userIdsSet = new Set(users.map((user) => user.userId._id))

    // 3. Filter profiles that exist in the Set
    return userProfiles.filter((profile) => !userIdsSet.has(profile._id))
  }, [data?.pages, userProfileData?.users_id, users])

  const [showDropdown, setShowDropdown] = useState(false)

  const [groupLogoImage, setGroupLogoImage] = useState<File | null>(null)
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false)
  const [universityError, setUniversityError] = useState(false)

  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(false)
  const [filteredUsers, setFilterUsers] = useState<any[]>([])
  const [filteredFacultyUsers, setFilterFacultyUsers] = useState<any[]>([])
  const { mutateAsync: editGroup, isPending } = useEditGroupChat(chatId)
  const { mutateAsync: uploadtoS3 } = useUploadToS3()
  const { closeModal } = useModal()
  const { data: communityUsersData } = useCommunityUsers(communitySelected.id)
  const communityUsers = communityUsersData?.pages.flatMap((page) => page.data).filter((user) => user.users_id !== userProfileData?.users_id) || []

  const {
    register,
    watch,
    formState: { errors },
    setValue,
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      groupLogo: groupLogo,
      title: groupCurrentName || '',
      selectedIndividualsUsers: [],
      studentYear: [],
      major: [],
      occupation: [],
      affiliation: [],
      community: { name: communitySelected?.name, id: communitySelected?.id },
    },
  })

  const studentYear = watch('studentYear') || []
  const major = watch('major') || []
  const occupation = watch('occupation') || []
  const affiliation = watch('affiliation') || []
  const community = watch('community') || []

  const SelectedIndividualsUsers = watch('selectedIndividualsUsers')
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
    const allUsers = communityUsers || []
    const filters = { year: studentYear, major: major }
    const filtered = filterData(allUsers, filters)
    setFilterUsers(filtered)
  }, [studentYear, major, communityUsers])

  useEffect(() => {
    const allUsers = communityUsers || []

    const filters = { occupation: occupation, affiliation: affiliation }
    const filtered = filterFacultyData(allUsers, filters)

    setFilterFacultyUsers(filtered)
  }, [occupation, affiliation])

  useEffect(() => {
    if (showDropdown) inputRef.current?.focus()
  }, [showDropdown])

  const onSubmit = async (formData: any) => {
    const mergedUsers = [
      ...formData.selectedIndividualsUsers.map((user: any) => user._id),
      ...filteredUsers.map((user) => user._id),
      ...filteredFacultyUsers.map((user) => user._id),
    ]
    const paylod: any = {
      groupName: formData.title,
      users: mergedUsers,
    }

    if (groupLogoImage) {
      setIsImageLoading(true)
      const uploadPayload = {
        files: [groupLogoImage],
        context: UPLOAD_CONTEXT.DP,
      }
      const imagedata = await uploadtoS3(uploadPayload)
      if (imagedata.success) {
        paylod.groupLogo = imagedata.data[0]
      }
    }

    await editGroup(paylod)
    setIsImageLoading(false)
    closeModal()
  }
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowSelectUsers(false)
    setSearchInput('')
  }

  const removeUser = (userId: string) => {
    const currentSelected = watch('selectedIndividualsUsers') as Users[]
    setValue('selectedIndividualsUsers', currentSelected.filter((u) => u._id !== userId) as any)
  }

  const handleSelectIndividuals = (e: React.MouseEvent, user: Users) => {
    e.preventDefault()
    e.stopPropagation()

    const currentSelected = watch('selectedIndividualsUsers') as Users[]

    const isAlreadySelected = currentSelected.some((u) => u._id === user._id)

    if (isAlreadySelected) {
      // Remove user if already selected
      const updated = currentSelected.filter((u) => u._id !== user._id)
      setValue('selectedIndividualsUsers', updated as any)
    } else {
      // Add user if not selected
      setValue('selectedIndividualsUsers', [...currentSelected, user] as any)
    }
  }

  return (
    <div className="relative w-full h-[400px] flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-medium text-sm text-neutral-900">
          Edit Group Chat
        </label>
        <div
          className={` border-2 border-neutral-200 bg-white flex  items-center justify-center w-[100px] h-[100px] rounded-full cursor-pointer`}
          onClick={() => document.getElementById('CreateGroupLogoImage')?.click()}
        >
          {groupLogoImage && !groupLogo?.length ? (
            <Image
              width={96}
              height={96}
              className="w-24 h-24 rounded-full absolute  object-cover"
              src={URL.createObjectURL(groupLogoImage)}
              alt=""
            />
          ) : (
            ''
          )}
          {!groupLogoImage && groupLogo?.length ? (
            <Image width={96} height={96} className="w-24 h-24 rounded-full absolute  object-cover" src={groupLogo} alt="" />
          ) : (
            ''
          )}
          {groupLogoImage && groupLogo?.length ? (
            <Image
              width={96}
              height={96}
              className="w-24 h-24 rounded-full absolute  object-cover"
              src={URL.createObjectURL(groupLogoImage)}
              alt=""
            />
          ) : (
            ''
          )}
          <input
            style={{ display: 'none' }}
            accept="image/jpeg,image/png,image/jpg,image/gif"
            type="file"
            id="CreateGroupLogoImage"
            onChange={(e: any) => setGroupLogoImage(e.target.files[0])}
          />

          {groupLogoImage ? (
            <label htmlFor="CreateGroupLogoImage" className="relative flex flex-col items-center gap-2 z-10  " onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-full bg-black opacity-50 absolute -z-10 top-1/2 -translate-y-1/2"></div>
              <FiCamera size={32} className="text-white" />
            </label>
          ) : (
            <label htmlFor="CreateGroupLogoImage" className="flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
          Add Members
        </label>
        <div>
          <InputBox
            isCancel={true}
            onCancel={handleClear}
            onClick={() => setShowSelectUsers(true)}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search Users"
          />

          {/*{showSelectUsers && (
            <div ref={dropdownRef} className="w-full mt-2 rounded-lg border-[1px] border-neutral-200 bg-white max-h-72 overflow-y-auto">
              <UserList users={filteredUserProfiles} onUserClick={handleSelectIndividuals} fallbackImage={avatar} />
            </div>
          )}*/}

          <UserSelectDropdown
            searchInput={searchInput}
            show={showSelectUsers}
            onSelect={handleSelectIndividuals}
            currentUserId={userProfileData?.users_id as string}
            individualsUsers={SelectedIndividualsUsers}
            //  maxHeight={512}
          />

          <div className="flex flex-wrap mt-2">
            <SelectedUserTags users={SelectedIndividualsUsers} onRemove={(id) => removeUser(id as string)} />
          </div>
        </div>
      </div>

      <div className="relative mb-2" ref={dropdownRef}>
        <label className="text-xs font-medium mb-2">University</label>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`w-full flex justify-between items-center border ${
            universityError ? 'border-destructive-600' : 'border-neutral-200'
          } rounded-lg p-3 text-xs text-neutral-700 h-10 bg-white shadow-sm`}
        >
          {community?.name || 'Select University'}
          {community?.name ? (
            <FaXmark
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowDropdown(false)
                setValue('community', { name: '', id: '' })
                //setValueGroup('community', { name: '', id: '' })
                //setSelectedUniversity({ name: '', id: '' })
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
                    setValue('community', {
                      name: university.UniversityName,
                      id: university?.communityId,
                    })
                    //setValueGroup('community', { name: university.UniversityName, id: university?.communityId })
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

      <div
        className="flex flex-col gap-8 mb-4"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
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
                //filteredCount={filteredYearCount}
                multiSelect={false}
                disabled={!communitySelected?.name?.length}
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
                //filteredCount={filteredMajorsCount}
                parentCategory={studentYear}
                disabled={!communitySelected?.name?.length}
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
                //filteredCount={filteredOccupationCount}
                disabled={!communitySelected?.name?.length}
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
                //filteredCount={filteredAffiliationCount}
                parentCategory={occupation}
                disabled={!communitySelected?.name?.length}
                setUniversityErr={setUniversityError}
                isRelative={true}
              />
            </div>
          )}
        />
      </div>

      <Buttons disabled={isPending} onClick={handleSubmit(onSubmit)} size="large" className="">
        {isPending || isImageLoading ? <Spinner /> : 'Apply Changes'}
      </Buttons>

      <div className=" min-h-[10px] w-4"></div>
    </div>
  )
}

export default EditGroupChatModal
