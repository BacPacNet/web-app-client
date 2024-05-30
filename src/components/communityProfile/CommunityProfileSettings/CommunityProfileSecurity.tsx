import React from 'react'
import { IoMdDesktop } from 'react-icons/io'
import { BsFillPhoneFill } from 'react-icons/bs'

const CommunityProfileSecurity = () => {
  return (
    <div className="py-10 px-12 flex flex-col gap-16">
      <div className="flex flex-col gap-10">
        <h6 className="font-bold text-lg">Two Factor Authentication</h6>

        <div className=" flex flex-col items-center gap-2">
          <label className="font-medium text-sm">SMS Authentication</label>
          <input className="border-2 border-[#E5E5E5] w-80 h-10 rounded-lg px-3" type="text" placeholder="+18 3206-5165" />
          <button className="mx-auto text-sm bg-[#6647FF] py-2 px-3 rounded-md text-white max-w-max">Send Code</button>
        </div>
        <div className=" flex flex-col items-center gap-2">
          <label className="font-medium text-sm">Email Authentication</label>
          <input className="border-2 border-[#E5E5E5] w-80 h-10 rounded-lg px-3" type="text" placeholder="test123@unibuzz_college.com" />
          <button className="mx-auto text-sm bg-[#6647FF] py-2 px-3 rounded-md text-white max-w-max">Send Code</button>
        </div>

        <h6 className="font-bold text-lg pt-8">Connected Devices</h6>

        <div className="flex flex-col gap-10">
          {/* desktop  */}
          <div className="flex justify-between items-center">
            <div className="flex  gap-4 items-center">
              <IoMdDesktop size={28} />
              <div className="">
                <label className="text-sm font-medium text-neutral-900">Windows</label>
                <div className="flex gap-1">
                  <p className="text-xs font-medium text-neutral-500 mt-1">Jung-gu, Republic of Korea</p>
                  <p className="text-xs bg-green rounded-full py-[2px] px-3 text-white">Active Now</p>
                </div>
              </div>
            </div>
            <button className=" text-sm font-medium py-2 px-3 text-[#EF4444] border-2 border-[#EF4444] rounded-lg">Log Out of Device</button>
          </div>
          {/* phone  */}
          <div className="flex justify-between items-center">
            <div className="flex  gap-4 items-center">
              <BsFillPhoneFill size={28} />
              <div className="">
                <label className="text-sm font-medium text-neutral-900">Windows</label>
                <div className="flex gap-1">
                  <p className="text-xs font-medium text-neutral-500 mt-1">Jung-gu, Republic of Korea</p>
                  <p className="text-xs font-medium text-neutral-500 mt-1">· 10 hours ago</p>
                </div>
              </div>
            </div>
            <button className=" text-sm font-medium py-2 px-3 text-[#EF4444] border-2 border-[#EF4444] rounded-lg">Log Out of Device</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityProfileSecurity
