import { CommunityGroupTypeEnum } from '@/types/CommuityGroup'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { IoIosPeople } from 'react-icons/io'
import officialLogo from '@assets/official-logo.svg'
import mixpanel from 'mixpanel-browser'
import { TRACK_EVENT } from '@/content/constant'

const GroupSelectors = ({
  setCurrSelectedGroup,
  data,
  selectedCommuntyGroupdId,
  selectCommunityId,
  toggleLeftNavbar,
  selectedCommunityImage,
}: any) => {
  const router = useRouter()
  const handleGroupNavigate = () => {
    setCurrSelectedGroup(data)

    router.push(`/community/${selectCommunityId}/${data?._id}`)
    mixpanel.track(TRACK_EVENT.COMMUNITY_GROUP_PAGE_VIEW, {
      communityId: selectCommunityId,
      groupId: data?._id,
      groupName: data?.title,
    })
    toggleLeftNavbar && toggleLeftNavbar()
  }
  const isSelected = selectedCommuntyGroupdId === data?._id

  const isGroupOfficial = data?.communityGroupType === CommunityGroupTypeEnum.OFFICIAL

  return (
    <div
      className={`flex items-center cursor-pointer rounded-md hover:bg-neutral-100 ${
        isSelected ? 'bg-secondary max-md:bg-white max-md:after:h-[4px] after:rounded-full' : 'max-md:border-0 border-neutral-300'
      }  `}
    >
      <div
        onClick={() => handleGroupNavigate()}
        className={`flex w-full  items-center gap-3 py-2 px-2  first-of-type:border-0  relative after:content-[''] after:absolute after:left-3 after:z-30 after:top-[calc(90%+10px)]  after:w-[calc(60%)]  after:bg-[#6647FF] `}
      >
        <div
          className={`relative z-1 ${
            isGroupOfficial ? 'w-12 h-12 border-2 border-neon flex justify-center items-center rounded-full shadow-card' : ''
          } `}
        >
          {data?.communityGroupLogoUrl?.imageUrl ? (
            <Image
              width={40}
              height={40}
              className="w-10 h-10 object-cover rounded-full shadow-card flex-none"
              src={data?.communityGroupLogoUrl?.imageUrl}
              alt="dp"
            />
          ) : (
            <IoIosPeople className="w-11 h-11 p-2 rounded-full text-primary shadow-logo bg-white  " />
          )}

          {isGroupOfficial && (
            <div className="absolute bg-white -bottom-2 w-5 h-5 border-2 border-neon rounded-full flex justify-center">
              <Image className="object-contain rounded-full" src={officialLogo as string} width={12} height={12} alt="" />
            </div>
          )}
        </div>

        <label className={`text-xs ${isSelected ? 'text-neutral-700 font-bold' : 'text-neutral-500 font-medium'} `}>
          {data?.title || data?.communityGroupName}
        </label>
      </div>
      {/* {data?.adminUserId === userId && (
        <button
          onClick={() => {
            handleAssignUsersModal(), SetcurrClickedID({ id: data?._id, group: true })
          }}
          className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-2 w-max h-max mr-4 rounded-full   max-lg:text-sm max-md:mr-0"
        >
          <IoMdSettings />
        </button>
      )} */}
    </div>
  )
}

export default GroupSelectors
