'use client'
import React, { useCallback, useState } from 'react'
import { FiCamera } from 'react-icons/fi'
import { useForm } from 'react-hook-form'

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

  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null)

  const { mutate: createGroup, isPending } = useCreateCommunityGroup()
  const {
    register: GroupRegister,
    watch,
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
      selectedGroupCategory: '',
      groupSubCategory: [],
      selectedUsers: [],
    },
  })

  const SelectedGroupCategory = watch('selectedGroupCategory') as string
  const GroupSubCategory = watch('groupSubCategory') as Array<string>
  const SelectedUsers = watch('selectedUsers') as CommunityUsers[]

  const handleSelectAll = useCallback(() => {
    if (selectedFilter === 'ALL') {
      setValue('selectedUsers', [])
      setSelectedFilter(null)
    } else {
      const getAllUsers = communityData?.users?.filter((user) => user?.id !== userData?.id)
      setValue('selectedUsers', getAllUsers as any)
      setSelectedFilter('ALL')
    }
  }, [selectedFilter, communityData, userData])

  const handleSelectSameYear = useCallback(() => {
    if (selectedFilter === 'SAME_YEAR') {
      setValue('selectedUsers', [])
      setSelectedFilter(null)
    } else {
      const getAllUsers = communityData?.users?.filter(
        (user) => user.year === userProfileData?.study_year && user?.id !== userData?.id
      ) as unknown as CommunityUsers[]
      setValue('selectedUsers', getAllUsers as any)
      setSelectedFilter('SAME_YEAR')
    }
  }, [selectedFilter, communityData, userProfileData, userData])

  const handleSelectSameMajor = useCallback(() => {
    if (selectedFilter === 'SAME_MAJOR') {
      setValue('selectedUsers', [])
      setSelectedFilter(null)
    } else {
      const getAllUsers = communityData?.users?.filter(
        (user) => user.major === userProfileData?.major && user?.id !== userData?.id
      ) as unknown as CommunityUsers[]
      setValue('selectedUsers', getAllUsers as any)
      setSelectedFilter('SAME_MAJOR')
    }
  }, [selectedFilter, communityData, userProfileData, userData])

  const handleCategoryChange = (category: Category) => {
    setValue('selectedGroupCategory', category)
    if (SelectedGroupCategory !== category) {
      setValue('groupSubCategory', [])
    }
  }

  const handleSubCategoryChange = (subCategory: string) => {
    const getGroupSubCategory = getValues('groupSubCategory')
    const filterSubCategory = getGroupSubCategory.includes(subCategory)
      ? getGroupSubCategory.filter((item: string) => item !== subCategory)
      : [...getGroupSubCategory, subCategory]
    setValue('groupSubCategory', filterSubCategory)
    //setGroupSubCategory((prev) => (prev.includes(subCategory) ? prev.filter((item) => item !== subCategory) : [...prev, subCategory]))
  }

  const handleImageUpload = async (files: string) => {
    if (files) {
      const data = await replaceImage(files, userProfileData?.profile_dp?.publicId)
      return { imageUrl: data?.imageUrl, publicId: data?.publicId }
    } else {
      console.error('No file selected.')
    }
  }

  const onGroupSubmit = async (data: any) => {
    setIsLoading(true)
    let CoverImageData
    let logoImageData
    if (SelectedGroupCategory !== 'Others' && GroupSubCategory.length < 1) {
      setIsLoading(false)
      return setError('selectedGroupCategory', { type: 'manual', message: 'Sub category required!' })
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

    const payload = {
      ...data,
      communityGroupLogoUrl: logoImageData,
      communityGroupLogoCoverUrl: CoverImageData,
    }

    createGroup({ communityId: communityId, data: payload })
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

  return (
    <>
      <div className="flex flex-col gap-4 justify-start items-start w-full">
        <h3 className="text-neutral-700 text-base font-semibold">Create Group</h3>
        <div
          className={` ${
            !coverImage ? 'border-2 border-neutral-200' : ''
          } rounded-md relative  flex flex-col w-full items-center justify-center h-40 `}
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
        {/* log0 */}

        {/* Forms  */}
        <form className="w-full flex flex-col gap-4">
          <div className="flex gap-4 items-center justify-between">
            <div className={` border-2 border-neutral-200 bg-white flex  items-center justify-center w-24 h-24 rounded-full`}>
              {logoImage && <img className="w-24 h-24 rounded-full absolute  object-cover" src={URL.createObjectURL(logoImage)} alt="" />}
              <input style={{ display: 'none' }} type="file" id="CreateGroupLogoImage" onChange={(e: any) => setLogoImage(e.target.files[0])} />
              <label htmlFor="CreateGroupLogoImage" className="flex flex-col items-center gap-2">
                <FiCamera size={40} className="text-slate-400 z-30" />
              </label>
            </div>
            <div className="relative w-9/12 flex flex-col gap-2">
              <label htmlFor="name" className="font-medium text-xs">
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
            <label htmlFor="description" className="font-medium text-xs">
              Description
            </label>

            <textarea
              className="w-full p-2 border border-neutral-200 rounded-lg resize-none focus:outline-none h-28 overflow-y-auto text-xs"
              {...GroupRegister('description', {
                required: true,
              })}
              placeholder="Enter description"
            ></textarea>

            {errors.description && <span className="text-red-500 text-2xs font-normal"> This field is required</span>}
          </div>

          <div>
            <h2 className="font-medium text-xs">Group Access</h2>
            <label className="flex items-center gap-3">
              <input type="radio" value="Public" {...GroupRegister('communityGroupAccess', { required: true })} className="w-5 h-5" />
              <div className="py-2">
                <span className="text-neutral-900 text-[12px] font-medium">Public</span>
                <p className="text-neutral-400 text-[12px] ">Anyone can join</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input type="radio" value="Private" {...GroupRegister('communityGroupAccess', { required: true })} className="w-5 h-5" />
              <div>
                <span className="text-neutral-900 text-[12px] font-medium">Private</span>
                <p className="text-neutral-400 text-[12px] ">Permission to join required</p>
              </div>
            </label>
            {errors.communityGroupAccess && <p className="text-red-500 text-2xs">This field is required</p>}
          </div>

          {/* communty group type  */}

          <div>
            <h2 className="font-medium text-xs">Group Type</h2>
            <label className="flex items-center gap-3">
              <input type="radio" value="Casual" {...GroupRegister('communityGroupType', { required: true })} className="w-5 h-5" />
              <div className="py-2">
                <span className="text-neutral-900 text-[12px] font-medium">Casual</span>
                <p className="text-neutral-400 text-[12px] ">No approval required</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input type="radio" value="Official" {...GroupRegister('communityGroupType', { required: true })} className="w-5 h-5" />
              <div>
                <span className="text-neutral-900 text-[12px] font-medium">Official</span>
                <p className="text-neutral-400 text-[12px] ">Require university approval</p>
              </div>
            </label>
            {errors.communityGroupType && <p className="text-red-500 text-2xs ">This field is required</p>}
          </div>

          <div>
            <h2 className="font-medium text-xs py-2">Group Category</h2>
            <div className="flex flex-col gap-3">
              {categories.map((category) => (
                <>
                  <label key={category} className="flex items-center gap-3">
                    <input
                      onClick={() => handleCategoryChange(category)}
                      type="radio"
                      value={category.toLowerCase().replace(/ /g, '-')}
                      checked={getValues('selectedGroupCategory') === category}
                      {...GroupRegister('selectedGroupCategory', { required: true })}
                      className="w-5 h-5"
                      name="group-cateogry"
                    />
                    <span className="text-neutral-900 text-[12px] font-medium">{category}</span>
                  </label>

                  {SelectedGroupCategory === category && (
                    <div className="mt-2 grid grid-cols-2 gap-4 ps-4">
                      {subCategories[category].map((subCategory) => (
                        <label key={subCategory} className="flex items-center gap-2">
                          <input
                            name="groupSubCategory"
                            type="checkbox"
                            value={subCategory}
                            checked={GroupSubCategory.includes(subCategory)}
                            onChange={() => handleSubCategoryChange(subCategory)}
                            className="w-4 h-4"
                          />
                          <span className="text-neutral-700 text-2xs">{subCategory}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </>
              ))}
            </div>
            {errors.selectedGroupCategory && (
              <p className="text-red-500 text-2xs ">{errors.selectedGroupCategory.message?.toString() || 'This field is required'}</p>
            )}
          </div>
          <div className="relative w-full flex flex-col">
            <label htmlFor="inviteFriends" className="font-medium text-xs">
              Add Members
            </label>
            <InputBox isCancel={true} onCancel={() => setShowSelectUsers(false)} onClick={() => setShowSelectUsers(true)} type="text" />

            {showSelectUsers && (
              <div className="w-full min-h-[200px] rounded-b-lg shadow-xl">
                <div className="flex flex-wrap gap-2 p-4">
                  <Pill onClick={handleSelectAll} size="extra_small" variant={selectedFilter === 'ALL' ? 'primary' : 'border_primary'}>
                    {selectedFilter === 'ALL' ? 'Clear All from Community' : 'Select All from Community'}
                  </Pill>

                  <Pill onClick={handleSelectSameYear} size="extra_small" variant={selectedFilter === 'SAME_YEAR' ? 'primary' : 'border_primary'}>
                    {selectedFilter === 'SAME_YEAR' ? 'Clear All Same Year' : 'Select all Same Year'}
                  </Pill>

                  <Pill onClick={handleSelectSameMajor} size="extra_small" variant={selectedFilter === 'SAME_MAJOR' ? 'primary' : 'border_primary'}>
                    {selectedFilter === 'SAME_MAJOR' ? 'Clear All Same Major' : 'Select All Same Major'}
                  </Pill>
                </div>
                <div className="flex flex-col overflow-y-scroll">
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
                    <div key={item.id} className="bg-secondary px-2 py-1 text-xs text-primary-500 rounded-md flex items-center gap-2">
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
          <button disabled={isPending} onClick={handleGroupCreate(onGroupSubmit)} className="bg-[#6647FF] py-2 rounded-lg text-white w-3/4 mx-auto">
            {isLoading || isPending ? <Spinner /> : <p>Create Groups</p>}
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateNewGroup
