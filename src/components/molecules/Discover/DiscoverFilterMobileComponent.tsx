import Buttons from '@/components/atoms/Buttons'
import React from 'react'
import { IoIosSearch } from 'react-icons/io'

const DiscoverFilterMobileComponent = () => {
  return (
    <div className="p-4 flex flex-col gap-4">
      <h3 className="  text-neutral-700 text-[24px] font-poppins ">Search Filter</h3>
      <div className=" flex items-center gap-4 ">
        {/* <Buttons className="py-3 px-4 text-xs" variant="border">
          Type
        </Buttons> */}
        <Buttons size="small" variant="border">
          Type
        </Buttons>
        <Buttons size="small" variant="border">
          Country
        </Buttons>
        <Buttons size="small" variant="border">
          City
        </Buttons>
        <Buttons size="small" variant="primary">
          Reset
        </Buttons>
      </div>
      <div className="w-full flex flex-col relative">
        <IoIosSearch size={20} className="absolute left-2 z-30 top-1/2 -translate-y-1/2" />
        <input
          className=" py-2 ps-8 pe-3 border-2 border-neutral-200 focus:ring-2 rounded-full drop-shadow-sm  text-neutral-400  outline-none "
          placeholder="Search"
          type="text"
          // {...register('Search', {})}
        />
      </div>
    </div>
  )
}

export default DiscoverFilterMobileComponent
