'use client'
import InputBox from '@/components/atoms/Input/InputBox'

import { useCreateGroupChat, useGetUserFollowingAndFollowers } from '@/services/Messages'
import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiCamera } from 'react-icons/fi'

import { MdPersonAddAlt1 } from 'react-icons/md'

import { FaUser } from 'react-icons/fa'
import GroupSelectUsers from '@/components/atoms/GroupChatSelectUsers'
import Buttons from '@/components/atoms/Buttons'
import { IoClose } from 'react-icons/io5'
import { openModal } from '../Modal/ModalManager'
import OneToChat from '../OneToOneChat'
import { useUploadToS3 } from '@/services/upload'
import { UPLOAD_CONTEXT } from '@/types/Uploads'

type user = {
  _id: string
  profileImageUrl: string
  firstName: string
  year: string
  degree: string
  major: string
}

type Props = {
  setSelectedChat: (value: any) => void
}

const CreateGroupChat = ({ setSelectedChat }: Props) => {
  const {
    control,
    handleSubmit,
    register: GroupChatRegister,
    formState: { errors: GroupChatRegisterErr },
  } = useForm({
    defaultValues: {
      inviteOption: 'public',
      title: '',
      description: '',
    },
  })

  const [groupLogoImage, setGroupLogoImage] = useState()
  const [selectedUsers, setSelectedUsers] = useState<user[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [showUsers, setShowUsers] = useState(false)
  const { data } = useGetUserFollowingAndFollowers(searchInput)

  const { mutate: createGroupChat } = useCreateGroupChat()
  const { mutateAsync: uploadToS3 } = useUploadToS3()

  const handleShowModal = () => {
    openModal(<OneToChat setSelectedChat={setSelectedChat} />)
  }

  const handleSelectAll = useCallback(() => {
    const getAllusers = data?.user?.map((user: any) => user)
    setSelectedUsers(getAllusers)
  }, [])

  const handleClick = (userId: string) => {
    if (selectedUsers?.some((selectedUser) => selectedUser._id == userId)) {
      const filterd = selectedUsers.filter((selectedUser) => selectedUser._id !== userId)
      setSelectedUsers(filterd)
    }
  }

  const onGroupChatSubmit = async (data: any) => {
    let CoverImageData
    if (groupLogoImage) {
      const uploadPayload = {
        files: [groupLogoImage],
        context: UPLOAD_CONTEXT.MESSAGE,
      }
      const imagedata = await uploadToS3(uploadPayload)
      CoverImageData = { groupLogo: { imageUrl: imagedata?.data[0].imageUrl, publicId: imagedata?.data[0]?.publicId } }
    }
    const selectedUsersIds = selectedUsers.map((item: { _id: string }) => item._id)
    const dataTopush = {
      groupLogo: CoverImageData?.groupLogo,
      groupName: data.title,
      groupDescription: data.description,
      users: selectedUsersIds,
    }

    createGroupChat(dataTopush)
  }

  return (
    <>
      <div className="">
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
              <input
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/jpg"
                type="file"
                id="CreateGroupLogoImage"
                onChange={(e: any) => setGroupLogoImage(e.target.files[0])}
              />
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
              onClick={() => {
                setShowUsers(!showUsers)
              }}
              className=" border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full h-10 flex gap-2 items-center justify-end pe-4 drop-shadow-sm"
            >
              {' '}
              <MdPersonAddAlt1 className="text-primary-500" />
            </div>
            {showUsers && (
              <div className="flex flex-col gap-4  mt-4">
                <Buttons type="button" onClick={handleSelectAll} size="extra_small" variant="border_primary" className="w-max">
                  Select All Users
                </Buttons>
                <div className="flex flex-col gap-4 h-[200px] overflow-y-scroll">
                  {data?.user?.map((user: any) => (
                    <GroupSelectUsers key={user.id} user={user} setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} />
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-wrap mt-2">
              {selectedUsers?.length < 9 ? (
                <div className="flex gap-2 flex-wrap">
                  {selectedUsers.map((item: user) => (
                    <div key={item._id} className="bg-secondary py-[2px] px-[6px] text-xs text-primary-500 rounded-sm h-5 flex items-center gap-2">
                      {item?.firstName}{' '}
                      <span onClick={() => handleClick(item._id)} className="cursor-pointer text-sm">
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
          <button type="submit" className="w-64 mx-auto bg-primary-500 text-white px-4 py-2 rounded-lg">
            Create New Chat
          </button>
          <p
            className=" absolute -bottom-8 -left-4 cursor-pointer text-sm text-primary-500 bg-neutral-300 p-2 rounded-full"
            onClick={() => handleShowModal()}
          >
            <FaUser />
          </p>
        </form>
      </div>
    </>
  )
}

export default CreateGroupChat
