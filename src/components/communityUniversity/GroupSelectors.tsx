import { useRouter } from 'next/navigation'
import React from 'react'
import { FaStar, FaUniversity } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import { PiStudentFill } from 'react-icons/pi'

const GroupSelectors = ({
  setCurrSelectedGroup,
  currSelectedGroup,
  data,
  userId,
  selectedCommuntyGroupdId,
  SetcurrClickedID,
  selectCommunityId,
  handleAssignUsersModal,
  toggleLeftNavbar,
}: any) => {
  const router = useRouter()
  const handleGroupNavigate = () => {
    setCurrSelectedGroup(data)
    router.push(`/community/${selectCommunityId}/${data?._id}`)
    toggleLeftNavbar && toggleLeftNavbar()
  }
  const isSelected = selectedCommuntyGroupdId === data?._id

  return (
    <div
      className={`flex items-center cursor-pointer hover:bg-secondary ${
        isSelected ? 'bg-secondary max-md:bg-white max-md:after:h-[4px] after:rounded-full' : 'max-md:border-0 border-neutral-300'
      }  `}
    >
      <div
        onClick={() => handleGroupNavigate()}
        className={`flex w-full   items-center gap-3 py-2 first-of-type:border-0  relative after:content-[''] after:absolute after:left-3 after:z-30 after:top-[calc(90%+10px)]  after:w-[calc(60%)]  after:bg-[#6647FF] `}
      >
        {data?.communityGroupLogoUrl?.imageUrl ? (
          <img className="w-10 h-10 object-cover rounded-full" src={data?.communityGroupLogoUrl.imageUrl} alt="dp" />
        ) : (
          <PiStudentFill className="w-10 h-10 p-2 rounded-full text-primary bg-white shadow-lg " />
        )}
        <label className={`text-xs  text-neutral-700 ${isSelected ? 'font-semibold' : 'font-medium'} `}>
          {data?.title || data?.communityGroupName}
        </label>
      </div>
      {data?.adminUserId === userId && (
        <button
          onClick={() => {
            handleAssignUsersModal(), SetcurrClickedID({ id: data?._id, group: true })
          }}
          className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-2 w-max h-max mr-4 rounded-full   max-lg:text-sm max-md:mr-0"
        >
          <IoMdSettings />
        </button>
      )}
    </div>
  )
}

export default GroupSelectors
