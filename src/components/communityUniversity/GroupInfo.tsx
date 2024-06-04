import React from 'react'
import { FaLock } from 'react-icons/fa'

const GroupInfo = () => {
  return (
    <div className="w-full overflow-hidden border-2 border-neutral-300 rounded-lg">
      {/* top section  */}
      <div className="h-52 relative flex justify-start items-end   ">
        <img className="absolute bottom-8 -z-10" src="https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg" alt="bg" />
        <img
          className="w-20 h-20 object-cover rounded-full ms-10 max-md:hidden "
          src="https://cdn.pixabay.com/photo/2023/02/19/08/39/man-7799486_1280.jpg"
          alt="dp"
        />
      </div>
      {/* name  */}
      <div className="flex justify-between items-center py-4 px-8">
        <div className="flex flex-col gap-1 ">
          <h6 className="font-extrabold text-lg max-lg:text-sm flex items-center gap-2">
            Butko’s Chemistry Lab Yr. 2023 <FaLock size={18} />
          </h6>
          <p className="text-sm max-sm:text-xs font-medium text-neutral-500 max-xl:max-w-sm max-lg:max-w-full">
            Undergraduate research group at the department of chemistry at Loreum’s .
          </p>
          <div className="lg:hidden flex justify-between items-center">
            <p className="text-sm font-semibold text-neutral-500 mt-4">200 Members </p>
            <button className=" bg-[#6647FF] py-2 px-3 text-white rounded-md">Join Group</button>
          </div>
        </div>
        <button className="max-lg:hidden bg-[#6647FF] py-2 px-3 text-white rounded-md">Join Group</button>
      </div>
    </div>
  )
}

export default GroupInfo
