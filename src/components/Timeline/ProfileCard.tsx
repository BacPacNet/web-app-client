/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { RiGraduationCapFill } from 'react-icons/ri'
import { HiLibrary } from 'react-icons/hi'
import { FaLocationDot } from 'react-icons/fa6'
import { MdEmail, MdPhone } from 'react-icons/md'
import { FaBirthdayCake } from 'react-icons/fa'
import { HiPencilAlt } from 'react-icons/hi'
import coverImage from '../../../public/timeline/cover.png'
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
}

const ProfileItem = ({ iconName, text }: { iconName: React.ComponentType; text: string }) => {
  return (
    <div className="flex flex-row gap-3 items-center my-2">
      {React.createElement(iconName, { size: 22, color: '#404040' })}
      <p className="text-gray-600 text-xs font-medium">{text}</p>
    </div>
  )
}

const ProfileCard: React.FC<ProfileProps> = ({ name, bio, university, department, location, email, phone, dateOfBirth, following, followers }) => {
  return (
    <div className="max-w-[280px] bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-dark">
      <div className="relative max-w-xs w-full">
        {/* Cover Image */}
        <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${coverImage.src})` }} />
        {/* Profile Picture and Edit Profile Button */}
        <div className="absolute top-14 flex items-end pb-4 pl-4 w-full">
          <div className="flex">
            <img src="/timeline/avatar.png" alt="Profile" className="h-24 w-24 rounded-full border-4 border-white" width={24} height={24} />
            <div className="flex justify-end absolute bottom-8 right-8 gap-2 items-center">
              <button className="text-xs text-primary">Edit Profile</button>
              <HiPencilAlt size={16} color="#737373" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 mt-8 py-5">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-gray-dark text-xs">{bio}</p>
        <button className="w-full bg-primary text-white py-2 mt-2 rounded-lg text-xs font-medium">Create Avatar</button>
        <div className="mt-4">
          <ProfileItem iconName={RiGraduationCapFill} text={university} />
          <ProfileItem iconName={HiLibrary} text={department} />
          <ProfileItem iconName={FaLocationDot} text={location} />
          <ProfileItem iconName={MdEmail} text={email} />
          <ProfileItem iconName={MdPhone} text={phone} />
          <ProfileItem iconName={FaBirthdayCake} text={dateOfBirth} />
        </div>
        <p className="mt-6 text-lg font-medium">Connections</p>
        <div className="mt-3 flex justify-start gap-6 text-gray-600">
          <p className="text-xs text-primary">{following} Following</p>
          <p className="text-xs text-primary">{followers} Followers</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
