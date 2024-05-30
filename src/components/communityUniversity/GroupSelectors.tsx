import React from 'react'
import { FaStar } from 'react-icons/fa'

const GroupSelectors = ({ setCurrSelectedGroup, currSelectedGroup, data }: any) => {
  return (
    <div
      onClick={() => setCurrSelectedGroup(data.name)}
      className={`${
        currSelectedGroup == data.name
          ? 'bg-[#F3F2FF] max-md:bg-white max-md:after:h-[4px] after:rounded-full'
          : 'border-t-2 max-md:border-0 border-neutral-300'
      } flex w-full  justify-between items-center gap-1 py-2 px-3 first-of-type:border-0  relative after:content-[''] after:absolute after:left-3 after:z-50 after:top-[calc(90%+10px)]  after:w-[calc(60%)]  after:bg-[#6647FF] `}
    >
      <img className="w-10 h-10 object-cover rounded-full" src={data.icon} alt="dp" />
      <label className=" max-md:hidden font-medium text-sm text-center">{data.name}</label>
      <FaStar className="max-md:hidden" size={24} color="#F59E0B" />
    </div>
  )
}

export default GroupSelectors
