import React from 'react'
import { HiDotsHorizontal } from 'react-icons/hi'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa6'
import { FaComment } from 'react-icons/fa'
import { CiRepeat } from 'react-icons/ci'
import { PiPaperPlaneTiltFill } from 'react-icons/pi'
import { HiMiniGif } from 'react-icons/hi2'
import { PiImageBold } from 'react-icons/pi'
import CommunityProfileCommentBox from './CommunityProfileCommentBox'
import { FaBookmark } from 'react-icons/fa'

const CommunityProfilePost = (data: any) => {
  // console.log(data.data[0])

  return (
    <>
      <div className="py-8 px-12 flex flex-col gap-6">
        {/* user details  */}
        <div className="flex justify-between items-center">
          <div className="flex  gap-4 ">
            <img className="w-14 h-14 object-cover rounded-full" src={data.data[0].dp} alt="dp" />
            <div className="">
              <h3 className="font-medium text-neutral-600">{data.data[0].name}</h3>
              <p className="text-xs text-neutral-500 mt-1">Nagoya University</p>
              <p className="text-xs text-neutral-500 ">3rd Yr. Undergraduate</p>
            </div>
          </div>
          <div className="flex gap-2">
            {data.data[0].saved && <FaBookmark />}
            <HiDotsHorizontal />
          </div>
        </div>
        {/* content  */}
        {data.data[0].media && <img className="rounded-lg h-96 object-fill max-sm:object-cover" src={data.data[0].media} alt="" />}
        <p className="font-medium text-sm text-neutral-900">{data.data[0].content}</p>

        {/* date and club  */}
        <div className="text-xs font-medium">
          <span className="text-neutral-500">3:43 PM · Feb 12, 2024 </span>
          <span className="text-neutral-400">· Post from Law Debate Club at Nagoya University</span>
        </div>
      </div>
      {/* like,views,share,repost  */}
      <div className="relative text-sm flex justify-between border-y-2 py-2 px-12  border-neutral-300">
        <p className="flex items-center gap-2 max-sm:gap-1 max-sm:text-xs">
          <FaArrowUp color={`#404040`} />
          948
          <FaArrowDown color="#D4D4D4" />
        </p>
        <p className="flex items-center gap-2">
          <FaComment color={`#D4D4D4`} />
          48 <span className="max-sm:hidden">Comments</span>
        </p>
        <p className="flex items-center gap-2">
          <CiRepeat color={`#D4D4D4`} />
          90 <span className="max-sm:hidden">Repost</span>
        </p>
        <p className="flex items-center gap-2">
          <PiPaperPlaneTiltFill color={`#D4D4D4`} />
          <span className="max-sm:hidden">Share</span>
        </p>
      </div>
      {/* comment input  */}
      <div className="relative flex gap-2 justify-between py-8 px-12 max-sm:px-8">
        <img className="w-14 h-14 object-cover rounded-full" src="https://cdn.pixabay.com/photo/2023/02/19/08/39/man-7799486_1280.jpg" alt="dp" />
        <input className="py-3 px-5 pr-16 border-neutral-300 border-2  w-10/12 rounded-full" type="text" placeholder="Add a comment..." />
        <div className="absolute flex right-14 max-sm:right-10 top-12 gap-2">
          <HiMiniGif size={24} />
          <PiImageBold size={24} />
        </div>
      </div>
      {/* comments  */}
      <div className=" px-12 max-sm:px-8 pb-10">
        <div className="flex gap-2 text-sm pb-2">
          <p className="text-neutral-800">Most Relevant</p> / <p className="text-neutral-500">Most Recent</p>
        </div>
        <CommunityProfileCommentBox />
        <p className="text-sm text-neutral-500 underline text-end pr-7 mt-4">Load More Comments</p>
      </div>
    </>
  )
}

export default CommunityProfilePost
