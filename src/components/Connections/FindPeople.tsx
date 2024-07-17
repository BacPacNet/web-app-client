'use client'
import React, { useState } from 'react'
import UserListItem from '../Timeline/UserListItem'
import { GoSearch } from 'react-icons/go'
import { cn } from '@/lib/utils'
import { useGetAllUserWithProfileData, useGetUserFollow } from '@/services/connection'
// Sample data
// const followingData = [
//   {
//     name: 'Roberta Green',
//     university: 'Nagoya University',
//     role: '2nd Yr. Undergraduate, Psychology',
//     tags: [
//       { label: '2nd Yr', color: 'bg-purple-500' },
//       { label: 'Undergraduate', color: 'bg-green' },
//       { label: 'Law', color: 'bg-red-500' },
//     ],
//   },
//   {
//     name: 'Jonathan Park',
//     university: 'Nagoya University',
//     role: '2nd Yr. Undergraduate, Law',
//     tags: [
//       { label: '2nd Yr', color: 'bg-purple-500' },
//       { label: 'Undergraduate', color: 'bg-green' },
//       { label: 'Law', color: 'bg-red-500' },
//     ],
//   },
//   {
//     name: 'Pathova Siena',
//     university: 'Nagoya University',
//     role: '4th Year PhD Lab of Semiconductors',
//     tags: [
//       { label: '4th Yr', color: 'bg-purple-500' },
//       { label: 'PhD', color: 'bg-green' },
//       { label: 'Physics', color: 'bg-cyan-500' },
//     ],
//   },
//   {
//     name: 'Danny Tela',
//     university: 'Nagoya University',
//     role: 'Assistant Professor of Molecular Neuroscience',
//     tags: [
//       { label: 'Assistant Professor', color: 'bg-purple-700' },
//       { label: 'Molecular Neuroscience', color: 'bg-red-500' },
//     ],
//   },
//   {
//     name: 'Gretha Bassuk',
//     university: 'Nagoya University',
//     role: 'Professor',
//     tags: [
//       { label: 'Professor', color: 'bg-blue-500' },
//       { label: 'Philosopy', color: 'bg-red-500' },
//     ],
//   },
// ]

type ContentType = 'Find People' | 'Following' | 'Followers'

interface TabButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
}
interface Tab {
  label: string
  value: ContentType
}
interface Filter {
  label: string
  value: string
  options: {
    label: string
    value: string
  }[]
}

const tabs: Tab[] = [
  { label: 'Find People', value: 'Find People' },
  { label: 'Following', value: 'Following' },
  { label: 'Followers', value: 'Followers' },
]
const filters: Filter[] = [
  {
    label: 'Year',
    value: 'year',
    options: [{ label: '2021`', value: '2021' }],
  },
  {
    label: 'Degree',
    value: 'degree',
    options: [{ label: 'BTech', value: 'btech' }],
  },
  {
    label: 'Major',
    value: 'major',
    options: [{ label: 'CS', value: 'cs' }],
  },
  {
    label: 'Occupation',
    value: 'occupation',
    options: [{ label: 'Student', value: 'student' }],
  },
  {
    label: 'Affilation',
    value: 'affilation',
    options: [{ label: 'Most Recent', value: 'recent' }],
  },
]

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button className={`px-4 py-[10px] hover:text-primary text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-1'}`} onClick={onClick}>
    {label}
  </button>
)

const FindPeople = ({ contentDivStyle }: { contentDivStyle?: string }) => {
  const [content, setContent] = useState<ContentType>('Find People')
  const [name, setName] = useState('')

  const { data: allUserData } = useGetAllUserWithProfileData(name, content == 'Find People')
  const { data: userFollow } = useGetUserFollow(name, content == 'Following')
  // const { data: allUserFollowing } = useGetUserFollowing(name, content == 'Following')
  // const { data: allUserFollowers } = useGetUserFollowers(name, content == 'Followers')

  console.log('users', allUserData)
  console.log('allUserFollowing', userFollow)
  // console.log('allUserFollowers', allUserFollowers)

  return (
    <div className="border border-border rounded-lg py-4 px-0 md:px-6">
      {/* Controls */}
      <div>
        <div className="flex items-center justify-start cursor-pointer">
          {tabs.map((tab) => (
            <TabButton key={tab.value} label={tab.label} isActive={content === tab.value} onClick={() => setContent(tab.value)} />
          ))}
        </div>
        <div className="flex gap-3 my-3 px-3 flex-wrap">
          {filters.map((filter) => (
            <div key={filter.value} className="flex items-center px-3 py-2 border border-primary rounded-full">
              <span className="text-xs text-primary font-medium">{filter.label}</span>
            </div>
          ))}
        </div>
        <div className="mx-3 px-5 py-[10px] border border-border rounded-full flex items-center gap-4">
          <GoSearch size={24} />
          <input onChange={(e) => setName(e.target.value)} type="text" value={name} className="text-sm" placeholder="Search People" />
        </div>
      </div>
      <div className={cn('mx-auto bg-white rounded-lg overflow-hidden overflow-y-auto custom-scrollbar', contentDivStyle)}>
        {content === 'Following' &&
          userFollow?.profile?.map((item: any, index: string) => (
            <UserListItem
              key={index}
              id={item?.users_id?.id}
              firstName={item?.users_id?.firstName}
              lastName={item?.users_id?.lastName}
              university={item?.university}
              study_year={item?.study_year}
              degree={item?.degree}
              major={item?.major}
              occupation={item?.occupation}
              imageUrl={item?.profile_dp?.imageUrl}
              type={content}
            />
          ))}
        {/* {content === 'Followers' &&
          allUserFollowers?.map((item:any, index:string) => (
            <UserListItem key={index} firstName={item?.user_id?.firstName} lastName={item?.user_id?.lastName} profile={item?.profile} />
          ))} */}
        {/* For testing Purposes */}
        {content === 'Find People' &&
          allUserData?.user?.map((item: any, index: string) => (
            <UserListItem
              key={index}
              id={item?._id}
              firstName={item?.firstName}
              lastName={item?.lastName}
              university={item?.profile?.university}
              study_year={item?.profile?.study_year}
              degree={item?.profile?.degree}
              major={item?.profile?.major}
              occupation={item?.profile?.occupation}
              imageUrl={item?.profile?.profile_dp?.imageUrl}
              type={content}
            />
          ))}
      </div>
    </div>
  )
}

export default FindPeople
