import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa'
import { ImEarth } from 'react-icons/im'
import { HiDotsHorizontal, HiPencilAlt } from 'react-icons/hi'
import badge from '@assets/badge.svg'
import useDeviceType from '@/hooks/useDeviceType'
import { format, parse } from 'date-fns'
import { useUniStore } from '@/store/store'
import { useToggleFollow } from '@/services/connection'
import { IoIosShareAlt } from 'react-icons/io'
import { MdBlockFlipped } from 'react-icons/md'
import { IoFlagOutline } from 'react-icons/io5'
import Buttons from '@/components/atoms/Buttons'
import { useState, useEffect } from 'react'
import EditProfileModal from '@/components/Timeline/Modals/EditProfileModal'
import ConnectionsModal from '@/components/Timeline/Modals/ConnectionsModal'
import { Spinner } from '@/components/spinner/Spinner'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import { userTypeEnum } from '@/types/RegisterForm'
import { convertToDateObj } from '@/lib/utils'
import { HiMail } from 'react-icons/hi'
import { useCreateUserChat } from '@/services/Messages'
import { useRouter } from 'next/navigation'
import { useModal } from '@/context/ModalContext'
import { RxCrossCircled } from 'react-icons/rx'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { useBlockUser } from '@/services/userProfile'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import ProfileCommunityHolder from '@/components/molecules/ProfileCommunityHolder'
interface UserProfileCardProps {
  name: string
  isPremium: boolean
  description: string
  university: string
  following: number
  followers: number
  year: string
  major: string
  email: string
  phone: string
  location: string
  birthday: string
  avatarUrl: string
  degree: string
  country: string
  isSelfProfile?: boolean
  userId?: string
  universityLogo: string
  occupation: string
  affiliation: string
  role: string
  isBlockedByYou: boolean
  isVerifiedUniversity: boolean
  communities: {
    _id: string
    name: string
    logo: string
    isVerifiedMember: boolean
    isCommunityAdmin: boolean
  }[]
  activeUniversityId: string
  activeUniversityName: string
}

