import React from 'react'

const SelectUsers = ({ data, selectedUsers, setSelectedUsers }: any) => {
  //   console.log('dd', data)

  const handleClick = () => {
    if (selectedUsers?.some((item: any) => item._id == data._id)) {
      const filterd = selectedUsers.filter((item: any) => item._id !== data._id)
      setSelectedUsers(filterd)
    } else {
      setSelectedUsers([...selectedUsers, data])
    }
  }

  //   console.log(selectedUsers?.some((item) => item.id == data.id))
  const isSelected = selectedUsers.some((item: any) => item._id === data._id)
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
          <p className="text-xs ">{data?.profile?.university_name ? data?.profile?.university_name : 'Not Availaible'}</p>
          <p className="text-xs">
            {data?.profile?.study_year} {data?.profile?.study_year ? 'Year' : ''} {data?.profile?.degree}
          </p>
        </div>
      </div>
      <input onChange={handleClick} className="w-4" type="checkbox" checked={isSelected} />
    </div>
  )
}

export default SelectUsers
