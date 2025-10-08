'use client'
import Buttons from '@/components/atoms/Buttons'
import Loading from '@/components/atoms/Loading'
import { useUniversitySearchByName } from '@/services/universitySearch'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MdEmail } from 'react-icons/md'
import React, { useEffect, useMemo, useState } from 'react'
import { FaPhoneAlt, FaUsers } from 'react-icons/fa'
import { IoIosLink } from 'react-icons/io'
import { PiBuildingsFill } from 'react-icons/pi'
import { BsClockFill } from 'react-icons/bs'
import universityPlaceholder from '@assets/universityBackgroudImage.svg'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import { useUniStore } from '@/store/store'
import NotLoggedInModal from '@/components/molecules/NotLoggedInModal'
import { useJoinCommunityFromUniversity } from '@/services/community-university'
import SupportingText from '@/components/atoms/SupportingText'
import { useModal } from '@/context/ModalContext'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { useQueryClient } from '@tanstack/react-query'
import GenericInfoModal from '@/components/molecules/VerifyUniversityToJoinModal/VerifyUniversityToJoinModal'
import UniversityInfoCard from '@/components/atoms/UniversityInfoCard'

export default function ClientUniversityProfile({ universityName }: { universityName: string }) {
  const { openModal } = useModal()
  const queryClient = useQueryClient()
  const { data: university, isLoading: isUniversityLoading, isFetching } = useUniversitySearchByName(universityName)
  const { userData, userProfileData, setUserProfileCommunities } = useUniStore()
  const [imageSrc, setImageSrc] = useState(university?.campus || universityPlaceholder)
  const [logoSrc, setLogoSrc] = useState(university?.logo || universityLogoPlaceholder)

  const { mutate: joinCommunityFromUniversity, isPending: isJoinLoading } = useJoinCommunityFromUniversity()
  const router = useRouter()

  const isCommunityAlreadyJoined = useMemo(() => {
    return userProfileData?.communities?.some((c) => c.communityId === university?.communityId)
  }, [university, userProfileData])

  useEffect(() => {
    if (university?.campus) {
      setImageSrc(university?.campus)
    }
    if (university?.logo) {
      setLogoSrc(university?.logo)
    }
  }, [university])

  if (isUniversityLoading || isFetching) return <Loading />

  const contactData = [
    {
      icon: MdEmail,
      title: 'Email',
      info: university?.email,
    },
    {
      icon: FaPhoneAlt,
      title: 'Phone',
      info: university?.phone,
    },
    {
      icon: PiBuildingsFill,
      title: 'Address',
      info: university?.address,
    },
  ]

  const additionalData = [
    {
      icon: IoIosLink,
      title: 'Link',
      info: university?.web_pages,
    },
    {
      icon: FaUsers,
      title: 'Total Students',
      info: university?.total_students,
    },
    {
      icon: BsClockFill,
      title: 'Office Hours',
      info: university?.office_hours,
    },
  ]

  const handleViewCommunity = () => {
    router.push(`/community/${university?.communityId}`)
  }
  const handleClick = () => {
    if (!userData?.id) {
      openModal(
        <NotLoggedInModal title={'Login to Join Community'} desc={"Login or create an account to become part of Lorem University's community! "} />,
        'w-96 p-0 rounded-md'
      )
    } else {
      joinCommunityFromUniversity(university._id, {
        onSuccess: (response: any) => {
          if (response.statusCode === 406) {
            return openModal(
              <GenericInfoModal
                title="Oops! You've hit the limit."
                description="Looks like you've already joined a university without verifying your student status. You can only join one unverified university at a time."
                subTitle="To continue, verify your student email for either:"
                listItems={['The university you have previously joined', 'The one you are currently attempting to join']}
                buttonLabel="Verify University Email"
                redirectUrl="/setting/university-verification"
              />,
              'w-[350px] sm:w-[490px] hideScrollbar'
            )
          } else {
            queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
            if (response.data && response.data.profile) setUserProfileCommunities(response.data.profile.communities)
            router.push(`/community/${response.data.community._id}`)
            showCustomSuccessToast(`Joined Community `)
          }
        },
      })
    }
  }

  return (
    <div className="flex justify-center">
      <div className="py-16 flex flex-col gap-16 lg:gap-24 px-4 lg:px-0 overflow-x-hidden max-width-allowed">
        <div className="flex justify-between flex-col-reverse lg:flex-row gap-8 md:gap-16 lg:gap-[67px]">
          <div className="flex flex-col  gap-4 md:gap-8 flex-1 ">
            <div className="flex items-center lg:items-start gap-8 pb-4">
              <div className="flex justify-start items-start  rounded-full bg-white w-16 min-w-[64px] h-16  relative overflow-hidden">
                <Image onError={() => setLogoSrc(universityLogoPlaceholder)} fill src={logoSrc} alt="logo" className="object-contain" />
              </div>
              <p className="text-neutral-900 md:text-lg-small text-md font-extrabold font-poppins">{university?.name}</p>
            </div>
            <SupportingText>{university?.short_overview || 'Not Available'}</SupportingText>
            {isCommunityAlreadyJoined ? (
              <Buttons variant="shade" className="w-max" size="large" onClick={handleViewCommunity}>
                View Community
              </Buttons>
            ) : (
              <Buttons disabled={isJoinLoading} className="w-max" size="large" onClick={handleClick}>
                Join Community
              </Buttons>
            )}
          </div>
          <div className="relative flex-1 flex justify-center lg:max-w-[480px]  max-sm:items-center max-h-[290px] sm:min-h-[290px] min-h-[208px] bg-neutral-300 rounded-lg">
            <Image
              onError={() => setImageSrc(universityPlaceholder)}
              fill
              className="rounded-lg  object-cover   "
              src={imageSrc}
              alt="university_image"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8/B8AAtsA5tSY3jYAAAAASUVORK5CYII="
            />
          </div>
        </div>
        {/* //overview  */}
        <div className="flex flex-col gap-4">
          <p className="text-neutral-900 font-extrabold font-poppins text-md md:text-md-big">Overview</p>
          <div className="flex flex-col gap-4">
            <SupportingText>{university?.long_description}</SupportingText>
          </div>
        </div>
        {/* //contact  */}
        <div className="flex flex-col gap-4 ">
          <p className="text-neutral-900 text-base font-extrabold font-poppins text-md">Contact Info</p>
          <div className="flex justify-between gap-8  flex-col md:flex-row max-sm:gap-5">
            <div className="bg-neutral-200 p-5 md:w-[474px] w-full h-[300px] rounded-lg flex flex-col gap-8">
              {contactData.map((item, index) => (
                <UniversityInfoCard key={index} icon={item.icon} title={item.title} info={item.info} />
              ))}
            </div>
            <div className="bg-neutral-200 p-5 md:w-[474px] w-full  h-[300px] rounded-lg flex flex-col gap-8">
              {additionalData.map((item, index) => (
                <UniversityInfoCard key={index} icon={item.icon} title={item.title} info={item.info} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
