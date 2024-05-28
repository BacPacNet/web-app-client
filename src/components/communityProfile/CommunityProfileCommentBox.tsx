import React from 'react'
import { HiDotsHorizontal } from 'react-icons/hi'
import { FaArrowUp, FaArrowDown } from 'react-icons/fa6'
import { CgMailReply } from 'react-icons/cg'

const CommunityProfileCommentBox = () => {
  return (
    <>
      <div className="flex   gap-5 max-sm:gap-2">
        <img className="w-14 h-14 object-cover rounded-full" src="https://cdn.pixabay.com/photo/2023/02/19/08/39/man-7799486_1280.jpg" alt="dp" />
        <div className="w-10/12 border-2 border-neutral-300 rounded-md py-3 px-5">
          <div className="flex justify-between">
            <p className="text-neutral-600 font-medium">Johnny Nitro</p>
            <HiDotsHorizontal />
          </div>
          <p className="text-neutral-400 text-xs">2hr</p>
          <p className="text-sm text-neutral-900 mt-2">
            Thanks for having me as the first participant. Really looking forward to debating Roberta Green on Israel Palestine War!
          </p>
        </div>
      </div>
      <div className="flex justify-end pr-7 max-sm:text-xs max-sm:pr-2 gap-10 mt-2">
        <p className="flex items-center gap-2">
          <FaArrowUp color={`#404040`} />
          448
          <FaArrowDown color="#D4D4D4" />
        </p>
        <p className="flex items-center gap-2">
          <CgMailReply size={24} color={`#404040`} />
          Reply
        </p>
      </div>
    </>
  )
}

export default CommunityProfileCommentBox
