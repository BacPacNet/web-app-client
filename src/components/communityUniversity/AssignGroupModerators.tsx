import { useGetCommunityGroupUsers, useUserGroupRole } from '@/services/community-university'
import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
type Props = {
  setAssignUsers: (value: boolean) => void
  assignUsers: boolean
  id: string
}

const AssignGroupModerators = ({ setAssignUsers, assignUsers, id }: Props) => {
  const [searchInput, setSearchInput] = useState('')
  const { data } = useGetCommunityGroupUsers(id, assignUsers, searchInput)
  const { mutate: userGroupRole } = useUserGroupRole()

  const handleChange = (e: any, communityGroupId: string, id: string) => {
    const data = {
      role: e.target.value,
      communityGroupId: communityGroupId,
      id: id,
    }
    userGroupRole(data)
  }
  return (
    <>
      {assignUsers && (
        <>
          <div className="fixed   w-full h-[100%] top-0 left-0 bg-black opacity-50 z-10"></div>

          <div className="fixed   w-full h-[100%] top-0 left-0 bg-black opacity-50 z-50"></div>
          <div className="fixed w-2/4 max-sm:w-11/12 z-50 h-3/4   top-[10%] bg-white flex flex-col items-center gap-6 shadow-lg px-10 py-6 rounded-lg">
            <div className="flex justify-between w-full">
              <h3>Change User Role</h3>
              <RxCross2 onClick={() => setAssignUsers(false)} size={24} color="#737373" />
            </div>
            {/* search  */}
            <div className="relative w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                type="text"
                placeholder="Search users by name"
                className="w-full pl-12 pr-3 py-2 text-gray-500 bg-transparent outline-none border border-neutral-300  rounded-2xl"
              />
            </div>
            {/* uses  */}
            {data?.user?.map((item: any) => (
              <div key={item._id} className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                  {item?.profile?.profile_dp?.imageUrl ? (
                    <img className="w-10 h-10 rounded-full object-cover" src={item?.profile?.profile_dp?.imageUrl} alt="" />
                  ) : (
                    <div className="bg-orange w-10 h-10 rounded-full"></div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{item?.firstName}</p>
                    <p className="text-xs ">{item?.profile?.university_name ? item?.profile?.university_name : 'Not Availaible'}</p>
                    <p className="text-xs">
                      {item?.profile?.study_year} {item?.profile?.study_year ? 'Year' : ''} {item?.profile?.degree}
                    </p>
                  </div>
                </div>
                {/* <input onChange={handleClick} className="w-4" type="checkbox" checked={isSelected} /> */}
                <select
                  onChange={(e) => handleChange(e, item.communityGroup.communityGroupId, item._id)}
                  defaultValue={item.communityGroup.role}
                  className="border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-40"
                >
                  {/* <option value="" disabled selected></option> */}
                  <option value="Member">Member</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export default AssignGroupModerators
