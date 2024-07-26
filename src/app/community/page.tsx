'use client'
import React from 'react'
import Footer from '@/components/Footer/Footer'
import UniversityCard from '@/components/universityCommunity/universityCommunityCart'
import { useGetUserSubscribedCommunityGroups } from '@/services/university-community'
import Loading from '../loading'

interface CommunityType {
  _id: string
  communityLogoUrl: {
    imageUrl: string
  }
  name: string
  collegeID: string
}
const Page = () => {
  const { data: SubscribedData, isFetching } = useGetUserSubscribedCommunityGroups()

  if (isFetching) return <Loading />

  return (
    <>
      <div className="flex flex-col min-h-[62vh] items-center ">
        <h3 className="py-10 text-xl font-bold text-neutral-700">Joined Communities</h3>
        {SubscribedData?.community?.length ? (
          <div className="flex gap-10 flex-wrap justify-center">
            {SubscribedData?.community?.map((item: CommunityType) => (
              <UniversityCard
                key={item?._id}
                universityLogo={item?.communityLogoUrl?.imageUrl}
                UniversityName={item?.name}
                UniversityAddress={item?.collegeID}
                UniversityLink={item?._id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 items-center mt-10 max-sm:px-6 ">
            <h3 className="text-4xl max-sm:text-3xl font-semibold max-w-xl text-center text-neutral-700">
              You have yet to join university communities!
            </h3>
            <p className="text-lg text-neutral-500 max-w-xl text-center">
              Search your university and start connecting with other applicants, current students, or faculty.
            </p>
            <button className="text-primary bg-primary-50 px-4 py-2 rounded-lg mt-5">Discover Page</button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Page
