/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { SlOptionsVertical } from 'react-icons/sl'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover'
import { useToggleFollow } from '@/services/connection'

interface FollowingItemProps {
  firstName: string
  lastName: string
  id: string
  university: string
  study_year: string
  degree: string
  major: string
  occupation: string
  imageUrl: string
  type: string
  userFollowingIDs: string[]
}

const UserListItem: React.FC<FollowingItemProps> = ({
  id,
  type,
  firstName,
  lastName,
  university,
  study_year,
  degree,
  major,
  occupation,
  imageUrl,
  userFollowingIDs,
}) => {
  const { mutate: toggleFollow } = useToggleFollow(type)

  return (
    <div className="flex items-center p-2 md:p-4 border-b border-border ">
      {imageUrl ? (
        <img src={imageUrl} alt={firstName} className="w-14 h-14 rounded-full mr-4" />
      ) : (
        <div className="w-14 h-14 rounded-full mr-4 bg-gray"></div>
      )}
      <div className="flex-1">
        <h3 className="font-medium text-base text-gray-dark">
          {firstName} {lastName}
        </h3>
        <p className="text-xs text-gray-1 mb-1">{university}</p>
        <p className="text-xs text-gray-1">
          {study_year}
          {degree}
          {major}
        </p>
        <div className="mt-2 flex flex-wrap">
          <span className={`text-xs ${study_year && 'px-2 py-1'}  rounded-full text-white mr-2 mb-2 bg-purple-500`}>
            {study_year ? study_year + 'Yr.' : ''}
          </span>
          {occupation && <span className={`text-xs ${occupation && 'px-2 py-1'} rounded-full text-white mr-2 mb-2 bg-purple-700`}>{occupation}</span>}
          <span className={`text-xs ${degree && 'px-2 py-1'} rounded-full text-white mr-2 mb-2 bg-green`}>{degree}</span>
          <span className={`text-xs ${major && 'px-2 py-1'} rounded-full text-white mr-2 mb-2 bg-red-500`}>{major}</span>
          {/* {tags?.map((tag, index) => (
            <span key={index} className={`text-xs px-2 py-1 rounded-full text-white mr-2 mb-2 ${tag.color}`}>
              {tag.label}
            </span>
          ))} */}
        </div>
      </div>
      <div className="p-2 bg-primary-50 rounded-md">
        <Popover>
          <PopoverTrigger>
            <SlOptionsVertical className="text-primary" />
          </PopoverTrigger>
          <PopoverContent className="relative right-24 bottom-10 w-36 p-5 border-none shadow-lg bg-white shadow-gray-light z-50">
            <p onClick={() => toggleFollow(id)}>{userFollowingIDs?.includes(id) ? 'Un-Follow' : 'Follow'}</p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default UserListItem
