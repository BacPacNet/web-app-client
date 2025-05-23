'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FiCamera } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { useUpdateCommunityGroup } from '@/services/community-university'
import { Spinner } from '../../spinner/Spinner'
import InputBox from '../../atoms/Input/InputBox'
import { CommunityGroupType, CommunityGroupTypeEnum, status, subCategories } from '@/types/CommuityGroup'

import { useUniStore } from '@/store/store'

import DeleteCommunityGroupModal from '../DeleteCommunityGroupModal'
import { CommunityUsers } from '@/types/Community'
import CollapsibleMultiSelect from '@/components/atoms/CollapsibleMultiSelect'
import { getUniqueById } from '@/lib/communityGroup'
import { BsExclamationCircleFill } from 'react-icons/bs'
import { useUploadToS3 } from '@/services/upload'
import { UPLOAD_CONTEXT } from '@/types/Uploads'
import UserSelectDropdown from '../UserSearchList'
import SelectedUserTags from '@/components/atoms/SelectedUserTags'
import { Users } from '@/types/Connections'
import { useModal } from '@/context/ModalContext'
import Buttons from '@/components/atoms/Buttons'

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
  const [logoImage, setLogoImage] = useState(communityGroups?.communityGroupLogoUrl?.imageUrl)
  const [coverImage, setCoverImage] = useState(communityGroups?.communityGroupLogoCoverUrl?.imageUrl)
  const [searchInput, setSearchInput] = useState('')
  const [individualsUsers, setIndividualsUsers] = useState<any[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [filtersError, setFIltersError] = useState('')
  const [view, setView] = useState<'EDIT_GROUP' | 'ADD_MEMBERS'>('EDIT_GROUP')

  const { mutate: mutateEditGroup, isPending } = useUpdateCommunityGroup()
  const { mutateAsync: uploadToS3 } = useUploadToS3()
  const {
    register: GroupRegister,
    handleSubmit,
    formState: { errors: GroupErrors },
    setValue,
    watch,
    reset,
  } = useForm()

  const dropdownRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const SelectedUsers = watch('selectedUsers') as CommunityUsers[]
  const description = watch('description') || ''

  useEffect(() => {
    if (communityGroups) {
      const { title, description, communityGroupAccess, communityGroupType, communityGroupCategory, users } = communityGroups
      const defaultCommunityGroup = {
        title: title,
        description: description,
        communityGroupAccess: communityGroupAccess,
        communityGroupType: communityGroupType,

        selectedUsers: [],
        communityGroupLogoUrl: null,
        communityGroupLogoCoverUrl: null,
      }
      setSelectedFilters(communityGroupCategory)
      reset(defaultCommunityGroup)
    }
  }, [communityGroups, reset])

  //   const SelectedUsers = watch('selectedUsers') as User[]
  const CommunityGroupLogoCoverUrl = watch('communityGroupLogoCoverUrl')
  const communityGroupLogoUrl = watch('communityGroupLogoUrl')

  //  const sortedUsers = useMemo(() => {
  //    return allCommunityUsers?.users
  //      ? [...allCommunityUsers.users].sort((a, b) => {
  //          const aSelected = SelectedUsers?.some((user) => user.id === a.id)
  //          const bSelected = SelectedUsers?.some((user) => user.id === b.id)
  //          return bSelected ? 1 : aSelected ? -1 : 0 // Push selected users to the top
  //        })
  //      : []
  //  }, [allCommunityUsers, SelectedUsers])

  // Handle image preview
  const handleBannerImagePreview = (e: any) => {
    const file = e.target.files[0] as File
    if (file) {
      setCoverImage(URL.createObjectURL(file))
      setValue('communityGroupLogoUrl', file)
    }
  }

  const handlelogoImagePreview = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      setLogoImage(URL.createObjectURL(file))
      setValue('communityGroupLogoCoverUrl', file)
    }
  }

  const handleClick = (userId: string) => {
    if (userId == communityGroups.adminUserId) return console.log('you can not remove yourself')

    if (SelectedUsers?.some((selectedUser) => selectedUser.id == userId)) {
      const filterUsers = SelectedUsers.filter((selectedUser) => selectedUser.id !== userId)
      setValue('selectedUsers', filterUsers)
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
    let CoverImageData = communityGroups?.communityGroupLogoCoverUrl
    let LogoImageData = communityGroups?.communityGroupLogoUrl
    setIsLoading(true)
    if (communityGroupLogoUrl) {
      const uploadDPPayload = {
        files: [communityGroupLogoUrl],
        context: UPLOAD_CONTEXT.DP,
      }
      const imagedata = await uploadToS3(uploadDPPayload)

      CoverImageData = imagedata.data[0]
    }
    if (CommunityGroupLogoCoverUrl) {
      const uploadCoverPayload = {
        files: [CommunityGroupLogoCoverUrl],
        context: UPLOAD_CONTEXT.COVER_DP,
      }
      const imagedata = await uploadToS3(uploadCoverPayload)
      LogoImageData = imagedata.data[0]
    }

    const communityGroupCategory = {
      communityGroupCategory: selectedFilters,
    }
    const mergedUsers = [...individualsUsers]
    const uniqueUsers = getUniqueById(mergedUsers)
    const existingUserIds = communityGroups.users.map((user) => user.userId)
    const finalUsers = uniqueUsers.filter((user) => !existingUserIds.includes(user.id))
    const payload = {
      ...data,
      ...communityGroupCategory,
      selectedUsers: finalUsers,
      communityGroupLogoUrl: LogoImageData,
      communityGroupLogoCoverUrl: CoverImageData,
      // universityAdminId: communityData?.adminId,
    }

    mutateEditGroup({ communityId: communityGroups?._id, payload: payload })
    setIsLoading(false)
    setSelectedFilters({})
    setNewGroup(false)
    closeModal()
  }

  const handleDeleteGroup = () => {
    if (communityGroups?._id) {
      openModal(
        <DeleteCommunityGroupModal communityId={communityGroups?.communityId?._id} communityGroupId={communityGroups?._id} />,
        'h-auto w-[400px]'
      )
    }
  }

  const validateDescription = (value: string | undefined): string | boolean => {
    if (!value || value.trim() === '') return true

    const trimmedValue = value.trim()
    const charCount = trimmedValue.length

    if (charCount > 160) return 'Bio must not exceed 150 characters'

    return true
  }

  const handleSelectIndividuals = (e: React.MouseEvent, user: Users) => {
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
      <form className="flex flex-col gap-8 justify-start items-start w-full">
        {view === 'EDIT_GROUP' && (
          <>
            <h3 className="text-neutral-700 text-md font-poppins font-bold">Edit Group</h3>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-medium text-sm text-neutral-900">
                Group Profile
              </label>
              <div className={` border-2 border-neutral-200 bg-white flex  items-center justify-center w-[100px] h-[100px] rounded-full`}>
                {logoImage && (
                  <img
                    className="w-[100px] h-[100px] rounded-full absolute  object-cover"
                    src={typeof logoImage === 'object' ? URL.createObjectURL(logoImage) : logoImage}
                    alt=""
                  />
                )}
                {/* <input style={{ display: 'none' }} type="file" id="CreateGroupLogoImage" onChange={(e: any) => setLogoImage(e.target.files[0])} /> */}
                <input
                  style={{ display: 'none' }}
                  accept="image/jpeg,image/png,image/jpg"
                  type="file"
                  id="CreateGroupLogoImage"
                  onChange={handlelogoImagePreview}
                />

                {logoImage ? (
                  <label htmlFor="CreateGroupLogoImage" className="relative flex flex-col items-center gap-2 z-10  ">
                    <div className="w-12 h-12 rounded-full bg-black opacity-50 absolute -z-10 top-1/2 -translate-y-1/2"></div>
                    <FiCamera size={32} className="text-white" />
                  </label>
                ) : (
                  <label htmlFor="CreateGroupLogoImage" className="flex flex-col items-center gap-2">
                    <FiCamera size={32} className="text-primary-500 z-30" />
                  </label>
                )}
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
                {coverImage && (
                  <img
                    className="w-full h-full  absolute object-cover rounded-lg"
                    src={typeof coverImage === 'object' ? URL.createObjectURL(coverImage) : coverImage}
                    alt=""
                  />
                )}
                <input
                  style={{ display: 'none' }}
                  accept="image/jpeg,image/png,image/jpg"
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
            <div className="w-full flex flex-col gap-8">
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
                      <p className="text-neutral-400 text-[12px] ">Require university approval</p>
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
              <Buttons variant="shade" type="button" onClick={() => setView('ADD_MEMBERS')} size="large">
                Add Member
              </Buttons>
              <div className="flex flex-wrap">
                <SelectedUserTags users={individualsUsers} onRemove={(id) => removeUser(id as string)} />
              </div>
            </div>

            <button disabled={isPending} onClick={handleSubmit(onSubmit)} className="bg-[#6647FF] py-2 rounded-lg text-white w-full mx-auto">
              {isLoading || isPending ? <Spinner /> : <p>Update Group</p>}
            </button>
          </>
        )}

        {view === 'ADD_MEMBERS' && (
          <div className="w-full">
            {/* Header with back button */}
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setView('EDIT_GROUP')} className="text-primary-500 font-semibold text-sm">
                ← Back
              </button>
              <h3 className="text-neutral-700 text-md font-bold">Add Members</h3>
            </div>

            {/* Add Member UI */}
            <InputBox
              isCancel={true}
              onCancel={handleClear}
              onClick={() => setShowSelectUsers(true)}
              onChange={(e) => setSearchInput(e.target.value)}
              type="text"
              placeholder="Search Users"
            />
            <UserSelectDropdown
              searchInput={searchInput}
              show={true}
              onSelect={handleSelectIndividuals}
              currentUserId={userProfileData?.users_id as string}
              individualsUsers={individualsUsers}
              //  maxHeight={512}
            />
          </div>
        )}

        {/*<h5 className="font-bold text-md text-neutral-900 font-poppins mt-[10px]">Add Members</h5>
        <div className="relative w-full flex flex-col">
          <label htmlFor="inviteFriends" className="font-medium text-sm text-neutral-900 mb-2">
            Add Individuals
          </label>
        </div>*/}
      </form>
    </>
  )
}

export default EditCommunityGroupModal
