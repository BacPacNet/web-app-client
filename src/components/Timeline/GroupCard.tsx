import React from 'react'
import Buttons from '../atoms/Buttons'
import { useRouter } from 'next/navigation'
import { GroupRecommendation } from '@/types/Recommendation'
import Image from 'next/image'

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
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          {group.communityGroupLogoUrl ? (
            <Image src={group.communityGroupLogoUrl} alt={`${group.name} logo`} width={48} height={48} className="w-full h-full object-cover" />
          ) : (
            <span className="text-primary font-bold text-md">{group.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <p className="font-semibold text-neutral-700 text-xs flex items-center gap-1">{group.name}</p>
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default GroupCard
