'use client'
import React, { useCallback, useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { FiCamera } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import SelectUsers from '../../communityUniversity/SelectUsers'
import { useCreateCommunityGroup, useGetCommunityUsers, useUpdateCommunityGroup } from '@/services/community-university'
import { useParams } from 'next/navigation'
import { replaceImage } from '@/services/uploadImage'
import { Spinner } from '../../spinner/Spinner'
import InputBox from '../../atoms/Input/InputBox'
import { IoClose } from 'react-icons/io5'
import { CommunityGroupType } from '@/types/CommuityGroup'

type Props = {
  communityGroups: CommunityGroupType
  setNewGroup: (value: boolean) => void
}

type media = {
  imageUrl: string
  publicId: string
}
type User = {
  _id: string
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
  const [userPopUp, setUserPopUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const selectedUsersId = selectedUsers.map((item: any) => {
    return { userId: item._id }
  })
  const [searchInput, setSearchInput] = useState('')
  const { mutate: mutateEditGroup, isPending } = useUpdateCommunityGroup()
  const {
    register: GroupRegister,
    handleSubmit: handleGroupCreate,
    formState: { errors: GroupErrors },
    getValues,
  } = useForm({
    defaultValues: {
      title: communityGroups.title,
      description: communityGroups.description,
      communityGroupType: communityGroups.communityGroupType,
      groupType: 'Casual',
      groupCategory: '',
    },
  })

  const values = getValues()
  const { data: allCommunityUsers } = useGetCommunityUsers(communityGroups?.communityId, userPopUp, values.communityGroupType, searchInput)
  const handleSelectAll = useCallback(() => {
    //const allUsers = communityGroups.users
  }, [])

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

    const dataToPush = {
      ...data,
      ...CoverImageData,
      ...logoImageData,
      selectedUsersId,
    }
    mutateEditGroup({ communityId: communityGroups?._id, payload: dataToPush })
    setIsLoading(false)
    setNewGroup(false)
  }

  return (
    <>
      <div onClick={() => setNewGroup(false)} className="fixed w-full h-[100%] top-0 left-0 bg-black backdrop-blur-2xl opacity-50 z-30"></div>
      {userPopUp && (
        <>
          <div className="fixed w-full h-[100%] top-0 left-0 bg-black backdrop-blur-xl opacity-50 z-50"></div>
          <div className="fixed w-[90%] lg:w-[40%]  h-[70%] z-50 left-[50%]  top-[50%] -translate-x-[50%] -translate-y-[50%] bg-white flex flex-col items-center gap-4 shadow-lg px-6 py-4 rounded-lg">
            <div className="flex justify-between w-full">
              <h3>Add Community members</h3>
              <RxCross2 onClick={() => setUserPopUp(false)} size={24} color="#737373" />
            </div>
            {/* search  */}
            <div className="relative w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-400 left-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                type="text"
                placeholder="Search users by name"
                className="w-full pl-12 pr-3 py-1 text-gray-500 bg-transparent outline-none border border-neutral-300 rounded-2xl text-xs"
              />
            </div>
            <button onClick={handleSelectAll} className="self-end bg-slate-200 px-4 py-1 text-xs rounded-xl shadow-sm">
              Select All
            </button>
            {allCommunityUsers?.user?.map((item: any) => (
              <SelectUsers key={item._id} data={item} setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} />
            ))}
          </div>
        </>
      )}
      <div
        className={`fixed w-[90%] lg:w-[40%]  h-[70%] z-40 left-[50%]  top-[50%] -translate-x-[50%] -translate-y-[50%]  bg-white flex flex-col items-center gap-3 px-8 py-4 rounded-lg overflow-y-scroll`}
      >
        {/* <div className="flex justify-end w-full absolute">
          {' '}
          <RxCross2 onClick={() => setNewGroup(false)} size={24} color="#737373" />
        </div> */}
        <div className="flex flex-col gap-4 justify-start items-start w-full">
          <h3 className="text-neutral-700 text-base font-semibold">Create Group</h3>
          <div
            className={` ${
              !coverImage ? 'border-2 border-neutral-200' : ''
            } rounded-md relative  flex flex-col w-full items-center justify-center h-40 `}
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
              <div className={` border-2 border-neutral-200 bg-white flex  items-center justify-center w-24 h-24 rounded-full`}>
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
                {['Academic Focus', 'Recreation and Hobbies', 'Advocacy and Awareness', 'Personal Growth', 'Professional Development', 'Others'].map(
                  (category) => (
                    <label key={category} className="flex items-center gap-3">
                      <input
                        type="radio"
                        value={category.toLowerCase().replace(/ /g, '-')}
                        {...GroupRegister('groupCategory', { required: true })}
                        className="w-5 h-5"
                      />
                      <span className="text-neutral-900 text-[12px] font-medium">{category}</span>
                    </label>
                  )
                )}
              </div>
              {GroupErrors.groupCategory && <p className="text-red-500 text-2xs ">This field is required</p>}
            </div>
            <div className="relative w-full flex flex-col">
              <label htmlFor="inviteFriends" className="font-medium text-xs">
                Add Members
              </label>
              <div
                onClick={() => (setUserPopUp(true), values)}
                className=" border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full h-10 flex gap-2 items-center"
              ></div>
              <div className="flex flex-wrap mt-2">
                {' '}
                {selectedUsers.map((item: any) => (
                  <div
                    key={item._id}
                    className="bg-[#F3F2FF] py-[2px] px-[6px] text-[10px] text-primary-500 rounded-3xl h-5 flex items-center justify-center"
                  >
                    <p key={item.id}>{item.firstName}</p>
                    <button type="button" onClick={() => setSelectedUsers(selectedUsers.filter((currItem) => currItem._id !== item._id))}>
                      <IoClose className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="bg-[#6647FF] py-2 rounded-lg text-white w-3/4 mx-auto">
              {isLoading || isPending ? <Spinner /> : <p>Update Changes</p>}
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
      </div>
    </>
  )
}

export default EditCommunityGroupModal
