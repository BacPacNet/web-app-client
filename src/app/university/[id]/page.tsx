'use client'
import Buttons from '@/components/atoms/Buttons'
import Loading from '@/components/atoms/Loading'
import { useUniversitySearchByName } from '@/services/universitySearch'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { MdEmail } from 'react-icons/md'
import React from 'react'
import { FaPhoneAlt, FaUsers } from 'react-icons/fa'
import { MdFax } from 'react-icons/md'
import { IoIosLink } from 'react-icons/io'
import { PiBuildingsFill } from 'react-icons/pi'
import { BsClockFill } from 'react-icons/bs'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import universityLogoPlaceholder from '@assets/unibuzz_rounded.svg'
import { IconType } from 'react-icons/lib'
import { useUniStore } from '@/store/store'
import { openModal } from '@/components/molecules/Modal/ModalManager'
import NotLoggedInModal from '@/components/molecules/NotLoggedInModal'
import UniversityVerificationModal from '@/components/organisms/SettingsSection/SettingModals/UniversityVerificationModal'
import { useJoinCommunity } from '@/services/community-university'
import SupportingText from '@/components/atoms/SupportingText'

const UniversityCard = ({ icon: Icon, title, info }: { icon: IconType; title: string; info: string }) => (
  <div>
    <p className="text-primary-700 text-[20px] flex gap-1 items-center font-semibold font-poppins">
      <Icon size={20} />
      {title}
    </p>
    <p className={`text-neutral-700 text-[18px] line-clamp-6 `}>{info || 'Not available'}</p>
  </div>
)

export default function UniversityProfile() {
  const params = useParams()
  const { id: universityName } = params
  const { data: university, isLoading: isUniversityLoading } = useUniversitySearchByName(universityName as string)
  const { userData, userProfileData } = useUniStore()

  const { mutate: joinCommunity, isPending: isJoinLoading } = useJoinCommunity()
  const router = useRouter()
  if (isUniversityLoading) return <Loading />

  const contactData = [
    {
      icon: MdEmail,
      title: 'Email',
      info: university?.wikiInfoBox?.email,
    },
    {
      icon: FaPhoneAlt,
      title: 'Phone',
      info: university?.collegeBoardInfo?.['Phone number'],
    },
    {
      icon: PiBuildingsFill,
      title: 'Address',
      info: university?.collegeBoardInfo?.Location,
    },
  ]

  const additionalData = [
    {
      icon: IoIosLink,
      title: 'Link',
      info: university?.collegeBoardInfo?.website,
    },
    {
      icon: FaUsers,
      title: 'Total Students',
      info: university?.topUniInfo?.studentsAndFacultiesData?.Total_students?.Total_students || university?.wikiInfoBox?.Students,
    },
    {
      icon: BsClockFill,
      title: 'Office Hours',
      info: university?.wikiInfoBox?.['Office Hours'] || 'Monday to Friday 9:00 am - 12:00 p.m. and 1:00 p.m - 5:00 p.m',
    },
  ]

  const handleClick = (universityName: string) => {
    const email = userProfileData?.email?.find((email) => email.UniversityName == universityName)
    if (!userData?.id) {
      openModal(
        <NotLoggedInModal title={'Login to Join Community'} desc={'Login or create an account to become part of Lorem University’s community! '} />,
        'w-96 p-0 rounded-md'
      )
    } else if (email && email.communityId) {
      joinCommunity(email.communityId, {
        onSuccess: () => {
          router.push(`/community/${email.communityId}`)
        },
      })
    } else if (!email) {
      openModal(<UniversityVerificationModal universityNameProp={universityName} />, 'h-max w-[450px]')
    }
  }

  return (
    <div className="flex justify-center">
      <div className=" p-4 flex flex-col gap-16 lg:gap-[120px] max-sm:px-4 overflow-x-hidden max-width-allowed ">
        <div className="flex justify-between flex-col-reverse lg:flex-row gap-8 md:gap-16 lg:gap-[67px]">
          <div className="flex flex-col  gap-4 md:gap-8 flex-1 max-h-[290px]">
            <div className="flex items-center lg:items-start gap-8 pb-4">
              <div className=" flex justify-start items-start  drop-shadow-lg rounded-full bg-white w-16 min-w-[64px] h-16  relative overflow-hidden">
                <Image fill src={university?.logos?.[0] || universityLogoPlaceholder} alt="logo" className=" object-contain" />
              </div>

              <p className="text-neutral-900 md:text-[32px] text-md font-extrabold font-poppins">{university?.name}</p>
            </div>
            <SupportingText className={` ${university?.name?.length > 36 ? 'line-clamp-2' : 'line-clamp-4'} `}>
              {university?.topUniInfo?.about || 'Not Available'}
            </SupportingText>
            {university?.isCommunityCreated ? (
              <Buttons className="w-max" onClick={() => handleClick(university?.name)}>
                Join Community
              </Buttons>
            ) : (
              <Buttons className="w-max">Endorse</Buttons>
            )}
          </div>
          <div className="relative flex-1 flex justify-center lg:max-w-[480px]  max-sm:items-center max-h-[290px] sm:min-h-[290px] min-h-[208px]">
            <Image fill className="rounded-lg  object-cover   " src={university?.images[0] || universityPlaceholder} alt="university_image" />
          </div>
        </div>
        {/* //overview  */}
        <div className="flex flex-col gap-4">
          <p className="text-neutral-900 text-base font-extrabold font-poppins text-md">Overview</p>
          <div className="flex flex-col gap-4">
            <SupportingText>
              Loremium University boasts a world-class faculty, many of whom are leaders in their respective fields. The university’s commitment to
              innovation and research has led to groundbreaking discoveries and advancements, particularly in the realms of biotechnology,
              environmental science, and digital arts. The state-of-the-art laboratories and creative studios provide students with the resources and
              inspiration needed to push the boundaries of knowledge and creativity.
            </SupportingText>

            <SupportingText>
              In addition to its scientific prowess, Loremium University is a thriving cultural hub. The university’s School of Arts is renowned for
              its avant-garde approach to art and design, producing graduates who have gone on to achieve international acclaim. Regular exhibitions,
              performances, and lectures by visiting artists and scholars enrich the campus life and foster a dynamic exchange of ideas.
            </SupportingText>
            <SupportingText>
              Loremium University is a magnet for students from around the globe, drawn by its stellar reputation and welcoming atmosphere. The
              university’s diverse student body, hailing from over 80 countries, creates a rich tapestry of cultures and perspectives. Dedicated
              support services ensure that international students feel at home, making their transition to life in Loremium seamless and enjoyable.
            </SupportingText>
          </div>
        </div>
        {/* //contact  */}
        <div className="flex flex-col gap-4 ">
          <p className="text-neutral-900 text-base font-extrabold font-poppins text-md">Contact Info</p>
          <div className="flex justify-between gap-[31px]  flex-col md:flex-row max-sm:gap-5">
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
