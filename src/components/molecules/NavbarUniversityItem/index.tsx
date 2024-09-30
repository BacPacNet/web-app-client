import UserListItemSkeleton from '@/components/Connections/UserListItemSkeleton'
import { useGetUserSubscribedCommunityGroups } from '@/services/university-community'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function NavbarUniversityItem() {
  const { data: SubscribedData, isFetching, isLoading } = useGetUserSubscribedCommunityGroups()
  const [selectUniversity, setSelectUniversity] = useState(-1)
  const router = useRouter()

  const handleUniversityClick = (index: React.SetStateAction<number>) => {
    setSelectUniversity(index)
    const indextoPush = Number(index)
    router.push(`/v2/community/${SubscribedData?.community[indextoPush]._id}`)
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
            className={`${index === selectUniversity && 'bg-[#F3F2FF]'} flex items-center gap-3 py-2 px-4 cursor-pointer`}
          >
            <Image
              width={40}
              height={40}
              className="w-[40px] h-[40px] object-cover rounded-full"
              src={community.communityLogoUrl.imageUrl}
              alt={community.name}
            />

            <p className="text-sm font-bold">{community.name}</p>
          </div>
        )
      })}
    </>
  )
}
