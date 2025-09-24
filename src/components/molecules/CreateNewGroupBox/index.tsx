'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FiCamera } from 'react-icons/fi'
import { Controller, useForm } from 'react-hook-form'

import { useCreateCommunityGroup, useGetCommunity } from '@/services/community-university'
import { Spinner } from '../../spinner/Spinner'
import InputBox from '../../atoms/Input/InputBox'
import { IoClose } from 'react-icons/io5'
import { useUniStore } from '@/store/store'
import { CommunityGroupTypeEnum, CreateCommunityGroupType, subCategories } from '@/types/CommuityGroup'
import { CommunityUsers } from '@/types/Community'
import CollapsibleMultiSelect from '@/components/atoms/CollapsibleMultiSelect'
import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import { degreeAndMajors, occupationAndDepartment, value } from '@/types/RegisterForm'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import CustomTooltip from '@/components/atoms/CustomTooltip'
import {
  filterData,
  filterFacultyData,
  getFilteredAffiliationCounts,
  getFilteredMajorCounts,
  getFilteredYearCounts,
  getOccupationCounts,
  getUniqueById,
} from '@/lib/communityGroup'
import { useUploadToS3 } from '@/services/upload'
import { Users } from '@/types/Connections'
import SelectedUserTags from '@/components/atoms/SelectedUserTags'
import UserSelectDropdown from '../UserSearchList'
import { UPLOAD_CONTEXT } from '@/types/Uploads'
import { validateSingleImageFile } from '@/lib/utils'
import { useModal } from '@/context/ModalContext'
import UniversityDropdown from './Dropdown'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { AnimatePresence, motion } from 'framer-motion'
import ProfileImageUploader from '../ProfileImageUploader'
import { useCommunityUsers } from '@/services/community'
import VerifyUserSelectDropdown from '@/components/organism/VerifyUserSelectDropdown'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'

type Props = {
  communityId: string
  setNewGroup: (value: boolean) => void
  communityName: string
}

