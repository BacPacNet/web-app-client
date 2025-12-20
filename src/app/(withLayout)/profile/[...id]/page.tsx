'use client'

import ProfilePostContainer from '@/components/organisms/ProfilePostContainer'
import { UserProfileCard } from '@/components/organisms/ProfileCard'

import { Skeleton } from '@/components/ui/Skeleton'
import { useCheckSelfProfile } from '@/lib/utils'
import { useGetUserData } from '@/services/user'

import React, { useRef } from 'react'
import EmptyStateCard from '@/components/molecules/EmptyStateCard'
import notMember from '@/assets/notCommunityMember.svg'
import ErrorCard from '@/components/molecules/ErrorCard'
import { MESSAGES } from '@/content/constant'

export default function Profile({ params }: { params: { id: string } }) {
  const userId = params.id[0]

  const isSelfProfile = useCheckSelfProfile(userId)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: userProfileData, isLoading: isUserProfileDataLoading, isError: isUserProfileDataError } = useGetUserData(userId)

  const { profile, firstName, lastName, isBlocked } = userProfileData || {}
  const {
    bio,
    university_name,
    universityLogo,
    followers,
    following,
    study_year,
    major,
    degree,
    phone_number,
    country,
    dob,
    city,
    affiliation,
    occupation,
    role,
    displayEmail,
    email,
    communities,
    university_id,
  } = profile || {}
  //  const { logos } = university || {}

  if (isUserProfileDataError) {
    return <ErrorCard title={MESSAGES.USER_NOT_FOUND} description={MESSAGES.USER_NOT_FOUND_DESCRIPTION} />
  }

  const IsUniversityVerified = (): boolean => {
    return email?.some((university) => university.UniversityName === university_name) || false
  }

  return (
    <div ref={containerRef} className="h-with-navbar py-4 overflow-y-scroll hideScrollbar">
      {isUserProfileDataLoading || !userProfileData ? (
        <Skeleton className="w-full h-60 bg-slate-300" />
      ) : (
        <UserProfileCard
          name={`${firstName} ${lastName}`}
          isPremium={true}
          description={bio || ''}
          university={university_name || 'Lorem University'}
          following={following?.length || 0}
          followers={followers?.length || 0}
          year={study_year || ''}
          degree={degree || ''}
          major={major || ''}
          role={role || ''}
          affiliation={affiliation || ''}
          occupation={occupation || ''}
          email={displayEmail || ''}
          phone={phone_number || ''}
          location={city || ''}
          birthday={dob || ''}
          avatarUrl={profile?.profile_dp?.imageUrl || ''}
          isVerifiedUniversity={IsUniversityVerified()}
          country={country || ''}
          isSelfProfile={isSelfProfile}
          userId={userId}
          universityLogo={universityLogo || ''}
          isBlockedByYou={isBlocked || false}
          communities={communities || []}
          activeUniversityId={university_id || ''}
          activeUniversityName={university_name || ''}
        />
      )}
      <ProfilePostContainer source="profile" userId={userId} containerRef={containerRef} />
    </div>
  )
}
