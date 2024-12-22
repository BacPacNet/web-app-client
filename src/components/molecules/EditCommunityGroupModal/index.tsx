'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FiCamera } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import SelectUsers from '@/components/atoms/SelectUsers'
import { useGetCommunity, useUpdateCommunityGroup } from '@/services/community-university'
import { replaceImage } from '@/services/uploadImage'
import { Spinner } from '../../spinner/Spinner'
import InputBox from '../../atoms/Input/InputBox'
import { IoClose } from 'react-icons/io5'
import { categories, Category, CommunityGroupType, subCategories } from '@/types/CommuityGroup'
import Pill from '@/components/atoms/Pill'
import { useUniStore } from '@/store/store'
import Buttons from '@/components/atoms/Buttons'
import { closeModal, openModal } from '../Modal/ModalManager'
import DeleteCommunityGroupModal from '../DeleteCommunityGroupModal'

type Props = {
  communityGroups: CommunityGroupType
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

const EditCommunityGroupModal = ({ setNewGroup, communityGroups }: Props) => {
  const { userData, userProfileData } = useUniStore()
  const [logoImage, setLogoImage] = useState(communityGroups?.communityGroupLogoUrl?.imageUrl)
  const [coverImage, setCoverImage] = useState(communityGroups?.communityGroupLogoCoverUrl?.imageUrl)

  const [isLoading, setIsLoading] = useState(false)
  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null)

  const { mutate: mutateEditGroup, isPending } = useUpdateCommunityGroup()
  const { data: allCommunityUsers } = useGetCommunity(communityGroups?.communityId)
  const {
    register: GroupRegister,
    handleSubmit,
    formState: { errors: GroupErrors, isDirty },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm()

  useEffect(() => {
    if (communityGroups) {
      const { title, description, communityGroupAccess, communityGroupType, communityGroupCategory, users } = communityGroups
      const defaultCommunityGroup = {
        title: title,
        description: description,
        communityGroupAccess: communityGroupAccess,
        communityGroupType: communityGroupType,
        selectedGroupCategory: Object.keys(communityGroupCategory)[0],
        groupSubCategory: Object.values(communityGroups?.communityGroupCategory)[0],
        selectedUsers: users,
        communityGroupLogoUrl: null,
        communityGroupLogoCoverUrl: null,
      }
      reset(defaultCommunityGroup)
    }
  }, [communityGroups, reset])

  const SelectedGroupCategory = watch('selectedGroupCategory')
  const GroupSubCategory = watch('groupSubCategory')
  const SelectedUsers = watch('selectedUsers') as User[]
  const CommunityGroupLogoCoverUrl = watch('communityGroupLogoCoverUrl')
  const communityGroupLogoUrl = watch('communityGroupLogoUrl')

  const sortedUsers = useMemo(() => {
    return allCommunityUsers?.users
      ? [...allCommunityUsers.users].sort((a, b) => {
          const aSelected = SelectedUsers?.some((user) => user.id === a.id)
          const bSelected = SelectedUsers?.some((user) => user.id === b.id)
          return bSelected ? 1 : aSelected ? -1 : 0 // Push selected users to the top
        })
      : []
  }, [allCommunityUsers, SelectedUsers])

  // Handle image preview
  const handleBannerImagePreview = (e: any) => {
    const file = e.target.files[0]
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

  const handleSelectAll = useCallback(() => {
    if (selectedFilter === 'ALL') {
      setValue('selectedUsers', [])
      setSelectedFilter(null)
    } else {
      const getAllUsers = allCommunityUsers?.users?.filter((user) => user?.id !== communityGroups.adminUserId) as unknown as User[]
      setValue('selectedUsers', getAllUsers)
      setSelectedFilter('ALL')
    }
  }, [selectedFilter, allCommunityUsers, communityGroups])

  const handleSelectSameYear = useCallback(() => {
    if (selectedFilter === 'SAME_YEAR') {
      setValue('selectedUsers', [])
      setSelectedFilter(null)
    } else {
      const getAllUsers = allCommunityUsers?.users?.filter(
        (user) => user.year === userProfileData?.study_year && user?.id !== userData?.id
      ) as unknown as User[]
      setValue('selectedUsers', getAllUsers)
      setSelectedFilter('SAME_YEAR')
    }
  }, [selectedFilter, allCommunityUsers, userProfileData, userData])

  const handleSelectSameMajor = useCallback(() => {
    if (selectedFilter === 'SAME_MAJOR') {
      setValue('selectedUsers', [])
      setSelectedFilter(null)
    } else {
      const getAllUsers = allCommunityUsers?.users?.filter(
        (user) => user.major === userProfileData?.major && user?.id !== userData?.id
      ) as unknown as User[]
      setValue('selectedUsers', getAllUsers)
      setSelectedFilter('SAME_MAJOR')
    }
  }, [selectedFilter, allCommunityUsers, userProfileData, userData])

  const handleCategoryChange = (category: Category) => {
    console.log(category, 'category')
    setValue('selectedGroupCategory', category)
    console.log(SelectedGroupCategory, 'afer')
    if (SelectedGroupCategory !== category) {
      setValue('groupSubCategory', [])
    }
    //setSelectedGroupCategory(category)
    //setGroupSubCategory([])
  }

  const handleSubCategoryChange = (subCategory: string) => {
    console.log(subCategory, 'subCategory', SelectedGroupCategory)
    const getGroupSubCategory = getValues('groupSubCategory')
    const filterSubCategory = getGroupSubCategory.includes(subCategory)
      ? getGroupSubCategory.filter((item: string) => item !== subCategory)
      : [...getGroupSubCategory, subCategory]
    setValue('groupSubCategory', filterSubCategory)
  }

  const handleClick = (userId: string) => {
    if (userId == communityGroups.adminUserId) return console.log('you can not remove yourself')

    if (SelectedUsers?.some((selectedUser) => selectedUser.id == userId)) {
      const filterUsers = SelectedUsers.filter((selectedUser) => selectedUser.id !== userId)
      setValue('selectedUsers', filterUsers)
    }
  }

  const onSubmit = async (data: any) => {
    let CoverImageData = communityGroups?.communityGroupLogoCoverUrl
    let LogoImageData = communityGroups?.communityGroupLogoUrl
    let payload = data
    setIsLoading(true)
    if (communityGroupLogoUrl) {
      const imagedata: any = await replaceImage(communityGroupLogoUrl, communityGroups?.communityGroupLogoUrl?.publicId || '')
      CoverImageData = { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId }
    }
    if (CommunityGroupLogoCoverUrl) {
      const imagedata: any = await replaceImage(CommunityGroupLogoCoverUrl, communityGroups?.communityGroupLogoCoverUrl?.imageUrl || '')
      LogoImageData = { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId }
    }
    payload = { ...payload, communityGroupLogoUrl: LogoImageData, communityGroupLogoCoverUrl: CoverImageData }

    mutateEditGroup({ communityId: communityGroups?._id, payload: payload })
    setIsLoading(false)
    setNewGroup(false)
    closeModal()
  }

  const handleDeleteGroup = () => {
    if (communityGroups?._id) {
      openModal(<DeleteCommunityGroupModal communityId={communityGroups?.communityId} communityGroupId={communityGroups?._id} />, 'h-auto w-[400px]')
    }
  }

  return (
    <>
      <div className="flex justify-start items-center gap-4 w-full ">
        <div className="flex flex-col gap-4 justify-start items-start w-full">
          <h3 className="text-neutral-700 text-base font-semibold">Update Group</h3>

          {/* log0 */}

          {/* Forms  */}
          <form className="w-full flex flex-col gap-4">
            <div
              className={` ${
                !coverImage ? 'border-2 border-neutral-200' : ''
              } rounded-md relative  flex flex-col w-full items-center justify-center h-40 z-20`}
            >
              {coverImage && (
                <img
                  className="w-full h-full  absolute -z-10 object-cover rounded-lg"
                  src={typeof coverImage === 'object' ? URL.createObjectURL(coverImage) : coverImage}
                  alt=""
                />
              )}
              <input style={{ display: 'none' }} type="file" id="CreateGroupImage" onChange={handleBannerImagePreview} />
              <label htmlFor="CreateGroupImage" className="flex flex-col items-center gap-2">
                <FiCamera size={40} className="text-primary-500" />
                <p className="text-neutral-900 font-medium ">
                  <span className="text-primary-500">Upload</span> Banner Image
                </p>
              </label>
            </div>
            <div className="flex gap-3 items-center justify-between">
              <div
                className={` border-2 relative border-neutral-200 bg-white flex  items-center justify-center w-14 h-14 lg:w-24 lg:h-24 rounded-full`}
              >
                {logoImage && (
                  <img
                    className="w-14 h-14 lg:w-24 lg:h-24 rounded-full absolute  object-cover"
                    src={typeof logoImage === 'object' ? URL.createObjectURL(logoImage) : logoImage}
                    alt=""
                  />
                )}
                <input style={{ display: 'none' }} type="file" id="CreateGroupLogoImage" onChange={handlelogoImagePreview} />
                <label htmlFor="CreateGroupLogoImage" className="flex flex-col items-center gap-2">
                  <FiCamera size={30} className="text-slate-400 z-30" />
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

                {GroupErrors.title && <span className="text-red-500 text-2xs font-normal text-"> This field is required</span>}
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

              {GroupErrors.description && <span className="text-red-500 text-2xs font-normal"> This field is required</span>}
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
              {GroupErrors.communityGroupAccess && <p className="text-red-500 text-2xs">This field is required</p>}
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
              {GroupErrors.communityGroupType && <p className="text-red-500 text-2xs ">This field is required</p>}
            </div>

            <div>
              <h2 className="font-medium text-xs py-2">Group Category</h2>
              <div className="flex flex-col gap-3">
                {categories.map((category) => (
                  <>
                    <label htmlFor={category} key={category} className="flex items-start gap-3">
                      <input
                        type="radio"
                        value={category}
                        checked={SelectedGroupCategory === category}
                        {...GroupRegister('selectedGroupCategory', { required: true })}
                        className="w-5 h-5"
                        id={category}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span className="text-neutral-900 text-[12px] font-medium">{category}</span>
                    </label>

                    {SelectedGroupCategory === category && (
                      <div className="mt-2 grid grid-cols-2 gap-4 ps-4">
                        {subCategories[category].map((subCategory) => (
                          <label key={subCategory} htmlFor={subCategory} className="flex items-center gap-2">
                            <input
                              id={subCategory}
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
              {GroupErrors.groupCategory && <p className="text-red-500 text-2xs ">This field is required</p>}
            </div>
            <div className="relative w-full flex flex-col">
              <label htmlFor="inviteFriends" className="font-medium text-xs pb-2">
                Add Members
              </label>
              <InputBox isCancel={true} onCancel={() => setShowSelectUsers(false)} onClick={() => setShowSelectUsers(true)} type="text" />

              {showSelectUsers && (
                <div className="w-full min-h-[200px] rounded-b-lg shadow-lg">
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

                  <div className="flex flex-col h-96 overflow-y-scroll">
                    {!allCommunityUsers?.users.length ? (
                      <p className="text-center">No Data!</p>
                    ) : (
                      sortedUsers
                        ?.filter((user) => user?.id !== communityGroups.adminUserId)
                        .map((user: any) => <SelectUsers key={user.id} user={user} setValue={setValue} selectedUsers={SelectedUsers} />)
                    )}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap mt-2">
                {SelectedUsers?.length < 9 ? (
                  <div className="flex gap-2 flex-wrap">
                    {SelectedUsers.map((item: User) => (
                      <div key={item.id} className="bg-secondary px-2 py-1 text-xs text-primary-500 rounded-md flex items-center gap-2">
                        {item?.firstName}{' '}
                        <span onClick={() => handleClick(item.id)} className="cursor-pointer text-sm">
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
            {/*{!showSelectUsers && <div className="h-14"></div>}*/}
            <div className="text-center">
              <Buttons onClick={handleSubmit(onSubmit)} size="small" variant="primary" disabled={isLoading || isPending} className="w-3/4">
                {isLoading || isPending ? <Spinner /> : <p>Update Changes</p>}
              </Buttons>
            </div>
          </form>
          <div className="text-center w-full">
            <Buttons onClick={handleDeleteGroup} className="w-3/4" size="small" variant="danger">
              Delete Group
            </Buttons>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditCommunityGroupModal
