'use client'
import InputBox from '@/components/atoms/Input/InputBox'
import SelectUsers from '@/components/communityUniversity/SelectUsers'
import { useCreateGroupChat, useGetUserFollowingAndFollowers } from '@/services/Messages'
import { replaceImage } from '@/services/uploadImage'
import Image from 'next/image'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiCamera } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { MdPersonAddAlt1 } from 'react-icons/md'
import { RxCross2 } from 'react-icons/rx'
import avatar from '@assets/avatar.svg'
import { FaUser } from 'react-icons/fa'
type Props = {
  setShowCreateGroup: (value: boolean) => void
  setShowOneToOne: (value: boolean) => void
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
const CreateGroupChat = ({ setShowCreateGroup, setShowOneToOne }: Props) => {
  const {
    control,
    handleSubmit,
    getValues,
    register: GroupChatRegister,
    formState: { errors: GroupChatRegisterErr },
  } = useForm({
    defaultValues: {
      inviteOption: 'public',
      title: '',
      description: '',
    },
  })

  const [userPopUp, setUserPopUp] = useState(false)
  const [groupLogoImage, setGroupLogoImage] = useState()
  const [searchInput, setSearchInput] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const selectedUsersId = selectedUsers.map((item: any) => item._id)
  const values = getValues()

  const { mutate: createGroupChat } = useCreateGroupChat()

  const onGroupChatSubmit = async (data: any) => {
    let CoverImageData
    if (groupLogoImage) {
      const imagedata: any = await replaceImage(groupLogoImage, '')
      CoverImageData = { groupLogo: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }
    }
    const dataTopush = {
      groupLogo: CoverImageData?.groupLogo,
      groupName: data.title,
      groupDescription: data.description,
      users: selectedUsersId,
    }

    createGroupChat(dataTopush)
  }

  const { data } = useGetUserFollowingAndFollowers(searchInput)
  return (
    <>
      <div
        onClick={() => setShowCreateGroup(false)}
        className="fixed    w-full  h-full  top-0 left-0 bg-[#f3f2ff] backdrop-blur-2xl  opacity-50 z-30 "
      ></div>

      {userPopUp && (
        <>
          <div className="fixed   w-full h-screen top-0 left-0 bg-[#f3f2ff] backdrop-blur-xl opacity-50 z-30"></div>

          <div className="fixed w-1/2 max-sm:w-11/12 z-50 min-h-[400px]   top-[10%] left-1/3 bg-white flex flex-col items-center gap-6 shadow-lg px-10 py-6 rounded-lg">
            <div className="flex justify-between w-full">
              <h3>Add Group Members</h3>
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
              <SelectUsers key={item._id} user={item} setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} />
            ))}
          </div>
        </>
      )}

      <div className="fixed w-2/5 max-sm:w-11/12 z-40   top-[10%] left-1/3 bg-white flex flex-col items-center gap-6 shadow-lg px-6 pt-6 pb-10 rounded-lg">
        <div className="flex justify-between w-full">
          <h3 className="text-neutral-700 font-semibold text-[18px] font-inter">Create Chat Group</h3>
        </div>
        <form onSubmit={handleSubmit(onGroupChatSubmit)} className="w-full flex flex-col gap-6 relative">
          <div className="flex gap-2 items-center justify-between ">
            <div className={` border-2 border-neutral-200 bg-white flex  items-center justify-center w-24 h-24 rounded-full`}>
              {groupLogoImage && (
                <Image
                  width={40}
                  height={40}
                  className="w-24 h-24 rounded-full absolute  object-cover"
                  src={URL.createObjectURL(groupLogoImage)}
                  alt="groupLogo"
                />
              )}
              <input style={{ display: 'none' }} type="file" id="CreateGroupLogoImage" onChange={(e: any) => setGroupLogoImage(e.target.files[0])} />
              <label htmlFor="CreateGroupLogoImage" className="flex flex-col items-center gap-2">
                <FiCamera size={40} className="text-slate-400 z-30" />
              </label>
            </div>
            <div className="relative w-8/12 flex flex-col">
              <label htmlFor="name" className="font-medium text-xs">
                Group Name
              </label>
              <InputBox
                placeholder="title "
                type="title"
                {...GroupChatRegister('title', {
                  required: true,
                })}
              />

              {GroupChatRegisterErr.title && <span className="text-red-500 font-normal"> Please enter your Group Name!</span>}
            </div>
          </div>
          <div className="relative w-full flex flex-col">
            <label htmlFor="name" className="font-medium text-xs">
              Group Description
            </label>
            <InputBox
              placeholder="description "
              type="description"
              {...GroupChatRegister('description', {
                required: true,
              })}
            />

            {GroupChatRegisterErr.description && <span className="text-red-500 font-normal"> Please enter your Group Name!</span>}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Controller
              name="inviteOption"
              control={control}
              render={({ field }) => (
                <>
                  <label className="flex items-center gap-3">
                    <input type="radio" {...field} value="public" checked={field.value === 'public'} className="w-[18px] h-[18px]" />
                    <p className="text-neutral-900 text-[12px] font-medium">Allow others to invite to the chat</p>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="radio" {...field} value="private" checked={field.value === 'private'} className="w-[18px] h-[18px]" />
                    <p className="text-neutral-900 text-[12px] font-medium">Only you can invite to the chat</p>
                  </label>
                </>
              )}
            />
          </div>
          <div className="relative w-full flex flex-col">
            <label htmlFor="inviteFriends" className="font-medium text-xs">
              Add Members
            </label>
            <div
              onClick={() => setUserPopUp(true)}
              className=" border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full h-10 flex gap-2 items-center justify-end pe-4 drop-shadow-sm"
            >
              {' '}
              <MdPersonAddAlt1 className="text-primary-500" />
            </div>
            <div className="flex flex-wrap mt-2">
              {' '}
              {selectedUsers.map((item: any) => (
                <div
                  key={item._id}
                  className="bg-[#F3F2FF] py-[2px] px-[6px] text-[10px] text-primary-500 rounded-3xl h-5 flex items-center justify-center"
                >
                  <p key={item.id}>{item.firstName}</p>
                  <button type="button" onClick={() => setSelectedUsers(selectedUsers.filter((currItem) => currItem !== item._id))}>
                    <IoClose className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="w-64 mx-auto bg-primary-500 text-white px-4 py-2 rounded-lg">
            Create New Chat
          </button>
          <p
            className=" absolute -bottom-8 -left-4 cursor-pointer text-sm text-primary-500 bg-neutral-300 p-2 rounded-full"
            onClick={() => {
              setShowCreateGroup(false), setShowOneToOne(true)
            }}
          >
            <FaUser />
          </p>
        </form>
      </div>
    </>
  )
}

export default CreateGroupChat
