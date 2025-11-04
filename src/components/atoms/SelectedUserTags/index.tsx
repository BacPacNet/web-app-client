'use client'
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'

type User = {
  _id: string
  firstName: string
}

type SelectedUserTagsProps = {
  users: User[]
  onRemove: (userId: string) => void
  displayLimit?: number
  step?: number
}

const SelectedUserTags: React.FC<SelectedUserTagsProps> = ({ users, onRemove, displayLimit = 9, step = 10 }) => {
  const [visibleCount, setVisibleCount] = useState(displayLimit)

  const visibleUsers = users.slice(0, visibleCount)
  const remainingCount = users.length - visibleCount
  const allVisible = visibleCount >= users.length

  const handleSeeMore = () => {
    if (allVisible) {
      setVisibleCount(displayLimit)
    } else {
      setVisibleCount((prev) => Math.min(prev + step, users.length))
    }
  }

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {visibleUsers.map((user) => (
        <div key={user._id} className="flex items-center gap-2 text-xs px-2 py-1 h-7 bg-primary-500 text-white rounded-md">
          {user.firstName}
          <span onClick={() => onRemove(user._id)} className="cursor-pointer text-sm" role="button" aria-label={`Remove ${user.firstName}`}>
            <IoClose />
          </span>
        </div>
      ))}

      {users.length > displayLimit && (
        <div onClick={handleSeeMore} className="cursor-pointer bg-neutral-200 text-primary-600 text-xs px-2 py-1 h-7 rounded-md flex items-center">
          {allVisible ? 'Show Less' : `+${remainingCount}`}
        </div>
      )}
    </div>
  )
}

export default SelectedUserTags
