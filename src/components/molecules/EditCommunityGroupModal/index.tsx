'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FiCamera } from 'react-icons/fi'
import { Controller, useForm } from 'react-hook-form'
import { useGetCommunity, useUpdateCommunityGroup } from '@/services/community-university'
import { Spinner } from '../../spinner/Spinner'
import InputBox from '../../atoms/Input/InputBox'
import { CommunityGroupType, CommunityGroupTypeEnum, CommunityGroupUsers, status, subCategories } from '@/types/CommuityGroup'

import { useUniStore } from '@/store/store'

import DeleteCommunityGroupModal from '../DeleteCommunityGroupModal'
import CollapsibleMultiSelect from '@/components/atoms/CollapsibleMultiSelect'
import { filterData, filterFacultyData, getUniqueById } from '@/lib/communityGroup'
import { BsExclamationCircleFill } from 'react-icons/bs'
import { useUploadToS3 } from '@/services/upload'
import { UPLOAD_CONTEXT } from '@/types/Uploads'
import UserSelectDropdown from '../UserSearchList'
import SelectedUserTags from '@/components/atoms/SelectedUserTags'
import { Users } from '@/types/Connections'
import { useModal } from '@/context/ModalContext'
import Buttons from '@/components/atoms/Buttons'
import { IoClose } from 'react-icons/io5'
import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import { degreeAndMajors, occupationAndDepartment, value } from '@/types/RegisterForm'
import ProfileImageUploader from '../ProfileImageUploader'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { AnimatePresence, motion } from 'framer-motion'
import { useCommunityUsers } from '@/services/community'
import VerifyUserSelectDropdown from '@/components/organism/VerifyUserSelectDropdown'

type Props = {
  communityGroups: CommunityGroupType
  setNewGroup: (value: boolean) => void
}

type media = {
  imageUrl: string
  publicId: string
}

