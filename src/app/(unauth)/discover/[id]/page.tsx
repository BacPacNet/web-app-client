'use client'
import Buttons from '@/components/atoms/Buttons'
import Loading from '@/components/atoms/Loading'
import { useUniversitySearchByName } from '@/services/universitySearch'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { MdEmail } from 'react-icons/md'
import React, { useEffect, useMemo, useState } from 'react'
import { FaPhoneAlt, FaUsers } from 'react-icons/fa'
import { IoIosLink } from 'react-icons/io'
import { PiBuildingsFill } from 'react-icons/pi'
import { BsClockFill } from 'react-icons/bs'
import universityPlaceholder from '@assets/universityBackgroudImage.svg'
import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import { IconType } from 'react-icons/lib'
import { useUniStore } from '@/store/store'
import NotLoggedInModal from '@/components/molecules/NotLoggedInModal'
import { useJoinCommunityFromUniversity } from '@/services/community-university'
import SupportingText from '@/components/atoms/SupportingText'
import VerifyUniversityToJoinModal from '@/components/molecules/VerifyUniversityToJoinModal/VerifyUniversityToJoinModal'
import { useModal } from '@/context/ModalContext'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { useQueryClient } from '@tanstack/react-query'

const UniversityCard = ({ icon: Icon, title, info }: { icon: IconType; title: string; info: string }) => (
  <div>
    <p className="text-primary-700 text-[20px] flex gap-1 items-center font-semibold font-poppins">
      <Icon size={20} />
      {title}
    </p>
    {title === 'Link' && info?.length ? (
      <a className="underline text-primary-500" href={info} target="_blank" rel="noopener noreferrer">
        {info}
      </a>
    ) : title === 'Email' && info?.length ? (
      <a href={`mailto:${info}`}>{info}</a>
    ) : title === 'Phone' && info?.length ? (
      <a href={`tel:${info}`}>{info}</a>
    ) : (
      <p className="text-neutral-700 text-[18px] line-clamp-6">{info || 'Not available'}</p>
    )}
  </div>
)

export default function UniversityProfile() {
  const params = useParams()
  const { openModal } = useModal()
  const queryClient = useQueryClient()
  const { id: universityName } = params
  const { data: university, isLoading: isUniversityLoading, isFetching } = useUniversitySearchByName(universityName as string)
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
      //  university?.wikiInfoBox?.['Office Hours'] || 'Monday to Friday 9:00 am - 12:00 p.m. and 1:00 p.m - 5:00 p.m',
    },
  ]

  const handleViewCommunity = () => {
    router.push(`/community/${university?.communityId}`)
  }
  const handleClick = () => {
    //const email = userProfileData?.email?.find((email) => email.UniversityName == universityName)
    if (!userData?.id) {
      openModal(
        <NotLoggedInModal title={'Login to Join Community'} desc={'Login or create an account to become part of Lorem University’s community! '} />,
        'w-96 p-0 rounded-md'
      )
    } else {
      joinCommunityFromUniversity(university._id, {
        onSuccess: (response: any) => {
          if (response.statusCode === 406) {
            return openModal(<VerifyUniversityToJoinModal />, 'w-[350px] sm:w-[490px] noi')
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
              <div className="flex justify-start items-start  drop-shadow-lg rounded-full bg-white w-16 min-w-[64px] h-16  relative overflow-hidden">
                <Image onError={() => setLogoSrc(universityLogoPlaceholder)} fill src={logoSrc} alt="logo" className="object-contain p-2" />
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

            {/*<SupportingText>
              In addition to its scientific prowess, Loremium University is a thriving cultural hub. The university’s School of Arts is renowned for
              its avant-garde approach to art and design, producing graduates who have gone on to achieve international acclaim. Regular exhibitions,
              performances, and lectures by visiting artists and scholars enrich the campus life and foster a dynamic exchange of ideas.
            </SupportingText>
            <SupportingText>
              Loremium University is a magnet for students from around the globe, drawn by its stellar reputation and welcoming atmosphere. The
              university’s diverse student body, hailing from over 80 countries, creates a rich tapestry of cultures and perspectives. Dedicated
              support services ensure that international students feel at home, making their transition to life in Loremium seamless and enjoyable.
            </SupportingText>*/}
          </div>
        </div>
        {/* //contact  */}
        <div className="flex flex-col gap-4 ">
          <p className="text-neutral-900 text-base font-extrabold font-poppins text-md">Contact Info</p>
          <div className="flex justify-between gap-8  flex-col md:flex-row max-sm:gap-5">
            <div className="bg-neutral-200 p-5 md:w-[474px] w-full h-[300px] rounded-lg flex flex-col gap-8">
              {contactData.map((item, index) => (
                <UniversityCard key={index} icon={item.icon} title={item.title} info={item.info} />
              ))}
            </div>
            <div className="bg-neutral-200 p-5 md:w-[474px] w-full  h-[300px] rounded-lg flex flex-col gap-8">
              {additionalData.map((item, index) => (
                <UniversityCard key={index} icon={item.icon} title={item.title} info={item.info} />
              ))}
            </div>
          </div>
        </div>
        {/* //contact  */}
        {/* <div className="flex flex-col gap-4 mt-4">
          <p className="text-neutral-900 text-base font-extrabold w-96">Reviews</p>
          <div className="flex flex-col gap-4 items-center justify-center h-60">
            <p className="text-neutral-900 text-base font-extrabold ">Reviews are coming soon!</p>
            <p className={`text-neutral-700 text-xs line-clamp-6 max-w-lg text-center `}>
              This feature is under construction. If you would like to have it sooner send us some feedback!
            </p>
          </div>
        </div> */}
      </div>
    </div>
  )
}
