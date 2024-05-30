import React from 'react'
import { LiaCcVisa } from 'react-icons/lia'

const CommunityProfileBillings = () => {
  return (
    <div className="py-10 px-12 flex flex-col gap-16">
      <div className="flex flex-col gap-10">
        <h6 className="font-bold text-lg">Payment Method</h6>
        <div className="flex flex-col ">
          <label className="font-medium text-sm mb-4">Card Details</label>
          <label className="font-medium text-sm">Add another Card </label>
        </div>
        <div className="flex flex-col gap-6">
          {/* first Row  */}
          <div className="flex justify-between max-lg:flex-col">
            <div className=" flex flex-col gap-2">
              <label className="font-medium text-sm">Name on your Card</label>
              <input className="border-2 border-[#E5E5E5] w-80 h-10 max-lg:w-10/12 rounded-lg px-3" type="text" placeholder="Name" />
            </div>
            <div className=" flex flex-col gap-2">
              <label className="font-medium text-sm">Expiry</label>
              <input className="border-2 border-[#E5E5E5] w-52 h-10 rounded-lg px-3" type="text" placeholder="********" />
            </div>
          </div>
          {/* sec Row  */}
          <div className="flex justify-between max-lg:flex-col">
            <div className="relative flex flex-col gap-2">
              <label className="font-medium text-sm">Credit Card</label>
              <input
                className="border-2 border-[#E5E5E5] w-80 max-lg:w-10/12 h-10 rounded-lg px-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                type="number"
                placeholder="0000 0000 0000 0000"
              />
              <div className="absolute pt-9 right-0 max-lg:right-14  pr-3 flex items-center text-sm leading-5">
                <LiaCcVisa className="h-5 w-5 text-gray-700 cursor-pointer" />
              </div>
            </div>
            <div className=" flex flex-col gap-2">
              <label className="font-medium text-sm">CVV</label>
              <input className="border-2 border-[#E5E5E5] w-52 h-10 rounded-lg px-3" type="text" placeholder="****" />
            </div>
          </div>
        </div>
        <div className="flex flex-col min-h-[100px]">
          <label className="font-medium text-sm mb-4">Billing History</label>
        </div>
      </div>
    </div>
  )
}

export default CommunityProfileBillings
