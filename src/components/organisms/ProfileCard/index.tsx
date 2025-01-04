import Card from '@/components/atoms/Card'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa'
import { ImEarth } from 'react-icons/im'
import { HiDotsHorizontal, HiPencilAlt } from 'react-icons/hi'
import badge from '@assets/badge.svg'
import useDeviceType from '@/hooks/useDeviceType'
import { format } from 'date-fns'
import { useUniStore } from '@/store/store'
import { useToggleFollow } from '@/services/connection'
import { IoIosShareAlt } from 'react-icons/io'
import { MdBlockFlipped } from 'react-icons/md'
import { IoFlagOutline } from 'react-icons/io5'
import { RiMessage2Fill } from 'react-icons/ri'
import { FaCalendarCheck } from 'react-icons/fa6'
import { MdSubject } from 'react-icons/md'
import { FaCamera } from 'react-icons/fa'
import Buttons from '@/components/atoms/Buttons'
import { useEditProfile } from '@/services/edit-profile'
import { replaceImage } from '@/services/uploadImage'
import { ChangeEvent } from 'react'
import { openModal } from '@/components/molecules/Modal/ModalManager'
import EditProfileModal from '@/components/Timeline/Modals/EditProfileModal'
import ConnectionsModal from '@/components/Timeline/Modals/ConnectionsModal'
import { Spinner } from '@/components/spinner/Spinner'

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
  isSelfProfile?: boolean
  userId?: string
  universityLogo: string
  occupation: string
  affiliation: string
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

  isSelfProfile,
  userId,
  universityLogo,
  occupation,
  affiliation,
}: UserProfileCardProps) {
  const { isDesktop } = useDeviceType()
  const { userProfileData } = useUniStore()

  const { mutate: toggleFollow, isPending } = useToggleFollow('Following')
  const { mutate: mutateEditProfile } = useEditProfile()
  const userFollowingIDs = userProfileData && userProfileData?.following?.map((following) => following.userId)

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const data: any = await replaceImage(files[0], userProfileData?.profile_dp?.publicId)

      const dataToPush = { profile_dp: { imageUrl: data?.imageUrl, publicId: data?.publicId } }

      mutateEditProfile(dataToPush)
    } else {
      console.error('No file selected.')
    }
  }
  return (
    <Card className="rounded-2xl px-8">
      <div className="flex flex-wrap lg:flex-nowrap gap-4 lg:gap-8 items-start">
        <div className="flex-none lg:w-[126px] lg:h-[126px] w-[90px] h-[90px] group relative">
          <Image
            src={avatarUrl ? avatarUrl : avatar}
            alt={name}
            width={isDesktop ? 126 : 90}
            height={isDesktop ? 126 : 90}
            className="rounded-full object-cover lg:w-[126px] lg:h-[126px] w-[90px] h-[90px]"
          />
          {isSelfProfile && (
            <div className="group-hover:block hidden absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-primary-50 py-1 px-2 rounded-full text-primary font-medium cursor-pointer">
              <input style={{ display: 'none' }} type="file" id="changeProfileImage" onChange={(e) => handleImageUpload(e)} />
              <label htmlFor="changeProfileImage" className="bg-primary w-10 h-10 flex justify-center items-center rounded-full p-2 text-neutral-800">
                <FaCamera color="white" />
              </label>
            </div>
          )}
        </div>
        <div className="w-full">
          <div className="flex w-full items-center justify-between flex-wrap gap-4">
            <div className="flex gap-4 items-center">
              <p className="font-poppins text-neutral-700 text:md lg:text-[20px] font-bold">{name}</p>
              {/*{isPremium && <p className="bg-primary-800 text-white  rounded-xl px-2 text-3xs">Premium</p>}*/}
            </div>
            {isSelfProfile ? (
              <div
                onClick={() => openModal(<EditProfileModal />)}
                className="flex gap-2 items-center text-2xs lg:text-xs text-primary-500 whitespace-nowrap cursor-pointer"
              >
                <button>Edit Profile</button>
                <HiPencilAlt size={16} />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className=" text-primary-500 text-sm bg-surface-primary-50 rounded-full flex p-1">
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
                  {isPending ? <Spinner /> : userFollowingIDs?.includes(userId as string) ? 'UnFollow' : 'Follow'}
                </Buttons>
              </div>
            )}
          </div>
          <p className="lg:text-2xs text-[10px] text-neutral-500 py-2">{description}</p>
          <div className="flex gap-4 lg:gap-8 items-center font-poppins py-2 flex-wrap">
            <div className="flex items-center ">
              <Image objectFit="contain" src={universityLogo} alt="" width={30} height={30} className="rounded-full shadow-logo h-[30px]" />
              <p className="text-neutral-500 ml-3 font-semibold text-xs lg:text-sm">{university}</p>
              {isVerifiedUniversity && <Image src={badge} alt={name} width={12} height={12} className="ml-1 " />}
            </div>
            <div className="flex gap-4 text-neutral-700 font-semibold">
              <span onClick={() => openModal(<ConnectionsModal userId={userId} />)} className=" text-xs lg:text-sm cursor-pointer">
                {following || '0'} Following
              </span>
              <span onClick={() => openModal(<ConnectionsModal userId={userId} />)} className=" text-xs lg:text-sm cursor-pointer">
                {followers || '0'} Followers
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-3 gap-4 pt-3 lg:pt-8 text-neutral-500">
        {affiliation && occupation && (
          <>
            {occupation && (
              <div className="flex items-center space-x-2">
                <FaGraduationCap className="text-sm w-8" size={20} />
                <span className="text-xs">{`${occupation}`}</span>
              </div>
            )}
            {affiliation && (
              <div className="flex items-center space-x-2">
                <MdSubject className="text-sm w-8" size={20} />
                <span className="text-xs">{`${affiliation}`}</span>
              </div>
            )}
          </>
        )}

        {!affiliation && !occupation && (
          <>
            {degree && (
              <div className="flex items-center space-x-2">
                <FaGraduationCap className="text-sm w-8" size={20} />
                <span className="text-xs">{degree}</span>
              </div>
            )}
            {major && (
              <div className="flex items-center space-x-2">
                <MdSubject className="text-sm w-8" size={20} />
                <span className="text-xs">{major}</span>
              </div>
            )}
            {year && (
              <div className="flex items-center space-x-2">
                <FaCalendarCheck className="text-sm w-8" size={20} />
                <span className="text-xs">{`${year} Year`}</span>
              </div>
            )}
          </>
        )}
        {email && (
          <div className="flex items-center space-x-2">
            <FaEnvelope className="text-sm w-8" />
            {/*<Tooltip text={email}>*/}
            <span className="text-xs truncate-text">{email}</span>
            {/*</Tooltip>*/}
          </div>
        )}
        {phone && (
          <div className="flex items-center space-x-2">
            <FaPhone className="text-sm w-8" />
            <span className="text-xs">{phone}</span>
          </div>
        )}
        {location && (
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-sm w-8" />
            <span className="text-xs">{location}</span>
          </div>
        )}
        {birthday && (
          <div className="flex items-center space-x-2">
            <FaBirthdayCake className="text-sm w-8" />
            <span className="text-xs">{format(new Date(birthday), 'dd MMM yyyy')}</span>
          </div>
        )}
        {country && (
          <div className="flex items-center space-x-2">
            <ImEarth className="text-sm w-8" />
            <span className="text-xs">{country}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