const CreateNewGroup = ({ setNewGroup, communityId, communityName }: Props) => {
  const { userProfileData } = useUniStore()
  const { closeModal } = useModal()
  const [logoImage, setLogoImage] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File>()
  const [isLoading, setIsLoading] = useState(false)
  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [universityError, setUniversityError] = useState(false)
  const [individualsUsers, setIndividualsUsers] = useState<any[]>([])
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [filtersError, setFIltersError] = useState('')
  const [filteredUsers, setFilterUsers] = useState<any>()
  const [filteredFacultyUsers, setFilterFacultyUsers] = useState<any>()
  const [filteredYearCount, setFilteredYearsCount] = useState<Record<string, number>>()
  const [filteredMajorsCount, setFilteredMajorsCount] = useState<Record<string, number>>()
  const [filteredOccupationCount, setFilteredOccupationCount] = useState<Record<string, number>>()
  const [filteredAffiliationCount, setFilteredAffiliationCount] = useState<Record<string, number>>()
  const { mutate: createGroup, isPending } = useCreateCommunityGroup()
  const { mutateAsync: uploadToS3 } = useUploadToS3()
  const {
    register: GroupRegister,
    watch,
    control,
    handleSubmit: handleGroupCreate,
    formState: { errors },
    setValue,
  } = useForm<CreateCommunityGroupType>({
    defaultValues: {
      communityGroupLogoUrl: null,
      communityGroupLogoCoverUrl: null,
      title: '',
      description: '',
      communityGroupAccess: '',
      communityGroupType: '',
      selectedUsers: [],
      community: { name: '', id: '' },
    },
  })
  const categoryRef = useRef<HTMLDivElement>(null)
  const SelectedUsers = watch('selectedUsers') as unknown as CommunityUsers[]
  const description = watch('description') || ''
  const studentYear = watch('studentYear') || ''
  const major = watch('major') || ''
  const occupation = watch('occupation') || ''
  const affiliation = watch('affiliation') || ''
  const community = watch('community')
  const communityGroupType = watch('communityGroupType')

  const { data: communityData } = useGetCommunity(community.id)
  const { data: communityUsersData, hasNextPage, isFetchingNextPage, fetchNextPage } = useCommunityUsers(communityId, true, searchInput)

  const communityUsers = communityUsersData?.pages.flatMap((page) => page.data).filter((user) => user.users_id !== userProfileData?.users_id) || []

  const handleSelect = (category: string, option: string) => {
    setSelectedFilters((prev: any) => {
      const categoryFilters = prev[category] || []
      if (categoryFilters.includes(option)) {
        const updatedFilters = categoryFilters.filter((item: any) => item !== option)
        if (updatedFilters.length === 0) {
          const { [category]: _, ...rest } = prev
          return rest
        }
        return {
          ...prev,
          [category]: updatedFilters,
        }
      } else {
        return {
          ...prev,
          [category]: [...categoryFilters, option],
        }
      }
    })
  }

  const handleSelectAllFilter = (category: string, allOptions: string[]) => {
    setSelectedFilters((prev: any) => {
      const currentFilters = prev[category] || []

      if (currentFilters.length === allOptions.length) {
        const { [category]: _, ...rest } = prev
        return rest
      } else {
        return {
          ...prev,
          [category]: allOptions,
        }
      }
    })
  }

  const validateDescription = (value: string | undefined): string | boolean => {
    if (!value || value.trim() === '') return true

    const trimmedValue = value.trim()
    const charCount = trimmedValue.length

    if (charCount > 160) return 'Bio must not exceed 150 characters'

    return true
  }

  const onGroupSubmit = async (data: any) => {
    setIsLoading(true)
    let CoverImageData
    let logoImageData

    if (Object.keys(selectedFilters).length < 1) {
      setIsLoading(false)
      setFIltersError('category required')
      if (categoryRef.current) {
        categoryRef.current.focus?.()
        categoryRef.current.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
      }

      return
    }

    if (coverImage) {
      const uploadPayload = {
        files: [coverImage],
        context: UPLOAD_CONTEXT.DP,
      }
      CoverImageData = await uploadToS3(uploadPayload)
      setValue('communityGroupLogoCoverUrl', CoverImageData.data[0])
    }
    if (logoImage) {
      const uploadPayload = {
        files: [logoImage],
        context: UPLOAD_CONTEXT.COVER_DP,
      }
      logoImageData = await uploadToS3(uploadPayload)
      setValue('communityGroupLogoUrl', logoImageData as any)
    }

    const communityGroupCategory = {
      communityGroupCategory: selectedFilters,
    }
    const mergedUsers = [...individualsUsers, ...SelectedUsers, ...filteredUsers, ...filteredFacultyUsers]
    const uniqueUsers = getUniqueById(mergedUsers)
    const payload = {
      ...data,
      ...communityGroupCategory,
      selectedUsers: uniqueUsers,
      communityGroupLogoUrl: logoImageData?.data[0],
      communityGroupLogoCoverUrl: CoverImageData?.data[0],
      universityAdminId: communityData?.adminId,
    }

    createGroup({ communityId: communityId, data: payload, isOfficial: communityGroupType.toLowerCase() === CommunityGroupTypeEnum.OFFICIAL })
    setSelectedFilters({})
    setIsLoading(false)
    setNewGroup(false)
    closeModal()
  }

  const handleClick = (userId: string) => {
    if (SelectedUsers?.some((selectedUser) => selectedUser?._id == userId)) {
      const filterUsers = SelectedUsers.filter((selectedUser) => selectedUser?._id !== userId)
      setValue('selectedUsers', filterUsers as any)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowSelectUsers(false)
    setSearchInput('')
  }

  const removeUser = (userId: string) => {
    setIndividualsUsers((prev: any[]) => prev.filter((u) => u._id !== userId))
  }
  const handleUniversityClear = () => {
    setValue('community', { name: '', id: '' })
    setUniversityError(true)
  }

  useEffect(() => {
    const allUsers = communityUsers || []
    // const allStudentUsers = allUsers.filter((user) => user.role == 'student')
    const filters = { year: studentYear, major: major }
    const filtered = filterData(allUsers, filters)

    const yearOnlyFiltered = filterData(allUsers, { year: studentYear, major: [] })
    const yearCounts = getFilteredYearCounts(yearOnlyFiltered)

    const majorCounts = getFilteredMajorCounts(filtered)

    setFilterUsers(filtered)
    setFilteredYearsCount(yearCounts)
    setFilteredMajorsCount(majorCounts)
  }, [studentYear, major, communityData])

  useEffect(() => {
    const allUsers = communityUsers || []
    // const allFacultyUsers = allUsers.filter((user) => user.role == 'faculty')

    const filters = { occupation: occupation, affiliation: affiliation }
    const filtered = filterFacultyData(allUsers, filters)

    const occupationOnlyFiltered = filterFacultyData(allUsers, { occupation: occupation, affiliation: [] })

    const occupationCounts = getOccupationCounts(occupationOnlyFiltered)

    const affiliationCounts = getFilteredAffiliationCounts(filtered)

    setFilterFacultyUsers(filtered)
    setFilteredOccupationCount(occupationCounts)
    setFilteredAffiliationCount(affiliationCounts)
  }, [occupation, affiliation])

  const handleSelectIndividuals = (e: React.MouseEvent, user: any) => {
    e.preventDefault()
    e.stopPropagation()

    setIndividualsUsers((prev) => {
      const isAlreadySelected = prev.some((u) => u._id === user._id)

      if (isAlreadySelected) {
        return prev.filter((u) => u._id !== user._id) // remove user
      } else {
        return [...prev, user] // add user
      }
    })
  }
  const handleLogoImage = (file: File) => {
    setLogoImage(file)
  }

  const handleCoverImage = (file: File) => {
    const { isValid, message } = validateSingleImageFile(file, 5 * 1024 * 1024)
    if (!isValid) {
      showCustomDangerToast(message)
      return
    }
    setCoverImage(file)
  }

  return (
    <>
      <div className="flex flex-col gap-8 justify-start items-start w-full  ">
        <h3 className="text-neutral-700 text-md font-poppins font-bold">Group Information</h3>

        <ProfileImageUploader label="Group Profile" imageFile={logoImage} onImageChange={(file) => handleLogoImage(file)} id="CreateGroupLogoImage" />

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="name" className="font-medium text-sm text-neutral-900">
            Group Banner
          </label>
          <div
            className={` ${
              !coverImage ? 'border-2 border-neutral-200' : ''
            } rounded-md relative  flex flex-col w-full items-center justify-center h-[141px] `}
          >
            {coverImage && <img className="w-full h-full  absolute object-cover rounded-lg" src={URL.createObjectURL(coverImage)} alt="" />}
            <input
              style={{ display: 'none' }}
              accept="image/jpeg,image/png,image/jpg,image/gif"
              type="file"
              id="CreateGroupImage"
              onChange={(e: any) => handleCoverImage(e.target.files[0])}
            />
            {coverImage ? (
              <label htmlFor="CreateGroupImage" className="relative flex flex-col items-center gap-2 z-10  ">
                <div className="w-12 h-12 rounded-full bg-black opacity-50 absolute -z-10 top-1/2 -translate-y-1/2"></div>
                <FiCamera size={32} className="text-white" />
              </label>
            ) : (
              <label htmlFor="CreateGroupImage" className="flex flex-col items-center gap-2 z-10 ">
                <FiCamera size={32} className="text-primary-500" />
                <p className="text-neutral-900 font-medium ">
                  <span className="text-primary-500">Upload</span> Banner Image
                </p>
              </label>
            )}
          </div>
        </div>

        {/* Forms  */}
        <form className="w-full flex flex-col gap-8">
          <div className="flex gap-4 items-center justify-between">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="name" className="font-medium text-sm text-neutral-900">
                Group Name <span className="text-destructive-600">*</span>
              </label>
              <InputBox
                className="text-xs"
                placeholder="Enter Group Name "
                type="title"
                {...GroupRegister('title', {
                  required: true,
                })}
              />

              {errors.title && <span className="text-red-500 text-2xs font-normal text-"> This field is required</span>}
            </div>
          </div>

          <div className="relative flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="name" className="font-medium text-sm text-neutral-900">
                Description <span className="text-destructive-600">*</span>
              </label>
              <p className="text-xs text-neutral-500">{description?.trim()?.length}/160</p>
            </div>
            <textarea
              className="w-full p-2 border border-neutral-200 rounded-lg resize-none focus:outline-none h-[114px] overflow-y-auto text-xs"
              {...GroupRegister('description', {
                required: true,
                validate: validateDescription,
              })}
              placeholder="Enter description"
            ></textarea>

            {errors.description && <span className="text-red-500 text-2xs font-normal"> This field is required</span>}
          </div>

          <div>
            <h2 className="font-medium text-sm text-neutral-900">
              Group Access <span className="text-destructive-600">*</span>
            </h2>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                value="Public"
                {...GroupRegister('communityGroupAccess', { required: true })}
                className="w-[18px] h-[18px] mt-1 appearance-none rounded-full border-2 border-neutral-300
                checked:border-primary relative bg-white
                after:content-[''] after:absolute after:top-[3px] after:left-[3px]
                after:w-[8px] after:h-[8px] after:rounded-full
                after:bg-primary after:hidden checked:after:block"
              />
              <div className="py-3">
                <span className="text-neutral-900 text-[12px] font-medium">Public</span>
                <p className="text-neutral-400 text-[12px] ">Anyone can join</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              {/* <input type="radio" value="Private" {...GroupRegister('communityGroupAccess', { required: true })} className="w-[18px] h-[18px] mt-1" /> */}
              <input
                type="radio"
                value="Private"
                {...GroupRegister('communityGroupAccess', { required: true })}
                className="w-[18px] h-[18px] mt-1 appearance-none rounded-full border-2 border-neutral-300
                checked:border-primary relative bg-white
                after:content-[''] after:absolute after:top-[3px] after:left-[3px]
                after:w-[8px] after:h-[8px] after:rounded-full
                after:bg-primary after:hidden checked:after:block"
              />
              <div className="py-3">
                <span className="text-neutral-900 text-[12px] font-medium">Private</span>
                <p className="text-neutral-400 text-[12px] ">Permission to join required</p>
              </div>
            </label>
            {errors.communityGroupAccess && <p className="text-red-500 text-2xs">This field is required</p>}
          </div>

          {/* communty group type  */}

          <div>
            <h2 className="font-medium text-sm text-neutral-900">
              Group Type <span className="text-destructive-600">*</span>
            </h2>
            <p className="text-destructive-600 text-xs font-semibold py-2">
              Once you select your group type and create the group, you will not be able to change your selection.
            </p>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                value="Casual"
                {...GroupRegister('communityGroupType', { required: true })}
                className="w-[18px] h-[18px] mt-1 appearance-none rounded-full border-2 border-neutral-300
                checked:border-primary relative bg-white
                after:content-[''] after:absolute after:top-[3px] after:left-[3px]
                after:w-[8px] after:h-[8px] after:rounded-full
                after:bg-primary after:hidden checked:after:block"
              />
              <div className="py-3">
                <span className="text-neutral-900 text-[12px] font-medium">Casual</span>
                <p className="text-neutral-400 text-[12px] ">No approval required</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                value="Official"
                {...GroupRegister('communityGroupType', { required: true })}
                className="w-[18px] h-[18px] mt-1 appearance-none rounded-full border-2 border-neutral-300
                checked:border-primary relative bg-white
                after:content-[''] after:absolute after:top-[3px] after:left-[3px]
                after:w-[8px] after:h-[8px] after:rounded-full
                after:bg-primary after:hidden checked:after:block"
              />
              <div className="py-3 ">
                <div className="flex gap-4">
                  <span className="text-neutral-900 text-[12px] font-medium">Official</span>
                  <CustomTooltip
                    icon={<AiOutlineInfoCircle size={20} />}
                    content={
                      <>
                        <ul className="mt-2 space-y-2 text-sm text-gray-900 ">
                          <li className="text-2xs  font-medium">Official groups have a badge</li>
                          <li className="text-3xs text-neutral-700 max-w-[200px]">
                            Official groups are recognized and affiliated with the university.
                          </li>
                        </ul>
                      </>
                    }
                  />
                </div>

                <p className="text-neutral-400 text-[12px] ">Require university approval</p>
              </div>
            </label>
            {errors.communityGroupType && <p className="text-red-500 text-2xs ">This field is required</p>}
          </div>

          <div>
            <h2 className="font-medium text-sm text-neutral-900">
              Group Label <span className="text-destructive-600">*</span>
            </h2>
            <label className="flex items-center gap-3 mt-2">
              <input
                type="radio"
                value="Course"
                {...GroupRegister('communityLabel', { required: true })}
                className="w-[18px] h-[18px] mt-1 appearance-none rounded-full border-2 border-neutral-300 checked:border-primary relative bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:w-[8px] after:h-[8px] after:rounded-full after:bg-primary after:hidden checked:after:block"
              />
              <div>
                <span className="text-neutral-900 text-[12px] font-medium">Course</span>
                <p className="text-neutral-400 text-[12px]">Group for a particular academic subject</p>
              </div>
            </label>
            <label className="flex items-center gap-3 mt-2">
              <input
                type="radio"
                value="Club"
                {...GroupRegister('communityLabel', { required: true })}
                className="w-[18px] h-[18px] mt-1 appearance-none rounded-full border-2 border-neutral-300 checked:border-primary relative bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:w-[8px] after:h-[8px] after:rounded-full after:bg-primary after:hidden checked:after:block"
              />
              <div>
                <span className="text-neutral-900 text-[12px] font-medium">Club</span>
                <p className="text-neutral-400 text-[12px]">Formal and competitive, often university-recognized</p>
              </div>
            </label>
            <label className="flex items-center gap-3 mt-2">
              <input
                type="radio"
                value="Circle"
                {...GroupRegister('communityLabel', { required: true })}
                className="w-[18px] h-[18px] mt-1 appearance-none rounded-full border-2 border-neutral-300 checked:border-primary relative bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:w-[8px] after:h-[8px] after:rounded-full after:bg-primary after:hidden checked:after:block"
              />
              <div>
                <span className="text-neutral-900 text-[12px] font-medium">Circle</span>
                <p className="text-neutral-400 text-[12px]">Casual and interest-based</p>
              </div>
            </label>
            <label className="flex items-center gap-3 mt-2">
              <input
                type="radio"
                value="Other"
                {...GroupRegister('communityLabel', { required: true })}
                className="w-[18px] h-[18px] mt-1 appearance-none rounded-full border-2 border-neutral-300 checked:border-primary relative bg-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:w-[8px] after:h-[8px] after:rounded-full after:bg-primary after:hidden checked:after:block"
              />
              <div>
                <span className="text-neutral-900 text-[12px] font-medium">Other</span>
              </div>
            </label>
            {errors.communityLabel && <p className="text-red-500 text-2xs ">This field is required</p>}
          </div>

          <div ref={categoryRef}>
            <h2 className="font-medium text-sm text-neutral-900">
              Group Category <span className="text-destructive-600">*</span>
            </h2>
            <CollapsibleMultiSelect
              title="Academic"
              options={subCategories['Academic']}
              selectedOptions={selectedFilters['Academic'] || []}
              onSelect={(value: string) => handleSelect('Academic', value)}
              handleSelectAll={() => handleSelectAllFilter('Academic', subCategories['Academic'])}
            />
            <CollapsibleMultiSelect
              title="Educational"
              options={subCategories['Educational']}
              selectedOptions={selectedFilters['Educational'] || []}
              onSelect={(value: string) => handleSelect('Educational', value)}
              handleSelectAll={() => handleSelectAllFilter('Educational', subCategories['Educational'])}
            />
            <CollapsibleMultiSelect
              title="Interest"
              options={subCategories['Interest']}
              selectedOptions={selectedFilters['Interest'] || []}
              onSelect={(value: string) => handleSelect('Interest', value)}
              handleSelectAll={() => handleSelectAllFilter('Interest', subCategories['Interest'])}
            />
            <CollapsibleMultiSelect
              title="Events & Activities"
              options={subCategories['Events & Activities']}
              selectedOptions={selectedFilters['Events & Activities'] || []}
              onSelect={(value: string) => handleSelect('Events & Activities', value)}
              handleSelectAll={() => handleSelectAllFilter('Events & Activities', subCategories['Events & Activities'])}
            />
            <CollapsibleMultiSelect
              title="Personal Growth"
              options={subCategories['Personal Growth']}
              selectedOptions={selectedFilters['Personal Growth'] || []}
              onSelect={(value: string) => handleSelect('Personal Growth', value)}
              handleSelectAll={() => handleSelectAllFilter('Personal Growth', subCategories['Personal Growth'])}
            />
            <CollapsibleMultiSelect
              title="Advocacy and Awareness"
              options={subCategories['Advocacy and Awareness']}
              selectedOptions={selectedFilters['Advocacy and Awareness'] || []}
              onSelect={(value: string) => handleSelect('Advocacy and Awareness', value)}
              handleSelectAll={() => handleSelectAllFilter('Advocacy and Awareness', subCategories['Advocacy and Awareness'])}
            />
            <CollapsibleMultiSelect
              title="Professional Development"
              options={subCategories['Professional Development']}
              selectedOptions={selectedFilters['Professional Development'] || []}
              onSelect={(value: string) => handleSelect('Professional Development', value)}
              handleSelectAll={() => handleSelectAllFilter('Professional Development', subCategories['Professional Development'])}
            />
            <CollapsibleMultiSelect
              title="Utility & Campus Life"
              options={subCategories['Utility & Campus Life']}
              selectedOptions={selectedFilters['Utility & Campus Life'] || []}
              onSelect={(value: string) => handleSelect('Utility & Campus Life', value)}
              handleSelectAll={() => handleSelectAllFilter('Utility & Campus Life', subCategories['Utility & Campus Life'])}
            />

            {filtersError?.length ? <p className="text-red-500 text-2xs ">{filtersError || 'This field is required'}</p> : ''}
          </div>

          <h5 className="font-bold text-md text-neutral-900 font-poppins mt-[10px]">Add Members</h5>
          <div className="relative w-full flex flex-col">
            <label htmlFor="inviteFriends" className="font-medium text-sm text-neutral-900 mb-2">
              Add Individuals
            </label>
            <InputBox
              isCancel={true}
              onCancel={handleClear}
              onClick={() => setShowSelectUsers(true)}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="Search Users"
            />
            <VerifyUserSelectDropdown
              show={showSelectUsers}
              users={communityUsers || []}
              onSelect={handleSelectIndividuals}
              currentUserId={userProfileData?.users_id as string}
              selectedUsers={individualsUsers}
              onBottomReach={fetchNextPage}
              isFetchingMore={isFetchingNextPage}
              hasNextPage={hasNextPage}
            />
            {/* <UserSelectDropdown
              searchInput={searchInput}
              show={showSelectUsers}
              onSelect={handleSelectIndividuals}
              currentUserId={userProfileData?.users_id as string}
              individualsUsers={individualsUsers}
            /> */}
            <div className="flex flex-wrap mt-2">
              <SelectedUserTags users={individualsUsers} onRemove={(id) => removeUser(id as string)} />
            </div>

            <div className="flex flex-wrap mt-2">
              {SelectedUsers?.length < 9 ? (
                <div className="flex gap-2 flex-wrap">
                  {SelectedUsers?.map((item) => (
                    // <div key={item.id} className="bg-secondary px-2 py-1 text-xs text-primary-500 rounded-md flex items-center gap-2">
                    <div key={item._id} className="flex items-center text-2xs  px-2 py-1 h-7 bg-primary-500 text-white rounded-md">
                      {item?.firstName}{' '}
                      <span onClick={() => handleClick(item._id as string)} className="cursor-pointer text-sm">
                        <IoClose />
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-secondary py-[2px] px-[6px] text-[10px] text-primary-500 rounded-sm h-5">
                  {SelectedUsers?.length} <span></span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full my-2 flex items-center justify-center border border-primary-500 text-primary-500 text-sm font-medium rounded-full px-4 py-2 focus:outline-none"
            >
              <span>Bulk Add Members</span>
              <span className="ml-2">{isOpen ? <IoIosArrowUp className="text-primary" /> : <IoIosArrowDown className="text-primary" />}</span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  key="bulk-section"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <div
                    className="flex flex-col gap-8 my-2"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">University</label>
                      <p className="text-xs text-neutral-600">{communityName}</p>
                    </div>

                    <Controller
                      name="studentYear"
                      control={control}
                      render={({ field }) => (
                        <MultiSelectDropdown
                          options={Object.keys(degreeAndMajors)}
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add By Year"
                          label="Year (Students)"
                          err={false}
                          filteredCount={filteredYearCount}
                          multiSelect={false}
                          // disabled={!community?.name?.length}
                          setUniversityErr={setUniversityError}
                        />
                      )}
                    />
                    <Controller
                      name="major"
                      control={control}
                      render={({ field }) => (
                        <MultiSelectDropdown
                          options={value}
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add By Major"
                          label="Major (Students)"
                          err={false}
                          search={true}
                          filteredCount={filteredMajorsCount}
                          parentCategory={studentYear}
                          // disabled={!community?.name?.length}
                          setUniversityErr={setUniversityError}
                        />
                      )}
                    />
                    <Controller
                      name="occupation"
                      control={control}
                      render={({ field }) => (
                        <MultiSelectDropdown
                          options={Object.keys(occupationAndDepartment)}
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add By Major"
                          label="Occupation (Faculty)"
                          err={false}
                          search={true}
                          multiSelect={false}
                          filteredCount={filteredOccupationCount}
                          // disabled={!community?.name?.length}
                          setUniversityErr={setUniversityError}
                        />
                      )}
                    />
                    <Controller
                      name="affiliation"
                      control={control}
                      render={({ field }) => (
                        <MultiSelectDropdown
                          options={value}
                          value={field.value || []}
                          onChange={field.onChange}
                          placeholder="Add By Major"
                          label="Affiliation/Department (Faculty)"
                          err={false}
                          search={true}
                          filteredCount={filteredAffiliationCount}
                          parentCategory={occupation}
                          // disabled={!community?.name?.length}
                          setUniversityErr={setUniversityError}
                          isRelative={true}
                        />
                      )}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* <UniversityDropdown
              selected={community}
              options={userProfileData?.email || []}
              onSelect={(val) => {
                setValue('community', val)
                setUniversityError(false)
              }}
              onClear={() => handleUniversityClear()}
              error={!!universityError}
              errorMessage="Select university to filter based on student or faculty."
            /> */}
          </div>

          {/* <div
            className="flex flex-col gap-8"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <Controller
              name="studentYear"
              control={control}
              render={({ field }) => (
                <MultiSelectDropdown
                  options={Object.keys(degreeAndMajors)}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add By Year"
                  label="Year (Students)"
                  err={false}
                  filteredCount={filteredYearCount}
                  multiSelect={false}
                  disabled={!community?.name?.length}
                  setUniversityErr={setUniversityError}
                />
              )}
            />
            <Controller
              name="major"
              control={control}
              render={({ field }) => (
                <MultiSelectDropdown
                  options={value}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add By Major"
                  label="Major (Students)"
                  err={false}
                  search={true}
                  filteredCount={filteredMajorsCount}
                  parentCategory={studentYear}
                  disabled={!community?.name?.length}
                  setUniversityErr={setUniversityError}
                />
              )}
            />
            <Controller
              name="occupation"
              control={control}
              render={({ field }) => (
                <MultiSelectDropdown
                  options={Object.keys(occupationAndDepartment)}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add By Major"
                  label="Occupation (Faculty)"
                  err={false}
                  search={true}
                  multiSelect={false}
                  filteredCount={filteredOccupationCount}
                  disabled={!community?.name?.length}
                  setUniversityErr={setUniversityError}
                />
              )}
            />
            <Controller
              name="affiliation"
              control={control}
              render={({ field }) => (
                <MultiSelectDropdown
                  options={value}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Add By Major"
                  label="Affiliation/Department (Faculty)"
                  err={false}
                  search={true}
                  filteredCount={filteredAffiliationCount}
                  parentCategory={occupation}
                  disabled={!community?.name?.length}
                  setUniversityErr={setUniversityError}
                />
              )}
            />
          </div> */}
          <button disabled={isPending} onClick={handleGroupCreate(onGroupSubmit)} className="bg-[#6647FF] py-2 rounded-lg text-white w-full mx-auto">
            {isLoading || isPending ? <Spinner /> : <p>Create New Group</p>}
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateNewGroup
