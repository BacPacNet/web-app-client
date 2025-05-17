'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { FiCamera } from 'react-icons/fi'
import InputBox from '@/components/atoms/Input/InputBox'
import { useEditGroupChat } from '@/services/Messages'
import Image from 'next/image'
import avatar from '@assets/avatar.svg'
import { closeModal } from '../Modal/ModalManager'
import Buttons from '@/components/atoms/Buttons'
import { Spinner } from '@/components/spinner/Spinner'
import { useUsersProfileForConnections } from '@/services/user'
import { useForm } from 'react-hook-form'
import { useUniStore } from '@/store/store'
import SelectedUserTags from '@/components/atoms/SelectedUserTags'
import { Users } from '@/types/Connections'
import UserList from '@/components/atoms/UserList'
import { ChatUser } from '@/types/constants'
import { useUploadToS3 } from '@/services/upload'
import { UPLOAD_CONTEXT } from '@/types/Uploads'

const EditGroupChatModal = ({
  users,
  chatId,
  groupLogo,
  groupCurrentName,
}: {
  users: ChatUser[]
  chatId: string
  groupLogo: string
  groupCurrentName: string
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [searchInput, setSearchInput] = useState('')
  const { userProfileData } = useUniStore()

  const {
    data,
    //fetchNextPage,
    //isFetchingNextPage,
    //hasNextPage,
    //isLoading: isUserProfilesLoading,
  } = useUsersProfileForConnections(searchInput, 10, true)

  // Inside your component
  const filteredUserProfiles = useMemo(() => {
    // 1. Flatten and filter user profiles (exclude current user)
    const userProfiles = data?.pages.flatMap((page) => page.users).filter((user) => user._id !== userProfileData?.users_id) || []

    // 2. Create Set of userIds for O(1) lookups
    const userIdsSet = new Set(users.map((user) => user.userId._id))

    // 3. Filter profiles that exist in the Set
    return userProfiles.filter((profile) => !userIdsSet.has(profile._id))
  }, [data?.pages, userProfileData?.users_id, users])

  const [showDropdown, setShowDropdown] = useState(false)

  const [groupLogoImage, setGroupLogoImage] = useState<File | null>(null)
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false)

  const [showSelectUsers, setShowSelectUsers] = useState<boolean>(true)
  const { mutateAsync: editGroup, isPending } = useEditGroupChat(chatId)
  const { mutateAsync: uploadtoS3 } = useUploadToS3()
  const {
    register,
    watch,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      groupLogo: groupLogo,
      title: groupCurrentName || '',
      selectedIndividualsUsers: [],
    },
  })

  const SelectedIndividualsUsers = watch('selectedIndividualsUsers')
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (showDropdown) inputRef.current?.focus()
  }, [showDropdown])

  const onSubmit = async (formData: any) => {
    const paylod: any = {
      //...(ImageData?.groupLogo && { groupLogo: ImageData.groupLogo }),
      groupName: formData.title,
      users: formData.selectedIndividualsUsers.map((user: any) => user._id),
    }

    if (groupLogoImage) {
      setIsImageLoading(true)
      const uploadPayload = {
        files: [groupLogoImage],
        context: UPLOAD_CONTEXT.DP,
      }
      const imagedata = await uploadtoS3(uploadPayload)
      if (imagedata.success) {
        paylod.groupLogo = imagedata.data
      }
    }

    await editGroup(paylod)
    setIsImageLoading(false)
    closeModal()
  }

  const removeUser = (userId: string) => {
    const currentSelected = watch('selectedIndividualsUsers') as Users[]
    setValue('selectedIndividualsUsers', currentSelected.filter((u) => u._id !== userId) as any)
  }

  const handleSelectIndividuals = (e: React.MouseEvent, user: Users) => {
    e.preventDefault()
    e.stopPropagation()
    setShowSelectUsers(false)

    const currentSelected = watch('selectedIndividualsUsers') as Users[]

    const isAlreadySelected = currentSelected.some((u) => u._id === user._id)

    if (!isAlreadySelected) {
      setValue('selectedIndividualsUsers', [...currentSelected, user] as any)
    }
  }

  return (
    <div className="relative w-full h-[400px] flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-medium text-sm text-neutral-900">
          Edit Profile
        </label>
        <div className={` border-2 border-neutral-200 bg-white flex  items-center justify-center w-[100px] h-[100px] rounded-full`}>
          {groupLogoImage && !groupLogo?.length ? (
            <Image
              width={96}
              height={96}
              className="w-24 h-24 rounded-full absolute  object-cover"
              src={URL.createObjectURL(groupLogoImage)}
              alt=""
            />
          ) : (
            ''
          )}
          {!groupLogoImage && groupLogo?.length ? (
            <Image width={96} height={96} className="w-24 h-24 rounded-full absolute  object-cover" src={groupLogo} alt="" />
          ) : (
            ''
          )}
          {groupLogoImage && groupLogo?.length ? (
            <Image
              width={96}
              height={96}
              className="w-24 h-24 rounded-full absolute  object-cover"
              src={URL.createObjectURL(groupLogoImage)}
              alt=""
            />
          ) : (
            ''
          )}
          <input
            style={{ display: 'none' }}
            accept="image/jpeg,image/png,image/jpg"
            type="file"
            id="CreateGroupLogoImage"
            onChange={(e: any) => setGroupLogoImage(e.target.files[0])}
          />

          {groupLogoImage ? (
            <label htmlFor="CreateGroupLogoImage" className="relative flex flex-col items-center gap-2 z-10  ">
              <div className="w-12 h-12 rounded-full bg-black opacity-50 absolute -z-10 top-1/2 -translate-y-1/2"></div>
              <FiCamera size={32} className="text-white" />
            </label>
          ) : (
            <label htmlFor="CreateGroupLogoImage" className="flex flex-col items-center gap-2">
              <FiCamera size={32} className="text-slate-400 z-30" />
            </label>
          )}
        </div>
      </div>
      {/* //name  */}
      <div className="flex gap-4 items-center justify-between">
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="name" className="font-medium text-sm text-neutral-900">
            Group Name
          </label>
          <InputBox
            className="text-xs"
            placeholder="Enter Group Name "
            type="title"
            {...register('title', {
              required: true,
            })}
          />

          {errors.title && <span className="text-red-500 text-2xs font-normal text-"> This field is required</span>}
        </div>
      </div>
      {/* start  */}
      <div className="relative w-full flex flex-col">
        <label htmlFor="inviteFriends" className="font-medium text-sm text-neutral-900 mb-2">
          Add Members
        </label>
        <div>
          <InputBox
            isCancel={true}
            onCancel={() => setShowSelectUsers(false)}
            onClick={() => setShowSelectUsers(true)}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search Users"
          />

          {showSelectUsers && (
            <div ref={dropdownRef} className="w-full mt-2 rounded-lg border-[1px] border-neutral-200 bg-white max-h-72 overflow-y-auto">
              <UserList users={filteredUserProfiles} onUserClick={handleSelectIndividuals} fallbackImage={avatar} />
            </div>
          )}

          <div className="flex flex-wrap mt-2">
            <SelectedUserTags users={SelectedIndividualsUsers} onRemove={(id) => removeUser(id as string)} />
          </div>
        </div>
      </div>

      <Buttons disabled={isPending} onClick={handleSubmit(onSubmit)} className="w-[500px] my-4 fixed bottom-0">
        {isPending || isImageLoading ? <Spinner /> : 'Apply Changes'}
      </Buttons>

      {/*<div className=" min-h-[10px] w-4"></div>*/}
    </div>
  )
}

export default EditGroupChatModal
