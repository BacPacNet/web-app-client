import React from 'react'
import { useRouter } from 'next/navigation'
import { GroupRecommendation } from '@/types/Recommendation'
import Image from 'next/image'
import { CommunityGroupTypeEnum } from '@/types/CommuityGroup'
import { IoIosPeople } from 'react-icons/io'
import officialLogo from '@assets/official-logo.svg'

interface GroupCardProps {
  group: GroupRecommendation
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
  const router = useRouter()

  // Get the first category and its subcategories for display
  const firstCategory = Object.entries(group.communityGroupCategory)[0]
  const categoryName = firstCategory ? firstCategory[0] : ''

  return (
    <div className="flex justify-between items-center">
      <div
        onClick={() => {
          router.push(`/community/${group.communityId}/${group.group_id}`)
        }}
        className="flex gap-2 items-center hover:cursor-pointer"
      >
        <div
          className={`flex w-full  items-center gap-3 py-2 px-2  first-of-type:border-0  relative after:content-[''] after:absolute after:left-3 after:z-30 after:top-[calc(90%+10px)]  after:w-[calc(60%)]  after:bg-[#6647FF] `}
        >
          <div
            className={`relative z-1 ${
              group.communityGroupType === CommunityGroupTypeEnum.OFFICIAL
                ? 'w-13 h-13 border-2 border-neon flex justify-center items-center rounded-full shadow-card'
                : ''
            } `}
          >
            {group?.communityGroupLogoUrl ? (
              <Image
                width={40}
                height={40}
                className="w-12 h-12 object-cover rounded-full shadow-card flex-none"
                src={group?.communityGroupLogoUrl}
                alt="dp"
              />
            ) : (
              <IoIosPeople className="w-12 h-12 p-2 rounded-full text-primary shadow-logo bg-white  " />
            )}

            {group.communityGroupType === CommunityGroupTypeEnum.OFFICIAL && (
              <div className="absolute bg-white -bottom-2 w-5 h-5 border-2 border-neon rounded-full flex justify-center">
                <Image className="object-contain rounded-full" src={officialLogo as string} width={12} height={12} alt="" />
              </div>
            )}
          </div>

          <label className={`text-xs `}>{group?.name}</label>
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default GroupCard
