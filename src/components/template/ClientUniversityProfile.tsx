'use client'
import Loading from '@/components/atoms/Loading'
import { useUniversitySearchByName } from '@/services/universitySearch'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MdEmail } from 'react-icons/md'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaPhoneAlt, FaUsers } from 'react-icons/fa'
import { HiArrowRight } from 'react-icons/hi'
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
import { showCustomInfoToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { MESSAGES } from '@/content/constant'
import { userTypeEnum } from '@/types/RegisterForm'
import { useQueryClient } from '@tanstack/react-query'
import GenericInfoModal from '@/components/molecules/VerifyUniversityToJoinModal/VerifyUniversityToJoinModal'
import UniversityInfoCard from '@/components/atoms/UniversityInfoCard'
import DiscoverPostCard from '@/components/molecules/DiscoverPostCard'
import { PostType } from '@/types/constants'
import { useGetUniversitiesHighlightedPostd } from '@/services/universitySearch'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { cn } from '@/lib/utils'

export default function ClientUniversityProfile({ universityName }: { universityName: string }) {
  const { openModal } = useModal()
  const queryClient = useQueryClient()
  const { data: university, isLoading: isUniversityLoading, isFetching } = useUniversitySearchByName(universityName)
  const { userData, userProfileData, setUserProfileCommunities } = useUniStore()
  const [imageSrc, setImageSrc] = useState(university?.campus || universityPlaceholder)
  const [logoSrc, setLogoSrc] = useState(university?.logo || universityLogoPlaceholder)
  const [imageCarasol, setImageCarasol] = useState<{
    isShow: boolean
    images: any
    currImageIndex: number | null
  }>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })

  const { mutate: joinCommunityFromUniversity, isPending: isJoinLoading } = useJoinCommunityFromUniversity()
  const { data: highlightedPosts, isLoading: isHighlightedPostsLoading } = useGetUniversitiesHighlightedPostd(university?._id || '')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFloatingCta, setShowFloatingCta] = useState(false)
  const bottomSentinelRef = useRef<HTMLDivElement>(null)

  const totalPosts = highlightedPosts?.length || 0

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

  useEffect(() => {
    if (isUniversityLoading || isFetching || !university?.isAllowedToJoin) {
      setShowFloatingCta(false)
      return
    }

    const bottom = bottomSentinelRef.current
    if (!bottom) return

    setShowFloatingCta(false)

    const updateFloatingCta = (isBottomIntersecting: boolean) => {
      if (window.scrollY === 0) {
        setShowFloatingCta(false)
        return
      }
      setShowFloatingCta(!isBottomIntersecting)
    }

    const handleScroll = () => {
      const rect = bottom.getBoundingClientRect()
      const isBottomVisible = rect.top < window.innerHeight && rect.bottom > 0
      updateFloatingCta(isBottomVisible)
    }

    const bottomObserver = new IntersectionObserver(([entry]) => updateFloatingCta(entry.isIntersecting), { threshold: 0 })

    window.addEventListener('scroll', handleScroll, { passive: true })
    bottomObserver.observe(bottom)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      bottomObserver.disconnect()
    }
  }, [isUniversityLoading, isFetching, university?.isAllowedToJoin, university?._id])

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
      return
    }

    const isStudentOrFaculty = userProfileData?.role === userTypeEnum.Student || userProfileData?.role === userTypeEnum.Faculty
    const partneredUniversity = userProfileData?.email?.[0]
    const isJoiningDifferentUniversity =
      !!partneredUniversity?.UniversityName &&
      (partneredUniversity.communityId
        ? partneredUniversity.communityId !== university?.communityId
        : partneredUniversity.UniversityName.toLowerCase() !== university?.name?.toLowerCase())

    if (isStudentOrFaculty && isJoiningDifferentUniversity) {
      router.push('/timeline')
      showCustomInfoToast(MESSAGES.ALREADY_AFFILIATED_WITH_UNIVERSITY(partneredUniversity.UniversityName))
      return
    }

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

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalPosts - 1 ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPosts - 1 : prev - 1))
  }

  const floatingCtaLabel = isCommunityAlreadyJoined ? 'View community' : 'Join community'
  const floatingCtaSubtext = isCommunityAlreadyJoined ? 'Go to your university community' : 'Connect with students and faculty'

  return (
    <div className="flex justify-center">
      {university?.isAllowedToJoin && (
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 px-4 py-4 bg-neutral-300/40 transition-all duration-300 ease-out flex justify-center items-center',
            showFloatingCta ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
          aria-hidden={!showFloatingCta}
        >
          <button
            type="button"
            disabled={isJoinLoading}
            onClick={isCommunityAlreadyJoined ? handleViewCommunity : handleClick}
            className={cn(
              'w-full max-w-[385px] flex items-center  bg-primary-500 text-white rounded-2xl px-5 py-4 ',
              ' hover:scale-105 transition-transform',
              isJoinLoading && 'opacity-70 cursor-not-allowed'
            )}
          >
            <div className="shrink-0 mr-2 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-poppins font-bold text-base leading-tight capitalize">{floatingCtaLabel}</p>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
              <p className="font-poppins text-xs font-normal text-white/90 mt-0.5">{floatingCtaSubtext}</p>
            </div>
            <HiArrowRight className="shrink-0 w-4 h-4 text-white" />
          </button>
        </div>
      )}
      <div className="py-16 flex flex-col gap-16 lg:gap-24 px-4 overflow-x-hidden w-full max-w-[768px] mx-auto items-center text-center">
        <div className="flex flex-col gap-8 md:gap-16 items-center w-full">
          <div className="relative w-full flex justify-center max-sm:items-center max-h-[290px] sm:min-h-[290px] min-h-[208px] bg-neutral-300 rounded-2xl overflow-hidden">
            <Image
              onError={() => setImageSrc(universityPlaceholder)}
              fill
              className="rounded-2xl object-cover"
              src={imageSrc}
              alt="university_image"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8/B8AAtsA5tSY3jYAAAAASUVORK5CYII="
            />
          </div>
          <div className="flex flex-col gap-4 md:gap-8 items-center w-full">
            <div className="flex items-center justify-center gap-8 pb-4">
              <div className="flex justify-start items-start  rounded-full bg-white w-16 min-w-[64px] h-16  relative overflow-hidden">
                <Image onError={() => setLogoSrc(universityLogoPlaceholder)} fill src={logoSrc} alt="logo" className="object-contain" />
              </div>
              <p className="text-neutral-700 md:text-lg-small text-md font-extrabold font-poppins">{university?.name}</p>
            </div>
            <SupportingText>{university?.short_overview || 'Not Available'}</SupportingText>
            {/* {university?.isAllowedToJoin && (
              <div className="w-full flex justify-center">
                {isCommunityAlreadyJoined ? (
                  <Buttons variant="shade" className="w-max" size="large" onClick={handleViewCommunity}>
                    View Community
                  </Buttons>
                ) : (
                  <Buttons disabled={isJoinLoading} className="w-[270px]" size="large" onClick={handleClick}>
                    Join Community
                  </Buttons>
                )}
              </div>
            )} */}
          </div>
        </div>

        {/* univeristy post  */}
        {highlightedPosts?.length > 0 && (
          <div className="w-full min-h-[calc(100vh-290px)] flex flex-col items-center gap-8">
            <p className="text-neutral-700 font-extrabold font-poppins text-md md:text-md-big shrink-0">From the University</p>

            <div className="w-full flex-1 flex flex-col md:flex-row items-center justify-center gap-4 min-h-0 h-full">
              {totalPosts > 1 && (
                <div
                  onClick={handlePrev}
                  className="hidden md:flex shrink-0 w-12 h-12 bg-primary-500 rounded-full items-center justify-center cursor-pointer self-center"
                >
                  <FaChevronLeft color="white" strokeWidth={2} />
                </div>
              )}

              {highlightedPosts?.[currentIndex] && (
                <div className="flex-1 min-h-0 w-full flex items-start justify-center">
                  <DiscoverPostCard
                    key={highlightedPosts[currentIndex]?._id}
                    user={highlightedPosts[currentIndex]?.user?.firstName + ' ' + highlightedPosts[currentIndex]?.user?.lastName}
                    adminId={highlightedPosts[currentIndex]?.user?._id}
                    university={highlightedPosts[currentIndex]?.profile?.university_name}
                    year={highlightedPosts[currentIndex]?.profile?.study_year}
                    text={highlightedPosts[currentIndex]?.content}
                    date={highlightedPosts[currentIndex]?.createdAt}
                    avatarLink={highlightedPosts[currentIndex]?.profile?.profile_dp?.imageUrl}
                    postID={highlightedPosts[currentIndex]?._id}
                    type={'communityId' in highlightedPosts[currentIndex] ? PostType.Community : PostType.Timeline}
                    images={highlightedPosts[currentIndex]?.imageUrl || []}
                    setImageCarasol={setImageCarasol}
                    idx={currentIndex}
                    major={highlightedPosts[currentIndex]?.profile?.major}
                    affiliation={highlightedPosts[currentIndex]?.profile?.affiliation}
                    occupation={highlightedPosts[currentIndex]?.profile?.occupation}
                    role={highlightedPosts[currentIndex]?.profile?.role}
                    communityName={highlightedPosts[currentIndex]?.communityName}
                    communityGroupName={highlightedPosts[currentIndex]?.communityGroupName}
                    isCommunityAdmin={highlightedPosts[currentIndex]?.profile?.isCommunityAdmin}
                    communities={highlightedPosts[currentIndex]?.profile?.communities}
                  />
                </div>
              )}

              {totalPosts > 1 && (
                <div
                  onClick={handleNext}
                  className="hidden md:flex shrink-0 w-12 h-12 bg-primary-500 rounded-full items-center justify-center cursor-pointer self-center"
                >
                  <FaChevronRight color="white" strokeWidth={2} />
                </div>
              )}

              {totalPosts > 1 && (
                <div className="flex md:hidden items-center justify-center gap-4">
                  <div
                    onClick={handlePrev}
                    className="shrink-0 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <FaChevronLeft color="white" strokeWidth={2} />
                  </div>
                  <div
                    onClick={handleNext}
                    className="shrink-0 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <FaChevronRight color="white" strokeWidth={2} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* //overview  */}
        <div className="flex flex-col gap-4 items-center">
          <p className="text-neutral-700 font-extrabold font-poppins text-md md:text-md-big">University Overview</p>
          <div className="flex flex-col gap-4">
            <SupportingText>{university?.long_description}</SupportingText>
          </div>
        </div>

        {/* //contact  */}
        <div className="flex flex-col gap-8 items-center w-full">
          <p className="text-neutral-700 text-base font-extrabold font-poppins text-md">Contact Info</p>
          <div className="flex justify-center gap-8 flex-col md:flex-row max-sm:gap-5 w-full">
            <div className="bg-neutral-200 p-5 w-full max-w-[474px] min-w-0 flex-1 h-[300px] rounded-lg flex flex-col gap-8">
              {contactData.map((item, index) => (
                <UniversityInfoCard key={index} icon={item.icon} title={item.title} info={item.info} />
              ))}
            </div>
            <div className="bg-neutral-200 p-5 w-full max-w-[474px] min-w-0 flex-1 h-[300px] rounded-lg flex flex-col gap-8">
              {additionalData.map((item, index) => (
                <UniversityInfoCard key={index} icon={item.icon} title={item.title} info={item.info} />
              ))}
            </div>
          </div>
        </div>
        <div ref={bottomSentinelRef} className="h-px w-full shrink-0" aria-hidden />
      </div>
    </div>
  )
}
