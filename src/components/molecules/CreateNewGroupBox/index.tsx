'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FiCamera } from 'react-icons/fi'
import { Controller, useForm } from 'react-hook-form'

import { useCreateCommunityGroup, useGetCommunity } from '@/services/community-university'
import { replaceImage } from '@/services/uploadImage'
import { Spinner } from '../../spinner/Spinner'
import InputBox from '../../atoms/Input/InputBox'
import SelectUsers from '@/components/atoms/SelectUsers'
import { IoClose } from 'react-icons/io5'
import { useUniStore } from '@/store/store'
import { categories, Category, CreateCommunityGroupType, subCategories } from '@/types/CommuityGroup'
import Pill from '@/components/atoms/Pill'
import { closeModal } from '../Modal/ModalManager'
import { CommunityUsers } from '@/types/Community'
import CollapsibleMultiSelect from '@/components/atoms/CollapsibleMultiSelect'
import { FaTimes } from 'react-icons/fa'
import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import { degreeAndMajors, occupationAndDepartment, value } from '@/types/RegisterForm'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import CustomTooltip from '@/components/atoms/CustomTooltip'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import {
  filterData,
  filterFacultyData,
  getFilteredAffiliationCounts,
  getFilteredMajorCounts,
  getFilteredYearCounts,
  getOccupationCounts,
  getUniqueById,
} from '@/lib/communityGroup'

type Props = {
  communityId: string
  setNewGroup: (value: boolean) => void
}
type media = {
  imageUrl: string
  publicId: string
}

type User = {
  id: string
  firstName: string
  isOnline?: boolean
  profile: {
    profile_dp: media
    _id: string
  }
}
type FilterType = 'ALL' | 'SAME_YEAR' | 'SAME_MAJOR' | null

