import React from 'react'
import { IoClose } from 'react-icons/io5'

type User = {
  _id: string
  firstName: string
}

type SelectedUserTagsProps = {
  users: User[]
  onRemove: (userId: string) => void
  displayLimit?: number
}

const SelectedUserTags: React.FC<SelectedUserTagsProps> = ({ users, onRemove, displayLimit = 9 }) => {
  const visibleUsers = users.slice(0, displayLimit)
  const remainingCount = users.length - displayLimit

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {visibleUsers.map((user) => (
        <div key={user._id} className="flex items-center gap-2 text-2xs px-2 py-1 h-7 bg-primary-500 text-white rounded-md">
          {user.firstName}
          <span onClick={() => onRemove(user._id)} className="cursor-pointer text-sm">
            <IoClose />
          </span>
        </div>
      ))}

      {remainingCount > 0 && (
        <div className="bg-neutral-200 text-primary-600 text-2xs px-2 py-1 h-7 rounded-md flex items-center">+{remainingCount}</div>
      )}
    </div>
  )
}

export default SelectedUserTags
