import Card from '@/components/atoms/Card'
import LoginButtons from '@/components/atoms/LoginButtons'
import Image from 'next/image'
import Link from 'next/link'
//import { Badge } from "@/components/ui/badge";
//import { Button } from "@/components/ui/button";
import { FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa'
import { ImEarth } from 'react-icons/im'
import { HiPencilAlt } from 'react-icons/hi'
import badge from '@assets/badge.svg'
import useDeviceType from '@/hooks/useDeviceType'
import { format } from 'date-fns'
import { ModalContentType } from '@/types/global'
import { Skeleton } from '@/components/ui/Skeleton'

interface UserProfileCardProps {
  name: string
  isPremium: boolean
  description: string
  university: string
  isVerified: boolean
  following: number
  followers: number
  year: string
  major: string
  email: string
  phone: string
  location: string
  birthday: string
  avatarUrl: string
  isVerifiedUniversity: boolean
  degree: string
  country: string
  setModalContentType: React.Dispatch<React.SetStateAction<ModalContentType>>
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSelfProfile?: boolean
}

export function UserProfileCard({
  name,
  isPremium,
  description,
  university,
  isVerified,
  following,
  followers,
  year,
  degree,
  major,
  email,
  phone,
  location,
  birthday,
  avatarUrl,
  isVerifiedUniversity,
  country,
  setModalContentType,
  setIsModalOpen,
  isSelfProfile,
}: UserProfileCardProps) {
  const { isDesktop } = useDeviceType()

  const handleOpenModal = (modalType: ModalContentType) => {
    setModalContentType(modalType)
    setIsModalOpen(true)
  }

  console.log(university, 'university')
  return (
    <Card className="rounded-2xl px-8">
      <div className="flex flex-wrap lg:flex-nowrap gap-4 lg:gap-8 items-start">
        <div className="flex-none  lg:w-[126px] lg:h-[126px] w-[90] h-[90]">
          <Image src={avatarUrl} alt={name} width={isDesktop ? 126 : 90} height={isDesktop ? 126 : 90} className="rounded-full" />
        </div>
        <div className="w-full">
          <div className="flex w-full items-center justify-between flex-wrap">
            <div className="flex gap-4 items-center">
              <p className="font-poppins text-neutral-700 text:xl lg:text-2xl font-bold">{name}</p>
              {isPremium && <p className="bg-primary-800 text-white  rounded-xl px-4 text-xs">Premium</p>}
            </div>
            {isSelfProfile && (
              <div className="flex gap-2 items-center text-xs lg:text-sm text-primary-500">
                <button onClick={() => handleOpenModal('EditProfileModal')}>Edit Profile</button>
                <HiPencilAlt size={16} />
              </div>
            )}
          </div>
          <p className="lg:text-2xs text-[10px] text-neutral-500 py-2">{description}</p>
          <div className="flex gap-4 lg:gap-8 items-center font-poppins py-2 flex-wrap">
            <div className="flex items-center ">
              <Image src={avatarUrl} alt="" width={30} height={30} className="rounded-full shadow-logo" />
              <p className="text-neutral-500 ml-3 font-semibold text-xs lg:text-sm">{university}</p>
              {isVerifiedUniversity && <Image src={badge} alt={name} width={12} height={12} className="ml-1 " />}
            </div>
            <div className="flex gap-4 text-neutral-700 font-semibold">
              <span onClick={() => handleOpenModal('ConnectionsModal')} className=" text-xs lg:text-sm cursor-pointer">
                {following || '0'} Following
              </span>
              <span onClick={() => handleOpenModal('ConnectionsModal')} className=" text-xs lg:text-sm cursor-pointer">
                {following || '0'} Followers
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        //style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(0, max-content))' }}
        className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-3 gap-4 pt-8 text-neutral-500 "
      >
        <div className="flex items-center space-x-2 ">
          <FaGraduationCap className="text-md" />
          <span className="text-xs">{`${degree}, ${major}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaEnvelope className="text-md flex-none" />
          <span className="text-xs">{email}</span>
        </div>
        <div className="flex items-center space-x-2 lg:justify-center">
          <FaPhone className="text-md flex-none" />
          <span className="text-xs">{phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-md flex-none" />
          <span className="text-xs">{location}</span>
        </div>
        <div className="flex items-center space-x-2 ">
          <FaBirthdayCake className="text-md flex-none" />
          <span className="text-xs">{birthday && format(new Date(birthday), 'dd MMM yyyy')}</span>
        </div>
        <div className="flex items-center space-x-2 lg:justify-center">
          <ImEarth className="text-md flex-none" />
          <span className="text-xs">{country}</span>
        </div>
      </div>
      {/*<div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Image src={avatarUrl} alt={name} width={100} height={100} className="rounded-full" />
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
            {isPremium && <p className="bg-purple-600 text-white">Premium</p>}
          </div>
        </div>
        <LoginButtons>Edit Profile</LoginButtons>
      </div>

      <p className="text-gray-600 mb-4">{description}</p>

      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-orange-100 rounded-full p-2">
          <Image src="/path-to-university-icon.png" alt="University" width={24} height={24} />
        </div>
        <span className="font-semibold">{university}</span>
        {isVerified && <p className="bg-blue-500 text-white">✓</p>}
      </div>

      <div className="flex space-x-4 mb-6">
        <div>
          <span className="font-bold">{following}</span> Following
        </div>
        <div>
          <span className="font-bold">{followers}</span> Followers
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <FaGraduationCap className="text-gray-400" />
          <span>{`${year}, ${major}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaEnvelope className="text-gray-400" />
          <span>{email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaPhone className="text-gray-400" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-gray-400" />
          <span>{location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaBirthdayCake className="text-gray-400" />
          <span>{birthday}</span>
        </div>
      </div>
      
      */}
    </Card>
  )
}