const CreateNewGroup = ({ setNewGroup, communityId = '' }: Props) => {
  const { userData, userProfileData } = useUniStore()
  const [logoImage, setLogoImage] = useState()
  const [coverImage, setCoverImage] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(false)
  const { data: communityData } = useGetCommunity(communityId)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [filtersError, setFIltersError] = useState('')
  const [filteredUsers, setFilterUsers] = useState<any>()
  const [filteredFacultyUsers, setFilterFacultyUsers] = useState<any>()
  const [filteredYearCount, setFilteredYearsCount] = useState<Record<string, number>>()
  const [filteredMajorsCount, setFilteredMajorsCount] = useState<Record<string, number>>()
  const [filteredOccupationCount, setFilteredOccupationCount] = useState<Record<string, number>>()
  const [filteredAffiliationCount, setFilteredAffiliationCount] = useState<Record<string, number>>()
  const { mutate: createGroup, isPending } = useCreateCommunityGroup()
  const {
    register: GroupRegister,
    watch,
    control,
    handleSubmit: handleGroupCreate,
    formState: { errors },
    setError,
    setValue,
    getValues,
  } = useForm<CreateCommunityGroupType>({
    defaultValues: {
      communityGroupLogoUrl: null,
      communityGroupLogoCoverUrl: null,
      title: '',
      description: '',
      communityGroupAccess: '',
      communityGroupType: '',
      selectedUsers: [],
    },
  })

  const SelectedUsers = watch('selectedUsers') as CommunityUsers[]
  const description = watch('description') || ''
  const studentYear = watch('studentYear') || ''
  const major = watch('major') || ''
  const occupation = watch('occupation') || ''
  const affiliation = watch('affiliation') || ''

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

  const handleImageUpload = async (files: string) => {
    if (files) {
      const data = await replaceImage(files, userProfileData?.profile_dp?.publicId)
      return { imageUrl: data?.imageUrl, publicId: data?.publicId }
    } else {
      console.error('No file selected.')
    }
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
      return setFIltersError('category required')
    }
    console.log(errors, 'errors')
    if (coverImage) {
      CoverImageData = await handleImageUpload(coverImage)
      setValue('communityGroupLogoCoverUrl', CoverImageData as any)
    }
    if (logoImage) {
      logoImageData = await handleImageUpload(logoImage)
      setValue('communityGroupLogoUrl', logoImageData as any)
    }

    const communityGroupCategory = {
      communityGroupCategory: selectedFilters,
    }
    const mergedUsers = [...SelectedUsers, ...filteredUsers, ...filteredFacultyUsers]
    const uniqueUsers = getUniqueById(mergedUsers)
    const payload = {
      ...data,
      ...communityGroupCategory,
      selectedUsers: uniqueUsers,
      communityGroupLogoUrl: logoImageData,
      communityGroupLogoCoverUrl: CoverImageData,
    }

    createGroup({ communityId: communityId, data: payload })
    setSelectedFilters({})
    setIsLoading(false)
    setNewGroup(false)
    closeModal()
  }

  const handleClick = (userId: string) => {
    if (SelectedUsers?.some((selectedUser) => selectedUser.id == userId)) {
      const filterUsers = SelectedUsers.filter((selectedUser) => selectedUser.id !== userId)
      setValue('selectedUsers', filterUsers as any)
    }
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

  return (
    <>
      <div className="flex flex-col gap-8 justify-start items-start w-full  ">
        <h3 className="text-neutral-700 text-md font-poppins font-bold">Group Information</h3>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-medium text-sm text-neutral-900">
            Group Profile
          </label>
          <div className={` border-2 border-neutral-200 bg-white flex  items-center justify-center w-[100px] h-[100px] rounded-full`}>
            {logoImage && <img className="w-24 h-24 rounded-full absolute  object-cover" src={URL.createObjectURL(logoImage)} alt="" />}
            <input style={{ display: 'none' }} type="file" id="CreateGroupLogoImage" onChange={(e: any) => setLogoImage(e.target.files[0])} />
            <label htmlFor="CreateGroupLogoImage" className="flex flex-col items-center gap-2">
              <FiCamera size={40} className="text-slate-400 z-30" />
            </label>
          </div>
        </div>
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
            <input style={{ display: 'none' }} type="file" id="CreateGroupImage" onChange={(e: any) => setCoverImage(e.target.files[0])} />
            <label htmlFor="CreateGroupImage" className="flex flex-col items-center gap-2 z-10">
              <FiCamera size={40} className="text-primary-500" />
              <p className="text-neutral-900 font-medium ">
                <span className="text-primary-500">Upload</span> Banner Image
              </p>
            </label>
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

              {errors.title && <span className="text-red-500 text-2xs font-normal text-"> This field is required</span>}
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

            {errors.description && <span className="text-red-500 text-2xs font-normal"> This field is required</span>}
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
                after:content-[''] after:absolute after:top-[3px] after:left-[3.5px]
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
            <h2 className="font-medium text-sm text-neutral-900">Group Type</h2>
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
                after:content-[''] after:absolute after:top-[3px] after:left-[3.5px]
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
                after:content-[''] after:absolute after:top-[3px] after:left-[3.5px]
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
          {/* <div>
            <h2 className="font-medium text-sm text-neutral-900">Repost Setting</h2>
            <div className="flex items-center gap-3 py-3 ">
              <input type="radio" value="Casual" {...GroupRegister('repostOption', { required: true })} className="w-[18px] h-[18px] mt-1" />
              <div className="">
                <span className="text-neutral-900 text-[12px] font-medium">Allow reposting on user’s timelines</span>
              </div>
            </div>

            <label className="flex items-center gap-3">
              <input type="radio" value="Official" {...GroupRegister('repostOption', { required: true })} className="w-[18px] h-[18px] mt-1" />
              <div className="py-3">
                <span className="text-neutral-900 text-[12px] font-medium">Only allow reposting within group</span>
              </div>
            </label>
            {errors.repostOption && <p className="text-red-500 text-2xs ">This field is required</p>}
          </div> */}

          <div>
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
              onCancel={() => setShowSelectUsers(false)}
              onClick={() => setShowSelectUsers(true)}
              type="text"
              placeholder="Search Users"
            />

            {showSelectUsers && (
              <div ref={dropdownRef} className="w-full min-h-[200px] rounded-b-lg shadow-xl">
                {/* <div className="flex flex-wrap gap-2 p-4">
                  <Pill onClick={handleSelectAll} size="extra_small" variant={selectedFilter === 'ALL' ? 'primary' : 'border_primary'}>
                    {selectedFilter === 'ALL' ? 'Clear All from Community' : 'Select All from Community'}
                  </Pill>

                  <Pill onClick={handleSelectSameYear} size="extra_small" variant={selectedFilter === 'SAME_YEAR' ? 'primary' : 'border_primary'}>
                    {selectedFilter === 'SAME_YEAR' ? 'Clear All Same Year' : 'Select all Same Year'}
                  </Pill>

                  <Pill onClick={handleSelectSameMajor} size="extra_small" variant={selectedFilter === 'SAME_MAJOR' ? 'primary' : 'border_primary'}>
                    {selectedFilter === 'SAME_MAJOR' ? 'Clear All Same Major' : 'Select All Same Major'}
                  </Pill>
                </div> */}
                <div className="flex flex-col overflow-y-scroll max-h-64">
                  {!communityData?.users.length ? (
                    <p className="text-center">No Data!</p>
                  ) : (
                    communityData?.users
                      ?.filter((user) => user?.id !== userData?.id)
                      .map((user: any) => <SelectUsers key={user.id} user={user} setValue={setValue} selectedUsers={SelectedUsers} />)
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap mt-2">
              {SelectedUsers?.length < 9 ? (
                <div className="flex gap-2 flex-wrap">
                  {SelectedUsers?.map((item) => (
                    // <div key={item.id} className="bg-secondary px-2 py-1 text-xs text-primary-500 rounded-md flex items-center gap-2">
                    <div key={item.id} className="flex items-center text-2xs  px-2 py-1 h-7 bg-primary-500 text-white rounded-md">
                      {item?.firstName}{' '}
                      <span onClick={() => handleClick(item.id as string)} className="cursor-pointer text-sm">
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
          </div>
          <div className="flex flex-col gap-8">
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
                />
              )}
            />
          </div>
          <button disabled={isPending} onClick={handleGroupCreate(onGroupSubmit)} className="bg-[#6647FF] py-2 rounded-lg text-white w-full mx-auto">
            {isLoading || isPending ? <Spinner /> : <p>Create New Group</p>}
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateNewGroup
