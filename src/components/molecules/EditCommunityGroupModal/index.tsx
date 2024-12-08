'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { FiCamera } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import SelectUsers from '@/components/atoms/SelectUsers'
import { useGetCommunity, useGetCommunityUsers, useUpdateCommunityGroup } from '@/services/community-university'
import { replaceImage } from '@/services/uploadImage'
import { Spinner } from '../../spinner/Spinner'
import InputBox from '../../atoms/Input/InputBox'
import { IoClose } from 'react-icons/io5'
import { categories, Category, CommunityGroupType, subCategories } from '@/types/CommuityGroup'
import Buttons from '@/components/atoms/Buttons'

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

const EditCommunityGroupModal = ({ setNewGroup, communityGroups }: Props) => {
  const [logoImage, setLogoImage] = useState(communityGroups?.communityGroupLogoUrl?.imageUrl)
  const [coverImage, setCoverImage] = useState(communityGroups?.communityGroupLogoCoverUrl?.imageUrl)

  const [isLoading, setIsLoading] = useState(false)
  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(false)
  const [selectedUsers, setSelectedUsers] = useState<User[] | []>([])

  const [selectedGroupCategory, setSelectedGroupCategory] = useState<Category | null>(null)
  const [groupSubCategory, setGroupSubCategory] = useState<string[]>([])

  const [searchInput, setSearchInput] = useState('')
  const { mutate: mutateEditGroup, isPending } = useUpdateCommunityGroup()
  const { data: allCommunityUsers } = useGetCommunity(communityGroups?.communityId)
  const {
    register: GroupRegister,
    handleSubmit: handleGroupCreate,
    formState: { errors: GroupErrors },
    getValues,
    watch,
    setValue,
    setError,
  } = useForm({
    defaultValues: {
      title: communityGroups.title,
      description: communityGroups.description,
      communityGroupType: communityGroups.communityGroupType,
      groupType: 'Casual',
      groupCategory: '',
      communityGroupAccess: communityGroups.communityGroupAccess,
    },
  })

  const category = watch('groupCategory')

  const handleSelectAll = useCallback(() => {
    const getAlluser: any = allCommunityUsers?.users?.map((user) => user)
    setSelectedUsers(getAlluser)
  }, [])

  const handleCategoryChange = (category: Category) => {
    setSelectedGroupCategory(category)
    setGroupSubCategory([])
  }

  const handleSubCategoryChange = (subCategory: string) => {
    setGroupSubCategory((prev) => (prev.includes(subCategory) ? prev.filter((item) => item !== subCategory) : [...prev, subCategory]))
  }

  const handleClick = (userId: string) => {
    if (selectedUsers?.some((selectedUser) => selectedUser.id == userId)) {
      const filterd = selectedUsers.filter((selectedUser) => selectedUser.id !== userId)
      setSelectedUsers(filterd)
    }
  }

  useEffect(() => {
    const key = Object.keys(communityGroups?.communityGroupCategory)[0] as any
    const value: any = communityGroups?.communityGroupCategory[key]
    setSelectedGroupCategory(key)
    setGroupSubCategory(value)
    setValue('groupCategory', key)

    const usersWithIdField: any = communityGroups.users.map((user) => ({
      ...user,
      id: user.userId,
    }))
    setSelectedUsers(usersWithIdField)
  }, [communityGroups])

  const onGroupSubmit = async (data: any) => {
    let CoverImageData
    let logoImageData
    setIsLoading(true)
    if (coverImage) {
      const imagedata: any = await replaceImage(coverImage, '')
      CoverImageData = { communityGroupLogoCoverUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }
    }
    if (logoImage) {
      const imagedata: any = await replaceImage(logoImage, '')
      logoImageData = { communityGroupLogoUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }
    }

    if (selectedGroupCategory !== 'Others' && groupSubCategory.length < 1) {
      setIsLoading(false)
      return setError('groupCategory', { type: 'manual', message: 'Sub category required!' })
    }
    const selectedUsersId = selectedUsers.map((item) => item.id)
    const dataToPush = {
      ...data,
      ...CoverImageData,
      ...logoImageData,
      selectedUsersId,
      selectedGroupCategory,
      groupSubCategory,
    }

    // return console.log('push', dataToPush, 'id', selectedUsersId)

    mutateEditGroup({ communityId: communityGroups?._id, payload: dataToPush })
    setIsLoading(false)
    setNewGroup(false)
  }

  return (
    <>
      <div className="flex justify-start items-center gap-4 w-full ">
        <div className="flex flex-col gap-4 justify-start items-start w-full">
          <h3 className="text-neutral-700 text-base font-semibold">Update Group</h3>
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
            <input style={{ display: 'none' }} type="file" id="CreateGroupImage" onChange={(e: any) => setCoverImage(e.target.files[0])} />
            <label htmlFor="CreateGroupImage" className="flex flex-col items-center gap-2">
              <FiCamera size={40} className="text-primary-500" />
              <p className="text-neutral-900 font-medium ">
                <span className="text-primary-500">Upload</span> Banner Image
              </p>
            </label>
          </div>
          {/* log0 */}

          {/* Forms  */}
          <form onSubmit={handleGroupCreate(onGroupSubmit)} className="w-full flex flex-col gap-4">
            <div className="flex gap-4 items-center justify-between">
              <div className={` border-2 relative border-neutral-200 bg-white flex  items-center justify-center w-24 h-24 rounded-full`}>
                {logoImage && (
                  <img
                    className="w-24 h-24 rounded-full absolute  object-cover"
                    src={typeof logoImage === 'object' ? URL.createObjectURL(logoImage) : logoImage}
                    alt=""
                  />
                )}
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

            {/* Repost setting  */}
            {/*<div>
              <h2 className="font-medium text-xs">Group Type</h2>
              <label className="flex items-center gap-3">
                <input type="radio" value="public" {...GroupRegister('repostSetting', { required: true })} className="w-5 h-5" />
                <div className="py-3">
                  <span className="text-neutral-900 text-[12px] font-medium">Allow reposting on user’s timelines</span>
                </div>
              </label>

              <label className="flex items-center gap-3">
                <input type="radio" value="private" {...GroupRegister('repostSetting', { required: true })} className="w-5 h-5" />
                <div>
                  <span className="text-neutral-900 text-[12px] font-medium">Only allow reposting within group</span>
                </div>
              </label>
              {GroupErrors.repostSetting && <p className="text-red-500 text-2xs text-sm">This field is required</p>}
            </div>*/}

            {/* category  */}
            {/* category  */}
            <div>
              <h2 className="font-medium text-xs py-2">Group Category</h2>
              <div className="flex flex-col gap-3">
                {categories.map((category) => (
                  <>
                    <label onClick={() => handleCategoryChange(category)} key={category} className="flex items-center gap-3">
                      <input
                        type="radio"
                        value={category.toLowerCase().replace(/ /g, '-')}
                        checked={selectedGroupCategory == category}
                        {...GroupRegister('groupCategory', { required: true })}
                        className="w-5 h-5"
                      />
                      <span className="text-neutral-900 text-[12px] font-medium">{category}</span>
                    </label>

                    {selectedGroupCategory === category && (
                      <div className="mt-2 grid grid-cols-2 gap-4 ps-4">
                        {subCategories[category].map((subCategory) => (
                          <label key={subCategory} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value={subCategory}
                              checked={groupSubCategory.includes(subCategory)}
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
              <label htmlFor="inviteFriends" className="font-medium text-xs">
                Add Members
              </label>
              <div
                onClick={() => setShowSelectUsers(!showSelectUsers)}
                className=" border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full h-10 flex gap-2 items-center"
              ></div>
              {showSelectUsers && (
                <div className="w-full min-h-[200px] shadow-lg p-2">
                  <div className="flex flex-wrap gap-2 pb-6">
                    <Buttons type="button" onClick={handleSelectAll} size="extra_small" variant="border_primary">
                      Select All from Community
                    </Buttons>
                  </div>
                  <div className="flex flex-col gap-4 h-[200px] overflow-y-scroll">
                    {!allCommunityUsers?.users.length ? (
                      <p className="text-center">No Data!</p>
                    ) : (
                      allCommunityUsers?.users?.map((user: any) => (
                        <SelectUsers key={user.id} user={user} setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} />
                      ))
                    )}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap mt-2">
                {selectedUsers?.length < 9 ? (
                  <div className="flex gap-2 flex-wrap">
                    {selectedUsers.map((item: User) => (
                      <div key={item.id} className="bg-secondary py-[2px] px-[6px] text-xs text-primary-500 rounded-sm h-5 flex items-center gap-2">
                        {item?.firstName}{' '}
                        <span onClick={() => handleClick(item.id)} className="cursor-pointer text-sm">
                          <IoClose />
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-secondary py-[2px] px-[6px] text-[10px] text-primary-500 rounded-sm h-5">
                    {selectedUsers?.length} <span></span>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="bg-[#6647FF] py-2 rounded-lg text-white w-3/4 mx-auto">
              {isLoading || isPending ? <Spinner /> : <p>Update Changes</p>}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditCommunityGroupModal
