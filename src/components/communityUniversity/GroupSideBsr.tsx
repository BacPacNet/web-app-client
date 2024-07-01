'use client'
import React, { useState } from 'react'
import { TiFilter } from 'react-icons/ti'
import GroupSelectors from './GroupSelectors'
import GroupFilterPopUp from './GroupFilterPopUp'
import CreateNewGroup from './CreateNewGroup'

const GroupSideBsr = ({ data, currSelectedGroup, setCurrSelectedGroup, isJoined }: any) => {
  const [currGroup, setCurrGroup] = useState('All')
  const [showPopUp, setShowPopUp] = useState(false)
  const [showNewGroup, setShowNewGroup] = useState(false)

  return (
    <>
      <div className="flex flex-col min-w-[300px] w-1/4 max-md:w-full h-max max-md:mx-auto border-2 border-neutral-300 rounded-md">
        <div className="  p-4  flex flex-col gap-4">
          <div className="flex justify-between">
            <h6 className="font-extrabold text-lg text-neutral-900">Groups</h6>
            <button
              onClick={() => setShowPopUp(true)}
              className="flex gap-2 items-center font-medium text-sm text-[#6647FF] border-2 border-[#6647FF] p-1 rounded-xl"
            >
              Filter By <TiFilter />
            </button>
          </div>
          {/* search  */}
          <div className="relative max-w-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border border-neutral-300  rounded-2xl"
            />
          </div>
          {/* filter all  */}
          <div
            className=" relative flex gap-3 h-10 font-medium
            after:content-[''] after:absolute after:-right-4 after:top-[calc(100%+3px)] after:w-[calc(100%+32px)] after:h-[2px] 
             after:bg-neutral-300 "
          >
            <label
              onClick={() => setCurrGroup('All')}
              className={`${
                currGroup == 'All'
                  ? "relative after:content-[''] after:absolute after:-right-1 after:z-30 after:top-[calc(100%+3px)] after:w-[calc(100%+10px)] after:h-[2px] after:bg-[#6647FF]"
                  : 'text-neutral-500'
              } `}
            >
              All
            </label>
            <label
              onClick={() => setCurrGroup('Starred')}
              className={`${
                currGroup == 'Starred'
                  ? "relative after:content-[''] after:absolute after:-right-1 after:z-30 after:top-[calc(100%+3px)] after:w-[calc(100%+10px)] after:h-[2px] after:bg-[#6647FF]"
                  : 'text-neutral-500'
              } `}
            >
              Starred
            </label>
            <label
              onClick={() => setCurrGroup('Your Groups')}
              className={`${
                currGroup == 'Your Groups'
                  ? "relative after:content-[''] after:absolute after:-right-1 after:z-30 after:top-[calc(100%+3px)] after:w-[calc(100%+10px)] after:h-[2px] after:bg-[#6647FF]"
                  : 'text-neutral-500'
              } `}
            >
              Your Groups
            </label>
          </div>
        </div>
        {currGroup == 'All' ? (
          <div className="max-md:overflow-x-scroll min-h-[412.8px] max-md:min-h-[100px]">
            <div className="flex flex-col max-md:flex-row max-md:gap-8 max-md:w-max">
              {!isJoined ? (
                <div className="text-center">Join Community</div>
              ) : (
                data?.groups.map((item: any) => (
                  <GroupSelectors key={item.title} currSelectedGroup={currSelectedGroup} setCurrSelectedGroup={setCurrSelectedGroup} data={item} />
                ))
              )}
              {isJoined && <p className="text-sm text-neutral-500 underline text-end pr-7 mt-4 underline-offset-2 p-2">Load More</p>}
            </div>
          </div>
        ) : currGroup == 'Your Groups' ? (
          <div className="min-h-[412.8px] max-md:min-h-[100px] w-full flex flex-col items-center relative after:content-[''] after:absolute after:right-0 after:z-10 after:top-[calc(20%+10px)] max-md:after:top-[calc(75%+10px)] after:w-[calc(100%)] after:h-[2px] after:bg-neutral-300">
            <button onClick={() => setShowNewGroup(true)} className="bg-[#6647FF]   py-3 px-5 my-4 text-white rounded-md">
              Create your Group
            </button>
          </div>
        ) : (
          <div className=" min-h-[412.8px] max-md:min-h-[100px]"></div>
        )}
      </div>
      {showPopUp && <GroupFilterPopUp setShowPopUp={setShowPopUp} />}
      {showNewGroup && <CreateNewGroup setNewGroup={setShowNewGroup} />}
    </>
  )
}

export default GroupSideBsr
