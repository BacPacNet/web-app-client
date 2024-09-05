import React, { useState } from 'react'
import { FiCamera } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import Modal from '../Timeline/Modal'
import SelectGroupUsers from './SelectUsers'
import { replaceImage } from '@/services/uploadImage'
import { useCreateGroupChat } from '@/services/Messages'

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
const CreateGroup = () => {
  const {
    register: GroupChatRegister,
    handleSubmit: handleGroupChatCreate,
    formState: { errors: GroupChatErrors },
  } = useForm()
  const [coverImage, setCoverImage] = useState()
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const selectedUsersId = selectedUsers.map((item: { _id: string }) => item._id)

  const { mutate: createGroupChat } = useCreateGroupChat()
  const onGroupChatSubmit = async (data: any) => {
    let CoverImageData
    if (coverImage) {
      const imagedata: any = await replaceImage(coverImage, '')
      CoverImageData = { groupLogo: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }
    }
    const dataTopush = {
      groupLogo: CoverImageData?.groupLogo,
      groupName: data.title,
      groupDescription: data.description,
      users: selectedUsersId,
    }
    // console.log('finalData', dataTopush)
    createGroupChat(dataTopush)
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SelectGroupUsers setSelectedUsers={setSelectedUsers} selectedUsers={selectedUsers} />
      </Modal>
      <div className="w-[300px]">
        <div className={` ${!coverImage ? 'bg-slate-200' : ''}  relative shadow-lg flex flex-col w-full items-center justify-center h-44 rounded-lg`}>
          {coverImage && <img className="w-full h-full  absolute  object-cover rounded-lg" src={URL.createObjectURL(coverImage)} alt="" />}
          <input style={{ display: 'none' }} type="file" id="CreateChatGroupLogo" onChange={(e: any) => setCoverImage(e.target.files[0])} />
          <label htmlFor="CreateChatGroupLogo" className="flex flex-col items-center gap-2 z-20 ">
            <FiCamera size={40} className="text-slate-400" />
            <p>Add Group logo</p>
          </label>
        </div>
        <form onSubmit={handleGroupChatCreate(onGroupChatSubmit)} className="w-full flex flex-col gap-6">
          <div className="relative w-full">
            <label htmlFor="name" className="font-semibold">
              Group Name
            </label>
            <input
              {...GroupChatRegister('title', { required: true })}
              placeholder="title"
              className="outline-none border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full"
            />
            {GroupChatErrors.title && <span className="text-red-500 font-normal"> Please enter your Group Name!</span>}
          </div>
          <div className="relative w-full">
            <label htmlFor="Description" className="font-semibold">
              Group Description
            </label>
            <input
              {...GroupChatRegister('description', { required: true })}
              placeholder="description"
              className="outline-none border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full"
            />
            {GroupChatErrors.description && <span className="text-red-500 font-normal"> Please enter your Group description!</span>}
          </div>
          <div className="relative w-full">
            <label htmlFor="inviteFriends" className="font-semibold">
              Invite Friends
            </label>
            <div
              onClick={() => setIsModalOpen(true)}
              className=" border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full h-10 flex gap-2 items-center"
            >
              {selectedUsers.map((item) => (
                <p className="bg-[#6647FF] py-1 px-2 text-xs text-white" key={item._id}>
                  {item.firstName}
                </p>
              ))}
            </div>
          </div>
          <button type="submit" className="bg-[#6647FF] py-2 rounded-lg text-white">
            <p>Create Group</p>
          </button>
        </form>
      </div>
    </>
  )
}

export default CreateGroup
