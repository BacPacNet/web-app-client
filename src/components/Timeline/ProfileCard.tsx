/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { RiGraduationCapFill } from 'react-icons/ri'
import { HiLibrary } from 'react-icons/hi'
import { FaLocationDot } from 'react-icons/fa6'
import { MdEmail, MdPhone } from 'react-icons/md'
import { FaBirthdayCake } from 'react-icons/fa'
import { HiPencilAlt } from 'react-icons/hi'
import coverImage from '../../../public/timeline/cover.png'
import { ModalContentType } from '@/types/global'
import { cn } from '@/lib/utils'
interface ProfileProps {
  name: string
  bio: string
  university: string
  department: string
  location: string
  email: string
  phone: string
  dateOfBirth: string
  following: number
  followers: number
  setModalContentType: React.Dispatch<React.SetStateAction<ModalContentType>>
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isUserProfile?: boolean
}

const ProfileItem = ({
  iconName,
  text,
  size,
  textClassName,
}: {
  iconName: React.ComponentType<{ size: number; color: string }>
  text: string
  size?: number
  textClassName?: string
}) => {
  const iconSize = size ? size : 22
  return (
    <div className="flex flex-row gap-3 items-center">
      {React.createElement(iconName, { size: iconSize, color: '#404040' })}
      <p className={cn('text-gray-600 text-xs font-medium break-words', textClassName)}>{text}</p>
    </div>
  )
}

const ProfileCard: React.FC<ProfileProps> = ({
  name,
  bio,
  university,
  department,
  location,
  email,
  phone,
  dateOfBirth,
  following,
  followers,
  setIsModalOpen,
  setModalContentType,
  isUserProfile,
}) => {
  return (
    <div className="sm:max-w-md lg:max-w-[280px] bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-dark">
      <div className="relative lg:max-w-xs w-full">
        {/* Cover Image */}
        <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${coverImage.src})`, objectFit: 'cover' }} />
        {/* Profile Picture and Edit Profile Button */}
        <div className="absolute top-14 flex items-end pb-4 pl-4 w-full">
          <div className="flex">
            <img src="/timeline/avatar.png" alt="Profile" className="h-24 w-24 rounded-full border-4 border-white" width={24} height={24} />
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
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-gray-dark text-xs py-1">{bio}</p>
        {!isUserProfile && <button className="w-full bg-primary text-white py-2 mt-2 rounded-lg text-xs font-medium">Create Avatar</button>}
        <div className="mt-5 flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-x-6 lg:flex">
          <ProfileItem iconName={RiGraduationCapFill} text={university} />
          <ProfileItem iconName={HiLibrary} text={department} />
          <ProfileItem iconName={FaLocationDot} text={location} />
          <ProfileItem iconName={MdEmail} text={email} textClassName="break-all" />
          <ProfileItem iconName={MdPhone} text={phone} />
          <ProfileItem iconName={FaBirthdayCake} text={dateOfBirth} />
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
