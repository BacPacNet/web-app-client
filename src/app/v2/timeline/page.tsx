import UniversityCard from '@/components/molecules/UniversityCard'
import LeftNavbar from '@/components/organisms/LeftNavbar'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import React from 'react'

export default function Timeline() {
  return (
    <div className="flex h-screen gap-8  py-8 px-4">
      <div className="w-1/5 hidden md:block">
        <LeftNavbar />
      </div>
      <div className="w-3/5">
        <UniversityCard
          universityLogo={''}
          universityName={'Lorem University'}
          isAiPowered={true}
          joinedSince={'07/12/23'}
          description={
            'Official community page for Lorem University. For inquiries contact the Human Resources Department in B-Wing of Northern Campus.'
          }
          memberCount={200}
        />
        <UserPostContainer />
      </div>
      <div className="w-1/5 rounded-2xl shadow-2xl bg-white hidden lg:block"></div>
    </div>
  )
}
