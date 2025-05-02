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
  if (users.length < displayLimit) {
    return (
      <div className="flex gap-2 flex-wrap">
        {users.map((user) => (
          <div key={user._id} className="flex items-center gap-2 text-2xs px-2 py-1 h-7 bg-primary-500 text-white rounded-md">
            {user.firstName}
            <span onClick={() => onRemove(user._id)} className="cursor-pointer text-sm">
              <IoClose />
            </span>
          </div>
        ))}
      </div>
    )
  }

  return <div className="bg-secondary py-[2px] px-[6px] text-[10px] text-primary-500 rounded-sm h-5">{users.length}</div>
}

export default SelectedUserTags
