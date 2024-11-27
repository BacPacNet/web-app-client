import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Buttons'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
//import { Badge } from "@/components/ui/badge";
//import { Button } from "@/components/ui/button";
import { FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa'
import { ImEarth } from 'react-icons/im'
import { HiDotsHorizontal, HiPencilAlt } from 'react-icons/hi'
import badge from '@assets/badge.svg'
import useDeviceType from '@/hooks/useDeviceType'
import { format } from 'date-fns'
import { ModalContentType } from '@/types/global'
import { Skeleton } from '@/components/ui/Skeleton'
import { useUniStore } from '@/store/store'
import { useToggleFollow } from '@/services/connection'
import { IoIosShareAlt } from 'react-icons/io'
import { MdBlockFlipped } from 'react-icons/md'
import { IoFlagOutline } from 'react-icons/io5'
import { RiMessage2Fill } from 'react-icons/ri'
import Buttons from '@/components/atoms/Buttons'

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
  userId?: string
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
  userId,
}: UserProfileCardProps) {
  const { isDesktop } = useDeviceType()
  const { userProfileData } = useUniStore()
  const { mutate: toggleFollow } = useToggleFollow('Following')

  const userFollowingIDs = userProfileData && userProfileData?.following?.map((following) => following.userId)

  const handleOpenModal = (modalType: ModalContentType) => {
    setModalContentType(modalType)
    setIsModalOpen(true)
  }

  return (
    <Card className="rounded-2xl px-8">
      <div className="flex flex-wrap lg:flex-nowrap gap-4 lg:gap-8 items-start">
        <div className="flex-none  lg:w-[126px] lg:h-[126px] w-[90] h-[90]">
          <Image src={avatarUrl} alt={name} width={isDesktop ? 126 : 90} height={isDesktop ? 126 : 90} className="rounded-full" />
        </div>
        <div className="w-full">
          <div className="flex w-full items-center justify-between flex-wrap">
            <div className="flex gap-4 items-center">
              <p className="font-poppins text-neutral-700 text:md lg:text-[20px] font-bold">{name}</p>
              {isPremium && <p className="bg-primary-800 text-white  rounded-xl px-4 text-xs">Premium</p>}
            </div>
            {isSelfProfile ? (
              <div className="flex gap-2 items-center text-xs lg:text-sm text-primary-500">
                <button onClick={() => handleOpenModal('EditProfileModal')}>Edit Profile</button>
                <HiPencilAlt size={16} />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className=" text-primary-500 text-md bg-surface-primary-50 rounded-full flex p-1">
                  <Popover>
                    <PopoverTrigger>
                      <HiDotsHorizontal className="text-primary" />
                    </PopoverTrigger>
                    <PopoverContent className="relative w-fit border-none shadow-lg bg-white p-0 rounded-lg">
                      <ul>
                        <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                          <IoIosShareAlt />
                          <p>Share Profile</p>
                        </li>
                        <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                          <MdBlockFlipped />
                          <p>Block User</p>
                        </li>
                        <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                          <IoFlagOutline />
                          <p>Report User</p>
                        </li>
                      </ul>
                    </PopoverContent>
                  </Popover>
                </div>
                <Buttons className="flex items-center gap-2" variant="shade" size="extra_small">
                  Message <RiMessage2Fill />
                </Buttons>
                <Buttons onClick={() => toggleFollow(userId as string)} variant="primary" size="extra_small">
                  {userFollowingIDs?.includes(userId as string) ? 'UnFollow' : 'Follow'}
                </Buttons>
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
              <span onClick={() => isSelfProfile && handleOpenModal('ConnectionsModal')} className=" text-xs lg:text-sm cursor-pointer">
                {following || '0'} Following
              </span>
              <span onClick={() => isSelfProfile && handleOpenModal('ConnectionsModal')} className=" text-xs lg:text-sm cursor-pointer">
                {followers || '0'} Followers
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
        <div className="flex items-center space-x-2 ">
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
        <div className="flex items-center space-x-2 ">
          <ImEarth className="text-md flex-none" />
          <span className="text-xs">{country}</span>
        </div>
      </div>
    </Card>
  )
}
