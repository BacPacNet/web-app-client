/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { RiGraduationCapFill } from 'react-icons/ri'
import { HiLibrary } from 'react-icons/hi'
import { FaLocationDot } from 'react-icons/fa6'
import { MdEmail, MdPhone } from 'react-icons/md'
import { FaBirthdayCake } from 'react-icons/fa'
import { HiPencilAlt } from 'react-icons/hi'
// import coverImage from '../../../public/timeline/cover.png'
import { ModalContentType } from '@/types/global'
import { userType } from '@/store/userSlice/userType'
import { cn } from '@/lib/utils'
import { userProfileType } from '@/store/userProfileSlice/userProfileType'
import { replaceImage } from '@/services/uploadImage'
import { useEditProfile } from '@/services/edit-profile'
interface ProfileProps {
  following: number
  followers: number
  setModalContentType: React.Dispatch<React.SetStateAction<ModalContentType>>
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isUserProfile?: boolean
  userData: userType
  userProfileData: userProfileType
}

const ProfileCard: React.FC<ProfileProps> = ({
  following,
  followers,
  setIsModalOpen,
  setModalContentType,
  userData,
  userProfileData,
  isUserProfile,
}) => {
  const { mutate: mutateEditProfile } = useEditProfile()

  const handleImageUpload = async (e: any) => {
    const files = e.target.files
    if (files && files[0]) {
      const data: any = await replaceImage(files[0], userProfileData?.profile_dp?.publicId)

      const dataToPush = { profile_dp: { imageUrl: data?.imageUrl, publicId: data?.publicId } }

      mutateEditProfile(dataToPush)
    } else {
      console.error('No file selected.')
    }
  }

  const handleCoverImageUpload = async (e: any) => {
    const files = e.target.files
    if (files && files[0]) {
      const data: any = await replaceImage(files[0], userProfileData?.cover_dp?.publicId)

      const dataToPush = { cover_dp: { imageUrl: data?.imageUrl, publicId: data?.publicId } }

      mutateEditProfile(dataToPush)
    } else {
      console.error('No file selected.')
    }
  }

  const ProfileItem = ({
    iconName,
    text,
    size,
    textClassName,
    field,
  }: {
    iconName: React.ComponentType<{ size: number; color: string }>
    text: string | undefined
    size?: number
    textClassName?: string
    field?: string
  }) => {
    const iconSize = size ? size : 22
    const error = text === undefined || text.includes('undefined') || text.includes('null') || text.includes('NaN')
    return (
      <div className="flex flex-row gap-3 items-center">
        {React.createElement(iconName, { size: iconSize, color: '#404040' })}
        {!error ? (
          <p className={cn('text-gray-600 text-xs font-medium break-words', textClassName)}>{text}</p>
        ) : (
          <p
            className={cn('text-slate-400 text-xs font-medium break-words cursor-pointer', textClassName)}
            onClick={() => {
              setModalContentType('EditProfileModal')
              setIsModalOpen(true)
            }}
          >
            {field ? `Add your ${field}` : 'Add to Profile'}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="relative sm:max-w-md lg:max-w-[280px] bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-dark min-w-[300px]">
      {/* if no data then show  */}
      {!userData?.email?.length && (
        <>
          <div className="absolute z-20 -top-72 left-0 w-full h-[150%] backdrop-blur-lg "></div>
          <button
            onClick={() => {
              setModalContentType('EditProfileModal')
              setIsModalOpen(true)
            }}
            className="absolute bg-primary py-2 px-3 rounded-xl text-white text-sm  font-normal mt-10 mx-[25%] z-40 "
          >
            Complete Your Profile
          </button>
        </>
      )}

      <div className="relative lg:max-w-xs w-full">
        {/* Cover Image */}
        {userProfileData?.cover_dp?.imageUrl ? (
          <div
            className="relative h-28 bg-cover bg-center group"
            style={{ backgroundImage: `url(${userProfileData?.cover_dp?.imageUrl})`, objectFit: 'cover' }}
          >
            <div className="group-hover:block hidden absolute top-1/4 left-1/2">
              <input style={{ display: 'none' }} type="file" id="file" onChange={(e) => handleCoverImageUpload(e)} />
              <label htmlFor="file">
                <p className="">Upload</p>
              </label>
            </div>
          </div>
        ) : (
          <div className="relative h-28 bg-cover bg-center bg-primary-50 group">
            <div className="group-hover:block hover:block hidden absolute top-1/4 left-[40%] border border-primary py-1 px-2 rounded-full text-primary font-medium cursor-pointer">
              <input style={{ display: 'none' }} type="file" id="file" onChange={(e) => handleCoverImageUpload(e)} />
              <label htmlFor="file">
                <p className="cursor-pointer">Upload</p>
              </label>
            </div>
          </div>
        )}
        {/* Profile Picture and Edit Profile Button */}
        <div className="absolute top-14 flex items-end pb-4 pl-4 w-full">
          <div className="flex">
            <div className="group relative">
              <img
                src={`${userProfileData?.profile_dp?.imageUrl ? userProfileData.profile_dp.imageUrl : '/icons/avatar.svg'} `}
                alt="Profile"
                className="h-24 w-24 rounded-full border-4 border-white"
                width={24}
                height={24}
              />
              <div className="group-hover:block hidden absolute top-1/3 left-[15%] bg-primary-50 py-1 px-2 rounded-full text-primary font-medium cursor-pointer">
                <input style={{ display: 'none' }} type="file" id="file2" onChange={(e) => handleImageUpload(e)} />
                <label htmlFor="file2">
                  <p className="cursor-pointer">Upload</p>
                </label>
              </div>
            </div>
            <div
              className="flex justify-end absolute bottom-8 right-8 gap-2 items-center cursor-pointer"
              onClick={() => {
                setModalContentType('EditProfileModal')
                setIsModalOpen(true)
              }}
            >
              <button className="text-xs text-primary">Edit Profile</button>
              <HiPencilAlt size={16} color="#737373" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 mt-8 py-5">
        <h2 className="text-lg font-semibold">{userData.firstName}</h2>
        <p className="text-gray-dark text-xs py-1">{userProfileData?.bio}</p>
        {!isUserProfile && <button className="w-full bg-primary text-white py-2 mt-2 rounded-lg text-xs font-medium">Create Avatar</button>}
        <div className="mt-5 flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-x-6 lg:flex">
          <ProfileItem
            iconName={RiGraduationCapFill}
            text={userProfileData?.study_year + ' Year' + ', ' + userProfileData?.degree + ', ' + userProfileData?.major}
            field="Education"
          />
          <ProfileItem iconName={HiLibrary} text={'Department of ' + userProfileData?.major} field="Department" />
          <ProfileItem iconName={FaLocationDot} text={userProfileData?.city + ' ' + userProfileData?.country} field="Location" />
          <ProfileItem iconName={MdEmail} text={userData.email} textClassName="break-all" field="Email" />
          <ProfileItem iconName={MdPhone} text={userProfileData?.phone_number} field="Contact" />
          <ProfileItem
            iconName={FaBirthdayCake}
            text={userProfileData?.dob ? new Date(userProfileData?.dob).toISOString().split('T')[0] : undefined}
            field="Birthday"
          />
        </div>
        <p className="mt-6 text-lg font-medium">Connections</p>
        <div
          className="mt-3 flex justify-start gap-6 text-gray-600 cursor-pointer"
          onClick={() => {
            setModalContentType('ConnectionsModal')
            setIsModalOpen(true)
          }}
        >
          <p className="text-xs text-primary">{following} Following</p>
          <p className="text-xs text-primary">{followers} Followers</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
