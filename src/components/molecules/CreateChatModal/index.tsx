'use client'
import Buttons from '@/components/atoms/Buttons'
import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import RadioOption from '@/components/atoms/RadioSelect'
import React, { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import IndividualUsers from './IndividualUsers'
import GroupChatModal from './GroupChatModal'
import { useCreateGroupChat, useCreateUserChat } from '@/services/Messages'
import { useRouter } from 'next/navigation'
import { closeModal } from '../Modal/ModalManager'
import { replaceImage } from '@/services/uploadImage'

interface OneToOneProps {
  setSelectedChat: (value: any) => void
}

const CreateChatModal = ({ setSelectedChat }: OneToOneProps) => {
  const [universityError, setUniversityError] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>()
  const [selectedGroupUser, setSelectedGroupUser] = useState<any>()
  const [filteredUsers, setFilterUsers] = useState<any>([])
  const [filteredFacultyUsers, setFilterFacultyUsers] = useState<any>([])
  const [groupLogoImage, setGroupLogoImage] = useState<File | null>(null)
  const [groupName, setGroupName] = useState('')

  const { mutateAsync: mutateCreateUserChat } = useCreateUserChat()
  const { mutate: createGroupChat } = useCreateGroupChat()
  const router = useRouter()

  const {
    register,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      selectedRadio: '',
    },
  })

  const selectedRadio = watch('selectedRadio')

  const handleIndividualUserClick = async (userId: string) => {
    const createChatResponse: any = await mutateCreateUserChat({ userId: userId })

    setSelectedChat(createChatResponse)
    router.replace(`/messages?id=${createChatResponse._id}`)
    closeModal()
  }

  const handleGroupChatClick = async () => {
    let ImageData
    if (groupLogoImage) {
      const imagedata: any = await replaceImage(groupLogoImage, '')
      ImageData = { groupLogo: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId } }
    }

    const mergedUsers = [selectedGroupUser, ...filteredUsers, ...filteredFacultyUsers]
    const dataTopush = {
      groupLogo: ImageData?.groupLogo,
      groupName: groupName,

      users: mergedUsers,
    }

    createGroupChat(dataTopush)
    closeModal()
  }

  const handleCreateChat = () => {
    if (selectedRadio == 'Individual') {
      handleIndividualUserClick(selectedUser?._id)
    }
    if (selectedRadio == 'Group') {
      handleGroupChatClick()
    }
  }

  const handleClear = () => {
    reset()
    setGroupName('')
    setSelectedGroupUser({})
    setFilterUsers([])
    setFilterFacultyUsers([])

    setUniversityError(false)
  }

  return (
    <div className="max-h-[460px]">
      <div className="w-[400px] ">
        <div className="flex justify-between items-center mb-8">
          <h2 className=" font-bold font-poppins text-md ">Select Chat Type</h2>
          <Buttons onClick={handleClear} variant="shade" size="extra_small" className="w-max">
            Clear
          </Buttons>
        </div>
        <RadioOption
          label="Individual Chat"
          // description="Permission to join required"
          value="Individual"
          register={register}
          name="selectedRadio"
          error={errors.selectedRadio && 'This field is required'}
          checkedValue={selectedRadio}
          fontSize={'large'}
          // isDisabled={selectedUniversity?.name?.length < 1 || selectedUniversity?.name == undefined}
          onAttemptSelect={() => {
            setUniversityError(true)
          }}
          checkedContent={
            <div className="flex flex-col gap-8 mb-4">
              <IndividualUsers setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
            </div>
          }
        />
        <RadioOption
          label="Group Chat"
          // description="Permission to join required"
          value="Group"
          register={register}
          name="selectedRadio"
          error={errors.selectedRadio && 'This field is required'}
          checkedValue={selectedRadio}
          fontSize={'large'}
          // isDisabled={selectedUniversity?.name?.length < 1 || selectedUniversity?.name == undefined}
          onAttemptSelect={() => {
            setUniversityError(true)
          }}
          checkedContent={
            <div className="flex flex-col gap-8 mb-4">
              <GroupChatModal
                setGroupName={setGroupName}
                selectedGroupUser={selectedGroupUser}
                setSelectedGroupUser={setSelectedGroupUser}
                setFilterUsers={setFilterUsers}
                setFilterFacultyUsers={setFilterFacultyUsers}
                // hadleClear={handleClear}
                setGroupLogoImage={setGroupLogoImage}
                groupLogoImage={groupLogoImage}
              />
            </div>
          }
        />
      </div>

      <Buttons onClick={() => handleCreateChat()} variant="primary" className="w-full mt-4 ">
        Start Chat
      </Buttons>

      {selectedRadio == 'Group' ? <div className="mt-4 h-4"></div> : ' '}
    </div>
  )
}

export default CreateChatModal
