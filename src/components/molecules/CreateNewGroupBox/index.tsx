'use client'
import React, { useCallback, useState } from 'react'
import { FiCamera } from 'react-icons/fi'
import { useForm } from 'react-hook-form'

import { useCreateCommunityGroup, useGetCommunity } from '@/services/community-university'
import { replaceImage } from '@/services/uploadImage'
import { Spinner } from '../../spinner/Spinner'
import InputBox from '../../atoms/Input/InputBox'
import Buttons from '@/components/atoms/Buttons'
import SelectUsers from '@/components/atoms/SelectUsers'
import { IoClose } from 'react-icons/io5'

type Props = {
  communityId: string
  setNewGroup: (value: boolean) => void
}

type user = {
  id: string
  profileImageUrl: string
  firstName: string
  year: string
  degree: string
  major: string
}

type Category = 'Academic Focus' | 'Recreation and Hobbies' | 'Advocacy and Awareness' | 'Personal Growth' | 'Professional Development' | 'Others'

const subCategories: Record<Category, string[]> = {
  'Academic Focus': [
    'Science & Technology',
    'Arts & Humanities',
    'Social Sciences',
    'Education',
    'Business & Economics',
    'Health & Medicine',
    'Environmental Studies',
    'Law & Policy',
    'Mathematics & Statistics',
    'Engineering',
  ],
  'Recreation and Hobbies': ['f', 'g', 'h'],
  'Advocacy and Awareness': ['i', 'j'],
  'Personal Growth': ['k', 'l', 'm'],
  'Professional Development': ['n', 'o'],
  Others: [],
}

const categories: Category[] = [
  'Academic Focus',
  'Recreation and Hobbies',
  'Advocacy and Awareness',
  'Personal Growth',
  'Professional Development',
  'Others',
]

const CreateNewGroup = ({ setNewGroup, communityId }: Props) => {
  const [logoImage, setLogoImage] = useState()
  const [coverImage, setCoverImage] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<user[] | []>([])
  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(false)
  const [searchInput, setSearchInput] = useState('')
  const [selectedGroupCategory, setSelectedGroupCategory] = useState<Category | null>(null)
  const [groupSubCategory, setGroupSubCategory] = useState<string[]>([])
  const { data: communityData } = useGetCommunity(communityId)

  const { mutate: createGroup, isPending } = useCreateCommunityGroup()
  const {
    register: GroupRegister,
    handleSubmit: handleGroupCreate,
    formState: { errors: GroupErrors },
    getValues,
  } = useForm()

  const handleSelectAll = useCallback(() => {
    const getAlluser: any = communityData?.users?.map((user) => user)
    setSelectedUsers(getAlluser)
  }, [])

  const handleCategoryChange = (category: Category) => {
    setSelectedGroupCategory(category)
    setGroupSubCategory([])
  }

  const handleSubCategoryChange = (subCategory: string) => {
    setGroupSubCategory((prev) => (prev.includes(subCategory) ? prev.filter((item) => item !== subCategory) : [...prev, subCategory]))
  }

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
    const selectedUsersId = selectedUsers.map((item) => item.id)
    const dataToPush = {
      ...data,
      ...CoverImageData,
      ...logoImageData,
      selectedUsersId,
    }

    createGroup({ communityId: communityId, data: dataToPush })
    setIsLoading(false)
    setNewGroup(false)
  }

  const handleClick = (userId: string) => {
    if (selectedUsers?.some((selectedUser) => selectedUser.id == userId)) {
      const filterd = selectedUsers.filter((selectedUser) => selectedUser.id !== userId)
      setSelectedUsers(filterd)
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
          {coverImage && <img className="w-full h-full  absolute -z-10 object-cover rounded-lg" src={URL.createObjectURL(coverImage)} alt="" />}
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
              <input type="radio" value="Public" {...GroupRegister('communityGroupType', { required: true })} className="w-5 h-5" />
              <div className="py-2">
                <span className="text-neutral-900 text-[12px] font-medium">Public</span>
                <p className="text-neutral-400 text-[12px] ">Anyone can join</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input type="radio" value="Private" {...GroupRegister('communityGroupType', { required: true })} className="w-5 h-5" />
              <div>
                <span className="text-neutral-900 text-[12px] font-medium">Private</span>
                <p className="text-neutral-400 text-[12px] ">Permission to join required</p>
              </div>
            </label>
            {GroupErrors.communityGroupType && <p className="text-red-500 text-2xs">This field is required</p>}
          </div>

          {/* communty group type  */}

          <div>
            <h2 className="font-medium text-xs">Group Type</h2>
            <label className="flex items-center gap-3">
              <input type="radio" value="Casual" {...GroupRegister('groupType', { required: true })} className="w-5 h-5" />
              <div className="py-2">
                <span className="text-neutral-900 text-[12px] font-medium">Casual</span>
                <p className="text-neutral-400 text-[12px] ">No approval required</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input type="radio" value="Official" {...GroupRegister('groupType', { required: true })} className="w-5 h-5" />
              <div>
                <span className="text-neutral-900 text-[12px] font-medium">Official</span>
                <p className="text-neutral-400 text-[12px] ">Require university approval</p>
              </div>
            </label>
            {GroupErrors.groupType && <p className="text-red-500 text-2xs ">This field is required</p>}
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
          <div>
            <h2 className="font-medium text-xs py-2">Group Category</h2>
            <div className="flex flex-col gap-3">
              {categories.map((category) => (
                <>
                  <label onClick={() => handleCategoryChange(category)} key={category} className="flex items-center gap-3">
                    <input
                      type="radio"
                      value={category.toLowerCase().replace(/ /g, '-')}
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
                  <Buttons size="extra_small" variant="border_primary">
                    Select All Same Year
                  </Buttons>
                  <Buttons size="extra_small" variant="border_primary">
                    Select All Same Major
                  </Buttons>
                </div>
                <div className="flex flex-col gap-4 h-[200px] overflow-y-scroll">
                  {!communityData?.users.length ? (
                    <p className="text-center">No Data!</p>
                  ) : (
                    communityData?.users?.map((user: any) => (
                      <SelectUsers key={user.id} user={user} setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} />
                    ))
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-wrap mt-2">
              {selectedUsers?.length < 9 ? (
                <div className="flex gap-2 flex-wrap">
                  {selectedUsers.map((item: user) => (
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
            {isLoading || isPending ? <Spinner /> : <p>Create Group</p>}
          </button>
          {/* <button
              type="reset"
              onClick={() => (setLogoImage(undefined), setCoverImage(undefined), setSelectedUsers([]))}
              className="bg-[#F3F2FF] py-2 rounded-lg text-[#6647FF]"
            >
              Reset
            </button> */}
        </form>
      </div>
      {/* </div> */}
    </>
  )
}

export default CreateNewGroup
