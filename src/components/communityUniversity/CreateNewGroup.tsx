'use client'
import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { FiCamera } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import SelectUsers from './SelectUsers'
import { useCreateCommunityGroup, useGetCommunityUsers } from '@/services/community-university'
import { useParams } from 'next/navigation'
import { replaceImage } from '@/services/uploadImage'
import { Spinner } from '../spinner/Spinner'
import InputBox from '../atoms/Input/InputBox'
type Props = {
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
const CreateNewGroup = ({ setNewGroup }: Props) => {
  const { id } = useParams<{ id: string }>()
  const [logoImage, setLogoImage] = useState()
  const [coverImage, setCoverImage] = useState()
  const [userPopUp, setUserPopUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const selectedUsersId = selectedUsers.map((item: any) => item._id)
  const [searchInput, setSearchInput] = useState('')
  const { mutate: createGroup, isPending } = useCreateCommunityGroup()
  const {
    register: GroupRegister,
    handleSubmit: handleGroupCreate,
    formState: { errors: GroupErrors },
    getValues,
  } = useForm()
  const values = getValues()
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
    createGroup({ communityId: id[0], data: dataToPush })
    setIsLoading(false)
  }

  const { data } = useGetCommunityUsers(id[0], userPopUp, values.communityGroupType, searchInput)

  return (
    <>
      <div className="fixed   w-full h-[100%] top-0 left-0 bg-black opacity-50 z-10"></div>
      {userPopUp && (
        <>
          <div className="fixed   w-full h-[100%] top-0 left-0 bg-black opacity-50 z-50"></div>
          <div className="fixed w-1/3 max-sm:w-11/12 z-50 h-3/4   top-[10%] left-1/3 bg-white flex flex-col items-center gap-6 shadow-lg px-10 py-6 rounded-lg">
            <div className="flex justify-between w-full">
              <h3>Add Community members</h3>
              <RxCross2 onClick={() => setUserPopUp(false)} size={24} color="#737373" />
            </div>
            {/* search  */}
            <div className="relative w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
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
                className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border border-neutral-300  rounded-2xl"
              />
            </div>
            <button onClick={() => setSelectedUsers(data?.user)} className="self-end bg-slate-200 p-2 text-xs rounded-xl shadow-sm">
              Select All
            </button>
            {data?.user?.map((item: any) => (
              <SelectUsers key={item._id} data={item} setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} />
            ))}
          </div>
        </>
      )}
      <div className={`fixed w-1/3 max-sm:w-11/12 z-40 left-1/3  top-10  bg-white flex flex-col items-center gap-3 shadow-lg px-10 py-2 rounded-lg`}>
        <div className="flex justify-end w-full absolute">
          {' '}
          <RxCross2 onClick={() => setNewGroup(false)} size={24} color="#737373" />
        </div>
        <div className="flex flex-col gap-2 justify-start items-start w-full">
          <h3>Create Group</h3>
          <div className={` ${!coverImage ? 'bg-slate-200' : ''}  relative shadow-lg flex flex-col w-full items-center justify-center h-40 `}>
            {coverImage && <img className="w-full h-full  absolute -z-10 object-cover rounded-lg" src={URL.createObjectURL(coverImage)} alt="" />}
            <input style={{ display: 'none' }} type="file" id="CreateGroupImage" onChange={(e: any) => setCoverImage(e.target.files[0])} />
            <label htmlFor="CreateGroupImage" className="flex flex-col items-center gap-2">
              <FiCamera size={40} className="text-slate-400" />
              <p>Add Banner Photo</p>
            </label>
          </div>
          {/* log0 */}
          <div className={` absolute  shadow-lg bg-white flex  items-center justify-center w-20 h-20 rounded-full top-28`}>
            {logoImage && <img className="w-full h-full rounded-full absolute  object-cover" src={URL.createObjectURL(logoImage)} alt="" />}
            <input style={{ display: 'none' }} type="file" id="CreateGroupLogoImage" onChange={(e: any) => setLogoImage(e.target.files[0])} />
            <label htmlFor="CreateGroupLogoImage" className="flex flex-col items-center gap-2">
              <FiCamera size={40} className="text-slate-400 z-30" />
            </label>
          </div>
          {/* Forms  */}
          <form onSubmit={handleGroupCreate(onGroupSubmit)} className="w-full flex flex-col gap-3">
            <div className="relative w-full flex flex-col">
              <label htmlFor="name" className="font-semibold">
                Group Name
              </label>
              <InputBox
                placeholder="title "
                type="title"
                {...GroupRegister('title', {
                  required: true,
                })}
              />

              {GroupErrors.title && <span className="text-red-500 font-normal"> Please enter your Group Name!</span>}
            </div>
            <div className="relative w-full flex flex-col">
              <label htmlFor="description" className="font-semibold">
                Description
              </label>
              <InputBox
                placeholder="description "
                type="description"
                {...GroupRegister('description', {
                  required: true,
                })}
              />

              {GroupErrors.description && <span className="text-red-500 font-normal"> Please enter your Group description!</span>}
            </div>
            <div className="relative w-full flex flex-col">
              <label htmlFor="privacy" className="font-semibold">
                Choose Privacy
              </label>

              <select
                defaultValue={'Public'}
                className="py-2 px-3 border focus:ring-2 rounded-lg drop-shadow-sm  text-neutral-900 placeholder:text-neutral-400 h-10 outline-none border-neutral-200"
                {...GroupRegister('communityGroupType', { required: true })}
              >
                {/* <option value="" disabled selected></option> */}
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              {GroupErrors.privacy && <span className="text-red-500 font-normal">Please choose a privacy option!</span>}
            </div>
            <div className="relative w-full flex flex-col">
              <label htmlFor="inviteFriends" className="font-semibold">
                Invite Friends
              </label>
              <div
                onClick={() => (setUserPopUp(true), values)}
                className=" border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full h-10 flex gap-2 items-center"
              >
                {selectedUsers.map((item: any) => (
                  <p className="bg-[#6647FF] py-1 px-2 text-xs text-white" key={item.id}>
                    {item.firstName}
                  </p>
                ))}
              </div>
            </div>
            <button type="submit" className="bg-[#6647FF] py-2 rounded-lg text-white">
              {isLoading || isPending ? <Spinner /> : <p>Create Group</p>}
            </button>
            <button
              type="reset"
              onClick={() => (setLogoImage(undefined), setCoverImage(undefined), setSelectedUsers([]))}
              className="bg-[#F3F2FF] py-2 rounded-lg text-[#6647FF]"
            >
              Reset
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateNewGroup
