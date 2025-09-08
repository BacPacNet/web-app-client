'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { AllFiltersCommunityGroupPost } from '@/types/CommuityGroup'
import React, { useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { FiMoreHorizontal } from 'react-icons/fi'

type CommunityGroupPostFilterDropDownProps = {
  changePostFilter: (filter: string) => void
  filterPostBy: string
  pendingPostCount: number
}
const CommunityGroupPostFilterDropDown = ({ changePostFilter, filterPostBy, pendingPostCount }: CommunityGroupPostFilterDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        {/* <div>
          <p>{filterPostBy}</p>
        </div> */}
        <button
          className={`mt-4 flex justify-between gap-1 items-center border border-neutral-200 rounded-lg py-3 px-4  text-2xs font-medium font-inter text-neutral-700 h-10 bg-white shadow-sm min-w-[135px]`}
        >
          <p>
            {filterPostBy.length > 0
              ? AllFiltersCommunityGroupPost[filterPostBy as keyof typeof AllFiltersCommunityGroupPost]
              : AllFiltersCommunityGroupPost['allPosts']}
          </p>
          <div className="flex items-center gap-1">
            {filterPostBy == AllFiltersCommunityGroupPost['pendingPosts'] ? (
              <p className="bg-red-500 rounded-full min-w-[16px] min-h-[16px] flex items-center justify-center text-white font-inter font-semibold text-[8px]">
                {pendingPostCount > 0 ? pendingPostCount : null}
              </p>
            ) : null}

            <BiChevronDown className="w-4 h-4 ml-2" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent onClick={() => setIsOpen(false)} className="relative top-0 right-0 w-[135px] border-none  bg-white shadow-card p-0">
        <div className="flex flex-col">
          <div onClick={() => changePostFilter('')} className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 px-4 py-2">
            <p className="text-2xs font-medium font-inter text-neutral-700">{AllFiltersCommunityGroupPost['allPosts']}</p>
          </div>
        </div>
        <div onClick={() => changePostFilter('myPosts')} className="flex flex-col">
          <div className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 px-4 py-2">
            <p className="text-2xs font-medium font-inter text-neutral-700">{AllFiltersCommunityGroupPost['myPosts']}</p>
          </div>
        </div>
        <div onClick={() => changePostFilter('pendingPosts')} className="flex flex-col">
          <div className="flex gap-2 items-center cursor-pointer hover:bg-slate-200 px-4 py-2">
            <p className="text-2xs font-medium font-inter text-neutral-700">{AllFiltersCommunityGroupPost['pendingPosts']}</p>
            <p className="bg-red-500 rounded-full min-w-[16px] min-h-[16px] flex items-center justify-center text-white font-inter font-semibold text-[8px]">
              {pendingPostCount > 0 ? pendingPostCount : null}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CommunityGroupPostFilterDropDown