const EditCommunityGroupModal = ({ setNewGroup, communityGroups }: Props) => {
  const { userProfileData } = useUniStore()
  const { closeModal, openModal } = useModal()
  const [logoImage, setLogoImage] = useState<File | string | null>(communityGroups?.communityGroupLogoUrl?.imageUrl as string)
  const [coverImage, setCoverImage] = useState<File | string>(communityGroups?.communityGroupLogoCoverUrl?.imageUrl as string)
  const [searchInput, setSearchInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  // const [filteredUsers, setFilterUsers] = useState<any[]>([])
  // const [filteredFacultyUsers, setFilterFacultyUsers] = useState<any[]>([])
  const [individualsUsers, setIndividualsUsers] = useState<any[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(false)
  const [filtersError, setFIltersError] = useState('')

  const { data: communityUsersData, hasNextPage, isFetchingNextPage, fetchNextPage } = useCommunityUsers(communityGroups?.communityId?._id, true)

  const communityUsers = communityUsersData?.pages.flatMap((page) => page.data).filter((user) => user.users_id !== userProfileData?.users_id) || []

  const { mutateAsync: mutateEditGroup, isPending } = useUpdateCommunityGroup()
  const { mutateAsync: uploadToS3 } = useUploadToS3()

  const { title, description: initialDescription, communityGroupAccess, communityGroupCategory } = communityGroups
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(communityGroupCategory)

  const {
    register: GroupRegister,
    handleSubmit,
    formState: { errors: GroupErrors },
    setValue,
    watch,
    reset,
    control,
  } = useForm({
    defaultValues: {
      title: title,
      description: initialDescription,
      communityGroupAccess: communityGroupAccess,
      selectedUsers: [],
      studentYear: [],
      major: [],
      occupation: [],
      affiliation: [],
    },
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const SelectedUsers = watch('selectedUsers') as CommunityGroupUsers[]
  const description = watch('description') || ''
  const studentYear = watch('studentYear') || ''
  const major = watch('major') || []
  const occupation = watch('occupation') || ''
  const affiliation = watch('affiliation') || []

  // Handle image preview
  const handleBannerImagePreview = (e: any) => {
    const file = e.target.files[0] as File
    if (file) {
      setCoverImage(file)
      //  setValue('communityGroupLogoUrl', file)
    }
  }

  const handlelogoImagePreview = (file: File) => {
    if (file) {
      setLogoImage(file)
    }
  }

  // useEffect(() => {
  //   const allUsers = communityUsers || []
  //   const filters = { year: studentYear, major: major }
  //   const filtered = filterData(allUsers, filters)
  //   setFilterUsers(filtered)
  // }, [studentYear, major, communityUsers])

  // useEffect(() => {
  //   const allUsers = communityUsers || []
  //   const filters = { occupation: occupation, affiliation: affiliation }
  //   const filtered = filterFacultyData(allUsers, filters)
  //   setFilterFacultyUsers(filtered)
  // }, [occupation, affiliation])

  const filteredUsers = React.useMemo(() => {
    const allUsers = communityUsers || []
    const filters = { year: studentYear, major: major }
    return filterData(allUsers, filters)
  }, [studentYear, major, communityUsers])

  const filteredFacultyUsers = React.useMemo(() => {
    const allUsers = communityUsers || []
    const filters = { occupation: occupation, affiliation: affiliation }
    return filterFacultyData(allUsers, filters)
  }, [occupation, affiliation, communityUsers])

  const handleClick = (userId: string) => {
    if (userId == communityGroups.adminUserId) return console.log('you can not remove yourself')

    if (SelectedUsers?.some((selectedUser: any) => selectedUser.userId == userId)) {
      const filterUsers: CommunityGroupUsers[] = SelectedUsers.filter((selectedUser) => selectedUser._id !== userId)
      setValue('selectedUsers', filterUsers as any)
    }
  }

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

  const onSubmit = async (data: any) => {
    setIsLoading(true)

    const communityGroupCategory = {
      communityGroupCategory: selectedFilters,
    }

    const mergedUsers: string[] = [...individualsUsers, ...filteredUsers, ...filteredFacultyUsers].filter(Boolean)

    //const uniqueUsers = getUniqueById(mergedUsers)
    //const existingUserIds = communityGroups.users.map((user) => user.userId)
    //const finalUsers = uniqueUsers.filter((user) => !existingUserIds.includes(user.id))
    const payload: any = {
      title: data.title,
      description: data.description,
      communityGroupAccess: data.communityGroupAccess,
      ...communityGroupCategory,
      selectedUsers: mergedUsers,
    }

    if (logoImage && typeof logoImage === 'object') {
      const uploadDPPayload = {
        files: [logoImage] as File[],
        context: UPLOAD_CONTEXT.DP,
      }
      const imagedata = await uploadToS3(uploadDPPayload)

      payload.communityGroupLogoUrl = imagedata.data[0]
    }
    if (coverImage && typeof coverImage === 'object') {
      const uploadCoverPayload = {
        files: [coverImage] as File[],
        context: UPLOAD_CONTEXT.COVER_DP,
      }
      const imagedata = await uploadToS3(uploadCoverPayload)
      payload.communityGroupLogoCoverUrl = imagedata.data[0]
    }

    mutateEditGroup({ communityId: communityGroups?._id, payload: payload })
    setIsLoading(false)
    setSelectedFilters({})
    setNewGroup(false)
    closeModal()
  }

  const validateDescription = (value: string | undefined): string | boolean => {
    if (!value || value.trim() === '') return true

    const trimmedValue = value.trim()
    const charCount = trimmedValue.length

    if (charCount > 160) return 'Bio must not exceed 150 characters'

    return true
  }

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

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowSelectUsers(false)
    setSearchInput('')
  }

  const removeUser = (userId: string) => {
    setIndividualsUsers((prev: any[]) => prev.filter((u) => u._id !== userId))
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSelectUsers(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <div className="flex flex-col gap-8 justify-start items-start w-full  ">
        <h3 className="text-neutral-700 text-md font-poppins font-bold">Edit Group</h3>

        <ProfileImageUploader
          label="Group Profile"
          imageFile={logoImage}
          onImageChange={(file) => handlelogoImagePreview(file)}
          id="updateGroupLogoImage"
        />

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="name" className="font-medium text-sm text-neutral-900">
            Group Banner
          </label>
          <div
            className={` ${
              !coverImage ? 'border-2 border-neutral-200' : ''
            } rounded-md relative  flex flex-col w-full items-center justify-center h-[141px] `}
          >
            {coverImage && (
              <img
                className="w-full h-full  absolute object-cover rounded-lg"
                src={typeof coverImage === 'object' ? URL.createObjectURL(coverImage) : coverImage}
                alt=""
              />
            )}
            <input
              style={{ display: 'none' }}
              accept="image/jpeg,image/png,image/jpg,image/gif"
              type="file"
              id="CreateGroupImage"
              onChange={handleBannerImagePreview}
            />
            {coverImage ? (
              <label htmlFor="CreateGroupImage" className="relative flex flex-col items-center gap-2 z-10  ">
                <div className="w-12 h-12 rounded-full bg-black opacity-50 absolute -z-10 top-1/2 -translate-y-1/2"></div>
                <FiCamera size={32} className="text-white" />
              </label>
            ) : (
              <label htmlFor="CreateGroupImage" className="flex flex-col items-center gap-2 z-10 ">
                <FiCamera size={32} className="text-primary-500" />
                <p className=" font-medium text-primary-500">Upload Banner Image</p>
              </label>
            )}
          </div>
        </div>

        {/* Forms  */}
        <form className="w-full flex flex-col gap-8">
          <div className="flex gap-4 items-center justify-between">
            <div className="relative w-full flex flex-col gap-2">
              <label htmlFor="name" className="font-medium text-sm text-neutral-900">
                Group Name
              </label>
              <InputBox
                className="text-xs"
                placeholder="Enter Group Name "
                type="title"
                {...GroupRegister('title', {
                  required: true,
                })}
              />

              {GroupErrors.title && <span className="text-red-500 text-2xs font-normal text-"> This field is required</span>}
            </div>
          </div>

          <div className="relative flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="name" className="font-medium text-sm text-neutral-900">
                Description
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

            {GroupErrors.description && <span className="text-red-500 text-2xs font-normal"> This field is required</span>}
          </div>

          <div>
            <h2 className="font-medium text-sm text-neutral-900">Group Access</h2>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                value="Public"
                {...GroupRegister('communityGroupAccess', { required: true })}
                className="w-[18px] h-[18px] mt-1 appearance-none rounded-full border-2 border-neutral-300
                       checked:border-primary relative bg-white
                       after:content-[''] after:absolute after:top-[3px] after:left-[3.5px]
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
            {GroupErrors.communityGroupAccess && <p className="text-red-500 text-2xs">This field is required</p>}
          </div>

          {/* communty group type  */}

          <div>
            <div className="flex gap-1 items-center">
              <h2 className="font-medium text-sm text-neutral-900">Group Type</h2>
              {communityGroups?.status == status.pending ? (
                <span>
                  <BsExclamationCircleFill size={14} className=" text-warning-500 " />{' '}
                </span>
              ) : (
                ''
              )}
            </div>

            {communityGroups?.status == status.pending ? (
              <p className="text-warning-500 text-xs font-semibold py-2">
                Your Official Group request is pending. Your Casual Group will convert after university admin accepts the request.
              </p>
            ) : (
              ''
            )}

            <label className="flex items-center gap-3">
              {communityGroups?.communityGroupType == CommunityGroupTypeEnum.OFFICIAL ? (
                <div className="py-3">
                  <span className="text-neutral-900 text-[12px] font-medium">Official</span>
                  {/*<p className="text-neutral-400 text-[12px] ">Require university approval</p>*/}
                </div>
              ) : (
                <div className="py-3">
                  <span className="text-neutral-900 text-[12px] font-medium">Casual</span>
                  <p className="text-neutral-400 text-[12px] ">No approval required</p>
                </div>
              )}
            </label>
          </div>

          <div ref={categoryRef}>
            <h2 className="font-medium text-sm text-neutral-900">Group Category</h2>
            <CollapsibleMultiSelect
              title="Academic Focus"
              options={subCategories['Academic Focus']}
              selectedOptions={selectedFilters['Academic Focus'] || []}
              onSelect={(value: string) => handleSelect('Academic Focus', value)}
              handleSelectAll={() => handleSelectAllFilter('Academic Focus', subCategories['Academic Focus'])}
            />
            <CollapsibleMultiSelect
              title="Recreation and Hobbies"
              options={subCategories['Recreation and Hobbies']}
              selectedOptions={selectedFilters['Recreation and Hobbies'] || []}
              onSelect={(value: string) => handleSelect('Recreation and Hobbies', value)}
              handleSelectAll={() => handleSelectAllFilter('Recreation and Hobbies', subCategories['Recreation and Hobbies'])}
            />
            <CollapsibleMultiSelect
              title="Advocacy and Awareness"
              options={subCategories['Advocacy and Awareness']}
              selectedOptions={selectedFilters['Advocacy and Awareness'] || []}
              onSelect={(value: string) => handleSelect('Advocacy and Awareness', value)}
              handleSelectAll={() => handleSelectAllFilter('Advocacy and Awareness', subCategories['Advocacy and Awareness'])}
            />
            <CollapsibleMultiSelect
              title="Personal Growth"
              options={subCategories['Personal Growth']}
              selectedOptions={selectedFilters['Personal Growth'] || []}
              onSelect={(value: string) => handleSelect('Personal Growth', value)}
              handleSelectAll={() => handleSelectAllFilter('Personal Growth', subCategories['Personal Growth'])}
            />
            <CollapsibleMultiSelect
              title="Professional Development"
              options={subCategories['Professional Development']}
              selectedOptions={selectedFilters['Professional Development'] || []}
              onSelect={(value: string) => handleSelect('Professional Development', value)}
              handleSelectAll={() => handleSelectAllFilter('Professional Development', subCategories['Professional Development'])}
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
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
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
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  className="flex flex-col gap-8 overflow-hidden my-2"
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
                        //filteredCount={filteredYearCount}
                        multiSelect={false}
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
                        //filteredCount={filteredMajorsCount}
                        parentCategory={studentYear}
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
                        //filteredCount={filteredOccupationCount}
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
                        //filteredCount={filteredAffiliationCount}
                        parentCategory={occupation}
                        isRelative={true}
                      />
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button disabled={isPending} onClick={handleSubmit(onSubmit)} className="bg-[#6647FF] py-2 rounded-lg text-white w-full mx-auto">
            {isLoading || isPending ? <Spinner /> : <p>Update Group</p>}
          </button>
        </form>
      </div>
    </>
  )
}

export default EditCommunityGroupModal
