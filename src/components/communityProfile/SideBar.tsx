import React from 'react'
import { FiEdit } from 'react-icons/fi'
import { BiSolidGraduation } from 'react-icons/bi'
import { FaUniversity } from 'react-icons/fa'
import { FaPhone } from 'react-icons/fa6'
import { IoLocationSharp } from 'react-icons/io5'
import { MdEmail } from 'react-icons/md'
import { HiMiniCake } from 'react-icons/hi2'

const SideBar = () => {
  return (
    <div className="w-[20%] h-max min-w-[300px] max-md:w-9/12 overflow-hidden border-2 border-[#737373] rounded-lg">
      {/* top section  */}
      <div className="h-40 relative flex justify-center items-end gap-28 max-md:gap-[62%] max-sm:gap-[40%]  ">
        <img className="absolute bottom-8 -z-10" src="https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg" alt="bg" />
        <img className="w-16 h-16 object-cover rounded-full" src="https://cdn.pixabay.com/photo/2023/02/19/08/39/man-7799486_1280.jpg" alt="dp" />
        <p className="flex items-center gap-3 text-xs mb-2 text-[#6647FF] cursor-pointer">
          Edit Profile{' '}
          <span>
            <FiEdit />
          </span>
        </p>
      </div>
      {/* name  */}
      <div className="flex flex-col gap-1 py-4 px-8">
        <h3 className="font-bold">Kathryn Murphy</h3>
        <p className="text-xs text-neutral-500">Junior student major at Law, Nagoya University</p>
      </div>
      {/* details  */}
      <div className="flex flex-col max-md:flex-row max-sm:flex-col gap-2 max-md:gap-8 max-sm:gap-2 py-4 px-8 text-xs font-medium">
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-4">
            <span>
              <BiSolidGraduation size={24} />
            </span>
            3rd Year, Undergraduate, Law
          </p>
          <p className="flex items-center gap-4">
            <span>
              <FaUniversity size={24} />
            </span>
            Department of Liberal Arts
          </p>
          <p className="flex items-center gap-4">
            <span>
              <IoLocationSharp size={24} />
            </span>
            London, United Kingdom
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-4">
            <span>
              <MdEmail size={24} />
            </span>
            kathrynmurphy@gmail.com
          </p>
          <p className="flex items-center gap-4">
            <span>
              <FaPhone size={24} />
            </span>
            +44-3028-3239
          </p>
          <p className="flex items-center gap-4">
            <span>
              <HiMiniCake size={24} />
            </span>
            April 3rd, 2002
          </p>
        </div>
      </div>
      {/* connection  */}
      <div className="py-4 px-8 flex flex-col gap-2">
        <p>Connections</p>
        <div className="w-44 flex text-[#6647FF] text-xs justify-between">
          <p className="tabular-nums">68 Following</p>
          <p>21 Followers</p>
        </div>
      </div>
    </div>
  )
}

export default SideBar
