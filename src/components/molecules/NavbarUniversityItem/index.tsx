import GroupSearchBox from '@/components/atoms/GroupSearchBox'
import GroupSelectors from '@/components/communityUniversity/GroupSelectors'
import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { useGetCommunityGroups } from '@/services/community-university'
import { useGetUserSubscribedCommunityGroups } from '@/services/university-community'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FiFilter } from 'react-icons/fi'
import { PiFilesFill } from 'react-icons/pi'
import Tabs from '../Tabs'

export default function NavbarUniversityItem() {
  const { data: SubscribedData, isFetching, isLoading } = useGetUserSubscribedCommunityGroups()
  const [currSelectedGroup, setCurrSelectedGroup] = useState(null)
  const router = useRouter()
  const { id }: any = useParams()

  const { data: communityGroups } = useGetCommunityGroups(id, true)

  const tabData = [
    {
      label: 'All',
      content: (
        <>
          {communityGroups &&
            communityGroups?.groups.map((communityGroup: any) => (
              <GroupSelectors
                key={communityGroup.title}
                //currSelectedGroup={currSelectedGroup}
                //setCurrSelectedGroup={setCurrSelectedGroup}
                communityGroup={communityGroup}
              />
            ))}
        </>
      ),
    },
    {
      label: 'Joined',
      content: <div>This is the content of Tab 2.</div>,
    },
    {
      label: 'Your Group',
      content: <div>This is the content of Tab 3.</div>,
    },
  ]

  const handleUniversityClick = (index: React.SetStateAction<number>) => {
    const indextoPush = Number(index)
    router.push(`/community/${SubscribedData?.community[indextoPush]._id}`)
  }

  if (isFetching || isLoading) return <UserListItemSkeleton />

  if (SubscribedData?.community.length === 0) return <p>Join Your University</p>

  return (
    <>
      {SubscribedData?.community.map((community, index) => {
        return (
          <div
            key={index}
            onClick={() => handleUniversityClick(index)}
            className={`${id === community._id && 'bg-[#F3F2FF]'} flex items-center gap-3 py-2 px-4 cursor-pointer`}
          >
            <Image
              width={40}
              height={40}
              className="w-[40px] h-[40px] object-cover rounded-full"
              src={community.communityLogoUrl.imageUrl}
              alt={community.name}
            />

            <p className="text-xs">{community.name}</p>
          </div>
        )
      })}
      <p className="px-4 pb-4 pt-9 text-neutral-500 text-2xs font-bold">UNIVERSITY GROUPS</p>
      <div className="flex items-center justify-center gap-6 py-2">
        <div className="flex items-center justify-center bg-white rounded-full gap-3 ">
          <div
            style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
            className="flex items-center justify-center bg-white rounded-full w-[40px] h-[40px]"
          >
            <PiFilesFill className="text-[#3A169C] text-[20px]" />
          </div>
          <GroupSearchBox placeholder="Search Groups" type="text" />
        </div>
      </div>
      <div className="flex gap-2 justify-evenly cursor-pointer mt-4">
        <div
          style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.04), 0px 1px 2px 0px rgba(16, 24, 40, 0.04)' }}
          className="border-2 border-solid border-neutral-200 rounded-lg "
        >
          <div className="flex gap-6 justify-center items-center h-8 px-4 ">
            <p className="text-xs text-neutral-700">Filter</p>
            <FiFilter width={16} height={16} className="text-primary-500 font-bold" />
          </div>
        </div>
        <div
          style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.04), 0px 1px 2px 0px rgba(16, 24, 40, 0.04)' }}
          className="border-2 border-solid border-neutral-200 rounded-lg "
        >
          <div className="flex gap-6 justify-center items-center h-8 px-4">
            <p className="text-xs text-neutral-700">Filter</p>
            <FiFilter width={16} height={16} className="text-primary-500 font-bold" />
          </div>
        </div>
      </div>
      <Tabs tabs={tabData} />
    </>
  )
}
