'use client'

import ProfilePostContainer from '@/components/organisms/PostsContainer'
import { UserProfileCard } from '@/components/organisms/ProfileCard'

import { Skeleton } from '@/components/ui/Skeleton'
import { useCheckSelfProfile } from '@/lib/utils'
import { useGetUserData } from '@/services/user'

import React, { useRef } from 'react'

export default function Profile({ params }: { params: { id: string } }) {
  const userId = params.id[0]

  const isSelfProfile = useCheckSelfProfile(userId)
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: userProfileData, isLoading: isUserProfileDataLoading } = useGetUserData(userId)

  const { profile, firstName, lastName, email, university_id, university } = userProfileData || {}
  const { bio, university_name, followers, following, study_year, major, degree, phone_number, country, dob, city, affiliation, occupation, role } =
    profile || {}
  const { logos } = university || {}

  return (
    <div className="h-with-navbar py-4 hideScrollbar">
      {isUserProfileDataLoading || !userProfileData ? (
        <Skeleton className="w-full h-60 bg-slate-300" />
      ) : (
        <UserProfileCard
          name={`${firstName} ${lastName}`}
          isPremium={true}
          description={bio || ''}
          university={university_name || 'Lorem University'}
          isVerified={true}
          following={following?.length || 0}
          followers={followers?.length || 0}
          year={study_year || ''}
          degree={degree || ''}
          major={major || ''}
          role={role || ''}
          affiliation={affiliation || ''}
          occupation={occupation || ''}
          email={email || ''}
          phone={phone_number || ''}
          location={city}
          birthday={dob || ''}
          avatarUrl={profile?.profile_dp?.imageUrl || ''}
          isVerifiedUniversity={true}
          country={country || ''}
          isSelfProfile={isSelfProfile}
          userId={userId}
          universityLogo={logos?.[0] || ''}
        />
      )}
      <ProfilePostContainer userId={userId} containerRef={containerRef} />
    </div>
  )
}
