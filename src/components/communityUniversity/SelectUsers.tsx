import React from 'react'

type media = {
  imageUrl: string
  publicId: string
}
type User = {
  _id: string
  firstName: string
  isOnline?: boolean
  profile: {
    profile_dp: media
    _id: string
    university_name?: string
    study_year?: string
    degree?: string
  }
}

type props = {
  setSelectedUsers: (value: User[]) => void
  selectedUsers: User[]
  data: User
}

const SelectUsers = ({ data, selectedUsers, setSelectedUsers }: props) => {
  const handleClick = () => {
    if (selectedUsers?.some((item) => item._id == data._id)) {
      const filterd = selectedUsers.filter((item) => item._id !== data._id)
      setSelectedUsers(filterd)
    } else {
      setSelectedUsers([...selectedUsers, data])
    }
  }

  const isSelected = selectedUsers.some((item) => item._id === data._id)
  return (
    <div className="flex justify-between w-full">
      <div className="flex items-center gap-2">
        {data?.profile?.profile_dp?.imageUrl ? (
          <img className="w-10 h-10 rounded-full object-cover" src={data?.profile?.profile_dp?.imageUrl} alt="" />
        ) : (
          <div className="bg-orange w-10 h-10 rounded-full"></div>
        )}
        <div>
          <p className="text-sm font-semibold">{data?.firstName}</p>
          <p className="text-2xs text-neutral-500">{data?.profile?.university_name ? data?.profile?.university_name : 'Not Availaible'}</p>
          <p className="text-2xs text-neutral-500">
            {data?.profile?.study_year} {data?.profile?.study_year ? 'Year' : ''} {data?.profile?.degree}
          </p>
        </div>
      </div>
      <input onChange={handleClick} className="w-4" type="checkbox" checked={isSelected} />
    </div>
  )
}

export default SelectUsers
