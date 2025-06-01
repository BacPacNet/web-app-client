'use client'
import Buttons from '@/components/atoms/Buttons'
import RadioOption from '@/components/atoms/RadioSelect'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import IndividualUsers from './IndividualUsers'
import GroupChatModal from './GroupChatModal'
import { useCreateGroupChat, useCreateUserChat } from '@/services/Messages'
import { useRouter } from 'next/navigation'
import { useUploadToS3 } from '@/services/upload'
import { UPLOAD_CONTEXT } from '@/types/Uploads'
import { useModal } from '@/context/ModalContext'

interface OneToOneProps {
  setSelectedChat: (value: any) => void
}

const CreateChatModal = ({ setSelectedChat }: OneToOneProps) => {
  const [universityError, setUniversityError] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>()
  const [selectedIndividualsUsers, setSelectedIndividualsUsers] = useState<any[]>([])
  const [filteredUsers, setFilterUsers] = useState<any[]>([])
  const [filteredFacultyUsers, setFilterFacultyUsers] = useState<any[]>([])
  const [groupLogoImage, setGroupLogoImage] = useState<File | null>(null)
  const [groupName, setGroupName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { mutateAsync: mutateCreateUserChat, isPending: userChatPending } = useCreateUserChat()
  const { mutate: createGroupChat, isPending: groupChatPending } = useCreateGroupChat()
  const { mutateAsync: uploadToS3 } = useUploadToS3()
  const router = useRouter()
  const { closeModal } = useModal()

  const {
    register,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      selectedRadio: '',
      community: { name: '', id: '' },
    },
  })

  const selectedRadio = watch('selectedRadio')
  const community = watch('community')

  const handleIndividualUserClick = async (userId: string) => {
    const createChatResponse: any = await mutateCreateUserChat({ userId: userId })
    setSelectedChat(createChatResponse)
    router.replace(`/messages?id=${createChatResponse._id}`)
    setIsLoading(false)
    closeModal()
  }

  const handleGroupChatClick = async () => {
    let ImageData
    if (groupLogoImage) {
      const uploadPayload = {
        files: [groupLogoImage],
        context: UPLOAD_CONTEXT.GROUP_DP,
      }
      const imagedata = await uploadToS3(uploadPayload)
      ImageData = { groupLogo: { imageUrl: imagedata.data[0]?.imageUrl, publicId: imagedata.data[0]?.publicId } }
    }

    const mergedUsers = [
      ...selectedIndividualsUsers.map((user) => user._id),
      ...filteredUsers.map((user) => user._id),
      ...filteredFacultyUsers.map((user) => user._id),
    ]
    const dataTopush = {
      groupLogo: ImageData?.groupLogo,
      groupName: groupName,
      users: mergedUsers,
      community,
    }

    createGroupChat(dataTopush)
    setIsLoading(false)
    closeModal()
  }

  const handleCreateChat = (e: React.MouseEvent) => {
    setIsLoading(true)
    e.stopPropagation()
    if (selectedRadio == 'Individual') {
      if (!selectedUser?._id) return
      handleIndividualUserClick(selectedUser?._id)
    }
    if (selectedRadio == 'Group') {
      if (!groupName) return
      handleGroupChatClick()
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent click from bubbling up
    reset()
    setGroupName('')
    setFilterUsers([])
    setFilterFacultyUsers([])
    setUniversityError(false)
  }

  return (
    <form className="max-h-[70vh]">
      <div className="w-[300px] sm:w-[500px]">
        <div className="flex justify-between items-center mb-8">
          <h2 className=" font-bold font-poppins text-md ">Select Chat Type</h2>
          <Buttons type="button" onClick={handleClear} variant="shade" size="small" className="w-max">
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
                individualsUsers={selectedIndividualsUsers}
                setIndividualsUsers={setSelectedIndividualsUsers}
                setFilterUsers={setFilterUsers}
                setFilterFacultyUsers={setFilterFacultyUsers}
                // hadleClear={handleClear}
                setGroupLogoImage={setGroupLogoImage}
                groupLogoImage={groupLogoImage}
                setValueGroup={setValue}
                communitySelected={community}
              />
            </div>
          }
        />
      </div>

      <Buttons
        type="button"
        disabled={groupChatPending || userChatPending || !selectedRadio || isLoading}
        onClick={handleCreateChat}
        variant="primary"
        className="w-full mt-4 "
        size="large"
      >
        Start Chat
      </Buttons>

      {selectedRadio == 'Group' ? <div className="mt-4 h-4"></div> : ' '}
    </form>
  )
}

export default CreateChatModal
