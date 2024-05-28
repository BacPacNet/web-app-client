import Footer from '@/components/Footer/Footer'
import CommunityProfileContainer from '@/components/communityProfile/CommunityProfileContainer'
import SideBar from '@/components/communityProfile/SideBar'
import React from 'react'

const communityProfile = () => {
  return (
    <>
      <div className="flex justify-center w-full gap-6 mt-20 max-md:flex-col max-md:items-center pb-10">
        <SideBar />
        <CommunityProfileContainer />
      </div>
      <Footer />
    </>
  )
}

export default communityProfile
