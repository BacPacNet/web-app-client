import CommunityProfilePost from '@/components/communityProfile/CommunityProfilePost'
import GroupInfo from '@/components/communityUniversity/GroupInfo'
import GroupSideBsr from '@/components/communityUniversity/GroupSideBsr'
import HeroSec from '@/components/communityUniversity/HeroSec'
import React from 'react'
import { IoIosArrowDown } from 'react-icons/io'
const dummyData = [
  {
    dp: 'https://cdn.pixabay.com/photo/2023/02/19/08/39/man-7799486_1280.jpg',
    content: 'Can someone help me with this chemistry equation? Here’s the link to the google drive: //https:www.butkochem.com/homework/A1-35',
    name: 'Kathryn Murphy',
  },
]

const page = () => {
  return (
    <div className="flex flex-col items-center w-full gap-6 mt-10  pb-10">
      <HeroSec />
      <div className="flex justify-center w-11/12 max-sm:w-full max-md:w-11/12  max-xl:w-full max-md:flex-col px-16 max-sm:px-4">
        <GroupSideBsr />
        <div className="w-full flex flex-col ps-4 max-md:ps-0 max-md:pt-10 gap-2">
          <GroupInfo />
          <div className="flex gap-2 text-sm pb-2 items-center font-medium">
            <p className="text-neutral-500">Sort By: Recent</p>
            <IoIosArrowDown color="#737373" />
          </div>
          <div className="border-2 border-neutral-300 rounded-md">
            <CommunityProfilePost data={dummyData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