export function UserProfileCard({
  name,
  description,
  university,
  following,
  followers,
  year,
  major,
  email,
  phone,
  location,
  birthday,
  avatarUrl,
  country,
  isSelfProfile,
  userId,
  universityLogo,
  role,
  occupation,
  affiliation,
  isBlockedByYou = false,
  isVerifiedUniversity,
  communities,
  activeUniversityId,
  activeUniversityName,
}: UserProfileCardProps) {
  const { isDesktop } = useDeviceType()
  const { userProfileData } = useUniStore()
  const router = useRouter()
  const { openModal } = useModal()
  const [isOpen, setIsOpen] = useState(false)
  const [isBlocked, setIsBlocked] = useState(isBlockedByYou)
  const { mutate: toggleFollow, isPending } = useToggleFollow('Following')
  const { mutateAsync: mutateCreateUserChat } = useCreateUserChat()
  const { mutateAsync: mutateBlockUser } = useBlockUser()
  const userFollowingIDs = userProfileData && userProfileData?.following?.map((following) => following.userId)
  const isStudent = role === userTypeEnum.Student
  //  const isUniversityVerified = userProfileData?.email?.some((university) => university.UniversityName === userProfileData.university_name)

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const dobFormat = birthday.includes('/') ? convertToDateObj(birthday) : Number(birthday) > 0 ? new Date(Number(birthday)) : null
  const dateOfBirth = dobFormat && format(dobFormat, 'dd MMM yyyy')

  const handleMessage = async () => {
    const createChatResponse: any = await mutateCreateUserChat({ userId: userId })
    router.replace(`/messages?id=${createChatResponse._id}`)
  }

  const handleProfileImageClick = () => {
    setIsLightboxOpen(true)
  }

  // const handleBlockUser = () => {
  //   mutateBlockUser(userId, {
  //     onSuccess: () => {
  //       setIsBlocked(!isBlocked)
  //     },
  //   })
  // }

  useEffect(() => {
    setIsBlocked(isBlockedByYou)
  }, [isBlockedByYou])

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href)
    showCustomSuccessToast('Profile url copied to clipboard.')
  }

  return (
    <div className=" relative z-0 shadow-card bg-white rounded-lg p-6 flex flex-col gap-4 font-inter">
      {/* Lightbox */}
      {isLightboxOpen && <Lightbox mainSrc={avatarUrl ? avatarUrl : avatar} onCloseRequest={() => setIsLightboxOpen(false)} />}

      <div className="flex flex-nowrap gap-4 items-start ">
        <div className="flex-none  w-[80px] h-[80px] group relative">
          <Image
            src={avatarUrl ? avatarUrl : avatar}
            alt={name}
            width={isDesktop ? 80 : 80}
            height={isDesktop ? 80 : 80}
            className="rounded-full object-cover  w-[80px] h-[80px] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleProfileImageClick}
          />
        </div>
        <div className={`w-full flex justify-between sm:flex-nowrap flex-wrap `}>
          <div className="flex w-full flex-col gap-1">
            <div className="flex flex-row gap-2 items-center">
              <p className="font-poppins text-neutral-700 text-[20px] font-bold">{name}</p>

              {/*<div className="flex gap-2">
                {userProfileData?.email &&
                  userProfileData?.email.map((item) => (
                    <div
                      key={item?.UniversityName}
                      className="w-6 h-6 border-2 border-primary-500 overflow-hidden rounded-full flex justify-center items-center"
                    >
                      <Image
                        className="w-[16px] h-[16px] object-contain roundedfull overflow-hidden m-auto"
                        src={item?.logo ? item?.logo : universityLogoPlaceholder}
                        width={16}
                        height={16}
                        alt=""
                      />
                    </div>
                  ))}
              </div>*/}
            </div>
            <div className="text-xs text-neutral-500 font-medium flex flex-col gap-1 font-inter">
              <p>{isStudent ? year : occupation}</p>

              <p>{isStudent ? major : affiliation}</p>
            </div>
          </div>

          {isSelfProfile ? (
            <div
              onClick={() => {
                openModal(<EditProfileModal />, 'h-[80vh] w-[350px] sm:w-[490px] hideScrollbar')
              }}
              className="hidden  h-10 sm:flex gap-1  items-center justify-center text-2xs font-medium py-3 px-4 rounded-lg text-primary-500 bg-secondary border border-shade-button-border  drop-shadow-sm whitespace-nowrap cursor-pointer"
            >
              <HiPencilAlt size={16} />
              <p>Edit Profile</p>
            </div>
          ) : (
            <div className=" items-start gap-4 mt-4 sm:mt-0 hidden sm:flex ">
              <div className=" text-primary-500 text-sm bg-surface-primary-50 rounded-full flex p-1">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                  <PopoverTrigger>
                    <HiDotsHorizontal className="text-primary w-8 h-8" />
                  </PopoverTrigger>
                  <PopoverContent onClick={() => setIsOpen(false)} className="relative w-fit border-none shadow-lg bg-white p-0 rounded-lg">
                    <ul>
                      <li
                        onClick={() => handleShareProfile()}
                        className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
                      >
                        <IoIosShareAlt />
                        <p>Share Profile</p>
                      </li>
                      {userFollowingIDs?.includes(userId as string) && (
                        <li
                          onClick={() => toggleFollow(userId as string)}
                          className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
                        >
                          <RxCrossCircled />
                          <p>Unfollow</p>
                        </li>
                      )}

                      {/* <li
                        onClick={() => handleBlockUser()}
                        className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
                      >
                        <MdBlockFlipped />
                        <p>{isBlocked ? 'Unblock User' : 'Block User'}</p>
                      </li> */}
                      {/* <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                        <IoFlagOutline />
                        <p>Report User</p>
                      </li> */}
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>
              <Buttons onClick={() => handleMessage()} className="flex items-center gap-2 h-10 " variant="shade" size="small">
                <HiMail className="w-4 h-4" /> Message
              </Buttons>
              {!userFollowingIDs?.includes(userId as string) && (
                <Buttons className=" h-10 " onClick={() => toggleFollow(userId as string)} variant="primary" size="small">
                  Follow
                </Buttons>
              )}
              {/* <Buttons className=" h-10 " onClick={() => toggleFollow(userId as string)} variant="primary" size="small">
                {isPending ? <Spinner /> : userFollowingIDs?.includes(userId as string) ? 'UnFollow' : 'Follow'}
              </Buttons> */}
            </div>
          )}
        </div>
      </div>
      {isSelfProfile && (
        <div
          onClick={() => {
            openModal(<EditProfileModal />)
          }}
          className="flex w-max  h-10 sm:hidden gap-1 items-center justify-center text-2xs font-medium py-3 px-4 rounded-lg text-primary-500 bg-secondary border border-shade-button-border  drop-shadow-sm whitespace-nowrap cursor-pointer"
        >
          <HiPencilAlt size={16} />
          <p>Edit Profile</p>
        </div>
      )}
      {!isSelfProfile && (
        // max-sm:hidden
        <div className="flex items-center gap-4 mt-2 sm:mt-0 sm:hidden ml-2">
          <div className=" text-primary-500 text-sm bg-surface-primary-50 rounded-full flex p-1">
            <Popover>
              <PopoverTrigger>
                <HiDotsHorizontal className="text-primary w-8 h-8" />
              </PopoverTrigger>
              <PopoverContent className="relative w-fit border-none shadow-lg bg-white p-0 rounded-lg">
                <ul>
                  <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                    <IoIosShareAlt />
                    <p>Share Profile</p>
                  </li>
                  {/* <li
                    onClick={() => handleBlockUser()}
                    className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
                  >
                    <MdBlockFlipped />
                    <p>{isBlocked ? 'Unblock User' : 'Block User'}</p>
                  </li> */}
                  <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
                    <IoFlagOutline />
                    <p>Report User</p>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
          <Buttons className="flex items-center gap-2 h-10 " variant="shade" size="small">
            <HiMail className="w-4 h-4" /> Message
          </Buttons>
          <Buttons className=" h-10 " onClick={() => toggleFollow(userId as string)} variant="primary" size="small">
            {isPending ? <Spinner /> : userFollowingIDs?.includes(userId as string) ? 'UnFollow' : 'Follow'}
          </Buttons>
        </div>
      )}
      <div className="flex gap-4  items-start font-poppins  flex-col">
        <div className="flex gap-4 ">
          <div
            onClick={() =>
              openModal(
                <ConnectionsModal userId={userId} defaultTab="Following" />,
                ' h-[70vh] w-[350px] sm:w-[550px]   custom-scrollbar',
                true,
                false
              )
            }
            className="h-[38px] flex gap-1 items-center justify-center text-2xs font-medium py-3 px-4 rounded-lg text-neutral-700  border border-neutral-200  drop-shadow-sm whitespace-nowrap cursor-pointer"
          >
            {following || '0'} Following
          </div>

          <div
            onClick={() =>
              openModal(
                <ConnectionsModal userId={userId} defaultTab="Followers" />,
                ' h-[70vh] w-[350px] sm:w-[550px]   custom-scrollbar',
                true,
                false
              )
            }
            className="h-[38px] flex gap-1 items-center justify-center text-2xs font-medium py-3 px-4 rounded-lg text-neutral-700  border border-neutral-200  drop-shadow-sm whitespace-nowrap cursor-pointer"
          >
            {followers || '0'} Followers
          </div>
        </div>

        <div className="flex  gap-6 flex-wrap">
          {communities
            ?.slice()
            .sort((a, b) => {
              const aIsActive = activeUniversityName.toString() === a.name.toString()
              const bIsActive = activeUniversityName.toString() === b.name.toString()

              const aIsAdmin = a.isCommunityAdmin
              const bIsAdmin = b.isCommunityAdmin

              const aIsVerified = a.isVerifiedMember
              const bIsVerified = b.isVerifiedMember

              if (aIsActive !== bIsActive) return aIsActive ? -1 : 1
              if (aIsAdmin !== bIsAdmin) return aIsAdmin ? -1 : 1
              if (aIsVerified !== bIsVerified) return aIsVerified ? -1 : 1

              return 0
            })
            .map((community) => (
              <ProfileCommunityHolder
                key={community._id}
                isActive={activeUniversityName.toString() === community.name.toString()}
                logo={community.logo}
                name={community.name}
                isVerified={community.isVerifiedMember}
                isCommunityAdmin={community.isCommunityAdmin}
              />
            ))}
        </div>
      </div>

      {description?.length > 0 && <p className="text-xs font-medium text-neutral-500 ">{description}</p>}

      <div className="flex sm:flex-row flex-col text-neutral-500 text-2xs font-inter">
        <div className="flex flex-col gap-4 pe-4 ">
          <div className="flex items-center space-x-2">
            <FaEnvelope size={16} />
            {/*<Tooltip text={email}>*/}
            <span>{email?.length ? email : '--'}</span>
            {/*</Tooltip>*/}
          </div>

          <div className="flex items-center space-x-2">
            <FaPhone size={16} />
            <span>{phone?.length ? phone : '--'}</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-4 sm:pt-0 sm:ps-4">
          <div className="flex items-center space-x-2">
            <FaBirthdayCake size={16} />
            {dateOfBirth ? <span>{dateOfBirth}</span> : ''}
          </div>

          <div className="flex items-center space-x-2">
            <ImEarth size={16} />
            <span>
              {location.length ? location + ',' : ''} {country.length ? country : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
