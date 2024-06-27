/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { SlOptionsVertical } from 'react-icons/sl'

interface FollowingItemProps {
  name: string
  university: string
  role: string
  tags: { label: string; color: string }[]
}

const UserListItem: React.FC<FollowingItemProps> = ({ name, university, role, tags }) => {
  return (
    <div className="flex items-center p-2 md:p-4 border-b border-border ">
      <img src={`/timeline/avatar.png`} alt={name} className="w-14 h-14 rounded-full mr-4" />
      <div className="flex-1">
        <h3 className="font-medium text-base text-gray-dark">{name}</h3>
        <p className="text-xs text-gray-1 mb-1">{university}</p>
        <p className="text-xs text-gray-1">{role}</p>
        <div className="mt-2 flex flex-wrap">
          {tags.map((tag, index) => (
            <span key={index} className={`text-xs px-2 py-1 rounded-full text-white mr-2 mb-2 ${tag.color}`}>
              {tag.label}
            </span>
          ))}
        </div>
      </div>
      <div className="p-2 bg-primary-50 rounded-md">
        <SlOptionsVertical className="text-primary" />
      </div>
    </div>
  )
}

export default UserListItem
