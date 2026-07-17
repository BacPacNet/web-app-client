'use client'

import { HiOutlineBuildingLibrary, HiOutlineDocumentText } from 'react-icons/hi2'

type Props = {
  groupCount: number
  postCount: number
}

export default function ModerationStatsBadges({ groupCount, postCount }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-primary-50 px-3 py-1 text-3xs font-semibold text-primary-500">
        <HiOutlineBuildingLibrary size={14} />
        {groupCount} Group{groupCount === 1 ? '' : 's'}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-3xs font-semibold text-green-700">
        <HiOutlineDocumentText size={14} />
        {postCount} Post{postCount === 1 ? '' : 's'}
      </span>
    </div>
  )
}
