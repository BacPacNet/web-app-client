import { useGetCommunityGroupUsers, useGetCommunityUsers, useUserCommunityRole, useUserGroupRole } from '@/services/community-university'
import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
type Props = {
  setAssignUsers: (value: boolean) => void
  assignUsers: boolean
  id: string
  isGroup: boolean
}

const AssignGroupModerators = ({ setAssignUsers, assignUsers, id, isGroup }: Props) => {
  const [searchInput, setSearchInput] = useState('')
  const { data } = useGetCommunityGroupUsers(id, assignUsers, searchInput, isGroup)
  const { data: communityUsers } = useGetCommunityUsers(id, !isGroup, 'Private', searchInput)
  const { mutate: userGroupRole } = useUserGroupRole()
  const { mutate: userCommunityRole } = useUserCommunityRole()
  const handleChange = (e: any, communityGroupId: string, postId: string, item: any) => {
    if (!isGroup) {
      const data = {
        role: e.target.value,
        communityId: id,
        userID: item?._id,
      }
      userCommunityRole(data)
    } else {
      const data = {
        role: e.target.value,
        communityGroupId: communityGroupId,
        id: postId,
      }
      userGroupRole(data)
    }
  }

  const render = () => {
    switch (isGroup) {
      case true:
        return data?.user?.map((item: any) => (
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
            <select
              onChange={(e) => handleChange(e, item.communityGroup.communityGroupId, item._id, item)}
              defaultValue={item.communityGroup.role}
              className="border outline-none py-2 rounded-lg border-gray-light font-normal text-sm text-center w-40"
            >
              <option value="Member">Member</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>
        ))

      case false:
        return communityUsers?.user?.map((item: any) => (
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

            <select
              onChange={(e) => handleChange(e, item?.communityGroup?.communityGroupId, item?._id, item)}
              defaultValue={item.userVerifiedCommunities.find((university: any) => university.communityId == id).role}
              className="border outline-none py-2 rounded-lg border-gray-light font-normal text-sm text-center w-40"
            >
              <option value="Member">Member</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>
        ))
    }
  }

  return (
    <div className="h-96">
      <div className="flex justify-between w-full">
        <h3>Change User Role</h3>
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
      {render()}
      {/* </div> */}
    </div>
  )
}

export default AssignGroupModerators
