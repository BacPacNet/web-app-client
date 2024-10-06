import { useRouter } from 'next/navigation'
import React from 'react'
import { FaStar } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'

const GroupSelectors = ({ setCurrSelectedGroup, currSelectedGroup, data, setAssignUsers, userId, paramGroupId, SetcurrClickedID }: any) => {
  const router = useRouter()
  const handleGroupNavigate = () => {
    setCurrSelectedGroup(data)
    router.push(`/community/${data?.communityId}/${data?._id}`)
  }
  return (
    <div
      className={`flex items-center ${
        paramGroupId && paramGroupId == data?._id
          ? 'bg-[#F3F2FF] max-md:bg-white max-md:after:h-[4px] after:rounded-full'
          : 'border-t-2 max-md:border-0 border-neutral-300'
      }  `}
    >
      <div
        onClick={() => handleGroupNavigate()}
        className={`flex w-full   items-center gap-1 py-2 px-3 first-of-type:border-0  relative after:content-[''] after:absolute after:left-3 after:z-30 after:top-[calc(90%+10px)]  after:w-[calc(60%)]  after:bg-[#6647FF] `}
      >
        {data?.communityGroupLogoUrl?.imageUrl ? (
          <img className="w-10 h-10 object-cover rounded-full" src={data?.communityGroupLogoUrl.imageUrl} alt="dp" />
        ) : (
          <div className="w-10 h-10 object-cover rounded-full bg-green-500 z-10"></div>
        )}
        <label className=" max-md:hidden font-medium text-xs ">{data?.title}</label>
        {/* <FaStar className="max-md:hidden" size={24} color="#F59E0B" /> */}
      </div>
      {data?.adminUserId._id == userId && (
        <button
          onClick={() => {
            setAssignUsers(true), SetcurrClickedID({ id: data?._id, group: true })
          }}
          className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-2 w-max h-max  rounded-full   max-lg:text-sm max-md:mr-0"
        >
          <IoMdSettings />
        </button>
      )}
    </div>
  )
}

export default GroupSelectors
